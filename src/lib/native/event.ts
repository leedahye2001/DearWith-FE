export const NATIVE_EVENTS = {
  DEEP_LINK: "dearwith:native:deepLink",
  PUSH_PERMISSION: "dearwith:native:pushPermission",
} as const;

type NativeEventName = (typeof NATIVE_EVENTS)[keyof typeof NATIVE_EVENTS];

function dispatch<T>(name: NativeEventName, detail: T) {
  window.dispatchEvent(new CustomEvent<T>(name, { detail }));
}

/**
 * 네이티브가 evaluateJavaScript 로 호출할 전역 함수들을 설치
 * - window.__dearwith_onDeepLink(payload)
 * - window.__dearwith_onPushPermissionResult(payload)
 */
export function installNativeCallbacks() {
  if (typeof window === "undefined") return;

  window.__dearwith_onDeepLink = (payload: DeepLinkNativePayload) => {
    dispatch(NATIVE_EVENTS.DEEP_LINK, payload);
  };

  window.__dearwith_onPushPermissionResult = (payload: PushPermissionNativePayload) => {
    dispatch(NATIVE_EVENTS.PUSH_PERMISSION, payload);
  };
}

export function uninstallNativeCallbacks() {
  if (typeof window === "undefined") return;

  delete window.__dearwith_onDeepLink;
  delete window.__dearwith_onPushPermissionResult;
}
