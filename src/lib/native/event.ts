// src/lib/native/events.ts
export const NATIVE_EVENTS = {
    APPLE_LOGIN: "dearwith:native:appleLogin",
    PUSH_DEVICE: "dearwith:native:pushDevice",
    DEEP_LINK: "dearwith:native:deepLink",
    PUSH_PERMISSION: "dearwith:native:pushPermission",
  } as const;
  
  type NativeEventName = (typeof NATIVE_EVENTS)[keyof typeof NATIVE_EVENTS];
  
  function dispatch<T>(name: NativeEventName, detail: T) {
    window.dispatchEvent(new CustomEvent<T>(name, { detail }));
  }
  
  /**
   * 네이티브가 evaluateJavaScript 로 호출할 전역 함수들을 설치
   * 예:
   *   window.__dearwith_onAppleLoginResult({…})
   *   window.__dearwith_onPushDevice({...})
   *   window.__dearwith_onDeepLink({...})
   *   window.__dearwith_onPushPermissionResult({...})
   *
   * ✅ 중요: 이 함수는 앱 전체에서 1번만 호출되게 (예: NativeBridgeProvider에서 mount 시)
   */
  export function installNativeCallbacks() {
    if (typeof window === "undefined") return;
  
    // Apple login result
    window.__dearwith_onAppleLoginResult = (payload: AppleLoginNativeResult) => {
      dispatch(NATIVE_EVENTS.APPLE_LOGIN, payload);
    };
  
    // Push device info
    window.__dearwith_onPushDevice = (payload: PushDeviceNativePayload) => {
      dispatch(NATIVE_EVENTS.PUSH_DEVICE, payload);
    };
  
    // Deep link
    window.__dearwith_onDeepLink = (payload: DeepLinkNativePayload) => {
      dispatch(NATIVE_EVENTS.DEEP_LINK, payload);
    };
  
    // Push permission result
    window.__dearwith_onPushPermissionResult = (
      payload: PushPermissionNativePayload
    ) => {
      dispatch(NATIVE_EVENTS.PUSH_PERMISSION, payload);
    };
  }
  
  export function uninstallNativeCallbacks() {
    if (typeof window === "undefined") return;
  
    delete window.__dearwith_onAppleLoginResult;
    delete window.__dearwith_onPushDevice;
    delete window.__dearwith_onDeepLink;
    delete window.__dearwith_onPushPermissionResult;
  }