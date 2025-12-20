

import { generateUUID } from "./uuid";

// ------------------------------
// Env detection
// ------------------------------
export function isIOSNative(): boolean {
  return typeof window !== "undefined" && !!window.webkit?.messageHandlers;
}

export function isAndroidNative(): boolean {
  return typeof window !== "undefined" && !!window.Android;
}

export function isNativeApp(): boolean {
  return isIOSNative() || isAndroidNative();
}

// iOS에서 Apple 로그인 가능 여부 (버튼 노출용)
export function isAppleNative(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.webkit?.messageHandlers?.appleLogin;
}

// ------------------------------
// Web -> Native: Login triggers
// ------------------------------
export function requestAppleLogin(): boolean {
  if (typeof window === "undefined") return false;

  // iOS
  if (window.webkit?.messageHandlers?.appleLogin) {
    window.webkit.messageHandlers.appleLogin.postMessage({ action: "APPLE_LOGIN" });
    return true;
  }

  // Android
  if (window.Android?.appleLogin) {
    window.Android.appleLogin(JSON.stringify({ action: "APPLE_LOGIN" }));
    return true;
  }

  return false;
}

export function requestKakaoLogin(): boolean {
  if (typeof window === "undefined") return false;

  // iOS
  if (window.webkit?.messageHandlers?.kakaoLogin) {
    window.webkit.messageHandlers.kakaoLogin.postMessage({ action: "KAKAO_LOGIN" });
    return true;
  }

  // Android
  if (window.Android?.kakaoLogin) {
    window.Android.kakaoLogin(JSON.stringify({ action: "KAKAO_LOGIN" }));
    return true;
  }

  return false;
}

export function requestEmailLogin(email: string, password: string): boolean {
  if (typeof window === "undefined") return false;

  // iOS
  if (window.webkit?.messageHandlers?.emailLogin) {
    window.webkit.messageHandlers.emailLogin.postMessage({ email, password });
    return true;
  }

  // Android
  if (window.Android?.emailLogin) {
    window.Android.emailLogin(JSON.stringify({ email, password }));
    return true;
  }

  return false;
}

// ------------------------------
// Web -> Native: Share
// ------------------------------
export function requestShare(payload: { text?: string; url?: string }): boolean {
  if (typeof window === "undefined") return false;

  // iOS
  if (window.webkit?.messageHandlers?.share) {
    window.webkit.messageHandlers.share.postMessage(payload);
    return true;
  }

  // Android
  if (window.Android?.share) {
    window.Android.share(JSON.stringify(payload));
    return true;
  }

  return false;
}

// ------------------------------
// Native token bridge (Promise)
// ------------------------------
export type NativeTokenResponse =
  | { requestId: string; ok: true; accessToken: string; serverOk?: boolean }
  | { requestId: string; ok: false; code?: string; message?: string; serverOk?: boolean };

type TokenBridgeHandler = "getAccessToken" | "refreshAccessToken" | "logout";

type PendingItem = {
  resolve: (v: NativeTokenResponse) => void;
  timer: ReturnType<typeof setTimeout>;
};

const pending = new Map<string, PendingItem>();

let tokenResponseBound = false;

function ensureDearwithAuth() {
  if (typeof window === "undefined") return;
  window.dearwithAuth = window.dearwithAuth || {};

  if (!tokenResponseBound) {
    tokenResponseBound = true;

    window.dearwithAuth.onNativeTokenResponse = (payload: NativeTokenResponse) => {
      if (!payload?.requestId) return;

      const item = pending.get(payload.requestId);
      if (!item) return;

      clearTimeout(item.timer);
      pending.delete(payload.requestId);
      item.resolve(payload);
    };
  }
}

function postToNative(handler: TokenBridgeHandler, msg: { requestId: string }): boolean {
  // iOS
  const mh = window.webkit?.messageHandlers;
  if (mh && handler in mh) {
    const handlerObj = mh[handler as keyof typeof mh];
    if (handlerObj && 'postMessage' in handlerObj) {
      (handlerObj as { postMessage: (msg: { requestId: string }) => void }).postMessage(msg);
      return true;
    }
  }

  // Android
  const android = window.Android;
  if (android && handler in android) {
    const handlerFn = android[handler as keyof typeof android];
    if (typeof handlerFn === 'function') {
      handlerFn(JSON.stringify(msg));
      return true;
    }
  }

  return false;
}

function requestNative(handler: TokenBridgeHandler): Promise<NativeTokenResponse> {
  if (typeof window === "undefined") {
    return Promise.resolve({
      requestId: "SSR",
      ok: false,
      code: "NO_WINDOW",
      message: "not in browser",
    });
  }

  ensureDearwithAuth();

  const requestId = generateUUID();

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      resolve({ requestId, ok: false, code: "TIMEOUT", message: "native bridge timeout" });
    }, 8000);

    pending.set(requestId, { resolve, timer });

    const ok = postToNative(handler, { requestId });
    if (!ok) {
      clearTimeout(timer);
      pending.delete(requestId);
      resolve({ requestId, ok: false, code: "NO_NATIVE", message: "not in native app" });
    }
  });
}

let accessTokenCache: string | null = null;
let inflightGet: Promise<string | null> | null = null;

export async function nativeGetAccessToken(): Promise<string | null> {
  if (!isNativeApp()) return null;
  if (accessTokenCache) return accessTokenCache;
  if (inflightGet) return inflightGet;

  inflightGet = (async () => {
    const res = await requestNative("getAccessToken");
    const token = res.ok ? res.accessToken : null;
    accessTokenCache = token;
    inflightGet = null;
    return token;
  })();

  return inflightGet;
}

export async function nativeRefreshAccessToken(): Promise<string | null> {
  if (!isNativeApp()) return null;

  const res = await requestNative("refreshAccessToken");
  const token = res.ok ? res.accessToken : null;

  // refresh 성공하면 캐시 갱신
  accessTokenCache = token;
  return token;
}

export async function nativeLogout(): Promise<{ ok: boolean; serverOk?: boolean }> {
  if (!isNativeApp()) return { ok: false };

  const res = await requestNative("logout");

  accessTokenCache = null;

  if (!res.ok) return { ok: false, serverOk: res.serverOk };
  return { ok: true, serverOk: res.serverOk };
}

export function requestPushPermissionStatus(): boolean {
  if (typeof window === "undefined") return false;

  if (window.webkit?.messageHandlers?.getPushPermission) {
    window.webkit.messageHandlers.getPushPermission.postMessage({});
    return true;
  }
  if (window.Android?.getPushPermission) {
    window.Android.getPushPermission(JSON.stringify({}));
    return true;
  }
  return false;
}

export function openNotificationSettings(): boolean {
  if (typeof window === "undefined") return false;

  if (window.webkit?.messageHandlers?.openNotificationSettings) {
    window.webkit.messageHandlers.openNotificationSettings.postMessage({});
    return true;
  }
  if (window.Android?.openNotificationSettings) {
    window.Android.openNotificationSettings(JSON.stringify({}));
    return true;
  }
  return false;
}

export function requestPushPermission(): boolean {
  if (typeof window === "undefined") return false;

  // iOS
  if (window.webkit?.messageHandlers?.requestPushPermission) {
    window.webkit.messageHandlers.requestPushPermission.postMessage({});
    return true;
  }

  // Android
  if (window.Android?.requestPushPermission) {
    window.Android.requestPushPermission(JSON.stringify({}));
    return true;
  }

  return false;
}
