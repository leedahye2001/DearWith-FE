// src/lib/native/types.d.ts
export {};

declare global {
  // ------------------------------
  // Apple login (Native -> Web)
  // ------------------------------
  type AppleLoginErrorResult = {
    error: true;
    code: string;
    message: string;
  };
  
  type AppleLoginSuccessResult = {
    error?: false;
    needSignUp: boolean;
    provider?: string;
    socialId?: string;
  };
  
  type AppleLoginNativeResult =
    | AppleLoginErrorResult
    | AppleLoginSuccessResult;
  

  // ------------------------------
  // Push device info (Native -> Web)
  // NOTE: iOS sends `phoneModel`, not `deviceModel`.
  // ------------------------------
  type PushDeviceNativePayload = {
    fcmToken: string;
    platform: "IOS" | "ANDROID";
    phoneModel?: string;
    osVersion?: string;
    deviceId: string;
  };

  type PushPermissionNativePayload = {
    enabled: boolean;
  };

  type DeepLinkNativePayload = {
    url: string;
  };

  interface Window {
    // (optional) if native uses these styles too
    dearwithAuth?: {
      onAppleLoginComplete?: (payload: AppleLoginNativeResult) => void;
    };

    dearwithPush?: {
      setFcmToken?: (payload: PushDeviceNativePayload) => void;
      setPermissionStatus?: (enabled: boolean) => void;
    };

    webkit?: {
      messageHandlers?: {
        share?: { postMessage: (msg: { text?: string; url?: string }) => void };
        appleLogin?: { postMessage: (msg: { action: string }) => void };
        pushPermission?: { postMessage: (msg: Record<string, unknown>) => void };
      };
    };

    Android?: {
      share?: (json: string) => void;
      appleLogin?: (json: string) => void;
      requestPushPermission?: (json: string) => void;
    };

    // ✅ Native -> Web entrypoints (evaluateJavaScript)
    __dearwith_onAppleLoginResult?: (payload: AppleLoginNativeResult) => void;
    __dearwith_onPushDevice?: (payload: PushDeviceNativePayload) => void;
    __dearwith_onDeepLink?: (payload: DeepLinkNativePayload) => void;
    __dearwith_onPushPermissionResult?: (
      payload: PushPermissionNativePayload
    ) => void;
  }
}