const DEVICE_INFO_KEY = "dearwith:deviceInfo";
const PUSH_REG_CACHE_KEY = "dearwith:pushRegistered"; // { fp, at }

// 12 hours TTL
export const PUSH_REGISTER_TTL_MS = 12 * 60 * 60 * 1000;

export function isIOSNative(): boolean {
  return typeof window !== "undefined" && !!window.webkit?.messageHandlers;
}

export function isAndroidNative(): boolean {
  return typeof window !== "undefined" && !!window.Android;
}

export function isNativeApp(): boolean {
  return isIOSNative() || isAndroidNative();
}

// ------------------------------
// Web -> Native helpers
// ------------------------------

export function requestAppleLogin(): boolean {
  if (typeof window === "undefined") return false;

  // iOS
  if (window.webkit?.messageHandlers?.appleLogin) {
    window.webkit.messageHandlers.appleLogin.postMessage({ action: "APPLE_LOGIN" });
    return true;
  }

  // Android (if implemented)
  if (window.Android?.appleLogin) {
    window.Android.appleLogin(JSON.stringify({ action: "APPLE_LOGIN" }));
    return true;
  }

  return false;
}

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
// Local persistence helpers
// ------------------------------

export function saveDeviceInfo(deviceInfo: PushDeviceNativePayload) {
  try {
    localStorage.setItem(DEVICE_INFO_KEY, JSON.stringify(deviceInfo));
  } catch {}
}

export function loadDeviceInfo(): PushDeviceNativePayload | null {
  try {
    const raw = localStorage.getItem(DEVICE_INFO_KEY);
    return raw ? (JSON.parse(raw) as PushDeviceNativePayload) : null;
  } catch {
    return null;
  }
}

type RegCache = { fp: string; at: number };

function loadRegCache(): RegCache | null {
  try {
    const raw = localStorage.getItem(PUSH_REG_CACHE_KEY);
    return raw ? (JSON.parse(raw) as RegCache) : null;
  } catch {
    return null;
  }
}

function saveRegCache(fp: string) {
  localStorage.setItem(PUSH_REG_CACHE_KEY, JSON.stringify({ fp, at: Date.now() }));
}

export function clearRegCache() {
  try {
    localStorage.removeItem(PUSH_REG_CACHE_KEY);
  } catch {}
}

export function fingerprint(d: PushDeviceNativePayload): string {
  return [
    d.deviceId,
    d.fcmToken,
    d.platform,
    d.phoneModel ?? "",
    d.osVersion ?? "",
  ].join("|");
}

/**
 * ✅ Decide whether we should call POST /api/push/devices.
 *
 * Rules:
 * - fingerprint changed => call immediately.
 * - fingerprint same & within TTL => skip.
 * - if last attempt failed => do NOT update cache so next opportunity retries.
 */
export function shouldRegisterPushDevice(deviceInfo: PushDeviceNativePayload): boolean {
  const fp = fingerprint(deviceInfo);
  const cache = loadRegCache();

  if (!cache) return true;
  if (cache.fp !== fp) return true;

  const fresh = Date.now() - cache.at < PUSH_REGISTER_TTL_MS;
  return !fresh;
}

// call this ONLY when API succeeded
export function markRegistered(deviceInfo: PushDeviceNativePayload) {
  saveRegCache(fingerprint(deviceInfo));
}

export function isAppleNative(): boolean {
    if (typeof window === "undefined") return false;
  
    return !!window.webkit?.messageHandlers?.appleLogin;
  }