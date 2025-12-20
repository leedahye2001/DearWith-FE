"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { installNativeCallbacks, uninstallNativeCallbacks, NATIVE_EVENTS } from "@/lib/native/event";

const PERM_KEY = "dearwith:pushPermissionEnabled";

export function savePushPermission(enabled: boolean) {
  try {
    localStorage.setItem(PERM_KEY, enabled ? "1" : "0");
  } catch {}
}
export function loadPushPermission(): boolean | null {
  try {
    const v = localStorage.getItem(PERM_KEY);
    if (v === null) return null;
    return v === "1";
  } catch {
    return null;
  }
}

export default function NativeBridgeProvider() {
  const router = useRouter();

  useEffect(() => {
    installNativeCallbacks();

    window.dearwithAuth = window.dearwithAuth || {};

    const prevApple = window.dearwithAuth.onAppleLoginComplete;
    const prevKakao = window.dearwithAuth.onKakaoLoginComplete;
    const prevEmail = window.dearwithAuth.onEmailLoginComplete;

    window.dearwithAuth.onAppleLoginComplete = (payload: NativeSocialLoginPayload) => {
      if ("error" in payload && payload.error) {
        alert(payload.message ?? "애플 로그인 실패");
        return;
      }
      if (payload.needSignUp) {
        router.push(
          `/signup?provider=${encodeURIComponent(payload.provider ?? "APPLE")}&socialId=${encodeURIComponent(
            payload.socialId ?? ""
          )}`
        );
        return;
      }
      router.replace("/main");
    };

    window.dearwithAuth.onKakaoLoginComplete = (payload: NativeSocialLoginPayload) => {
      if ("error" in payload && payload.error) {
        alert(payload.message ?? "카카오 로그인 실패");
        return;
      }
      if (payload.needSignUp) {
        router.push(
          `/signup?provider=${encodeURIComponent(payload.provider ?? "KAKAO")}&socialId=${encodeURIComponent(
            payload.socialId ?? ""
          )}`
        );
        return;
      }
      router.replace("/main");
    };

    window.dearwithAuth.onEmailLoginComplete = (payload: NativeEmailLoginPayload) => {
      if ("error" in payload && payload.error) {
        alert(payload.message ?? "이메일 로그인 실패");
        return;
      }
      router.replace("/main");
    };

    // ✅ Push permission event
    const onPushPerm = (e: Event) => {
      const { enabled } = (e as CustomEvent<PushPermissionNativePayload>).detail;
      savePushPermission(!!enabled);
    };

    // ✅ Deep link event (푸시 탭도 여기로 들어옴)
    const onDeepLink = (e: Event) => {
      const { url } = (e as CustomEvent<{ url: string }>).detail || {};
      if (!url) return;

      console.log("[deepLink] received:", url);

      try {
        // 절대 URL이면 path만 뽑아서 Next 라우팅
        const u = new URL(url);
        router.push(u.pathname + u.search + u.hash);
      } catch {
        // 상대경로면 그대로 push
        router.push(url);
      }
    };

    window.addEventListener(NATIVE_EVENTS.PUSH_PERMISSION, onPushPerm as EventListener);
    window.addEventListener(NATIVE_EVENTS.DEEP_LINK, onDeepLink as EventListener);

    return () => {
      window.removeEventListener(NATIVE_EVENTS.PUSH_PERMISSION, onPushPerm as EventListener);
      window.removeEventListener(NATIVE_EVENTS.DEEP_LINK, onDeepLink as EventListener);

      if (window.dearwithAuth) {
        window.dearwithAuth.onAppleLoginComplete = prevApple;
        window.dearwithAuth.onKakaoLoginComplete = prevKakao;
        window.dearwithAuth.onEmailLoginComplete = prevEmail;
      }

      uninstallNativeCallbacks();
    };
  }, [router]);

  return null;
}
