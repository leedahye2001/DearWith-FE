// src/lib/native/types.d.ts
export {};

declare global {
  // (네이티브 푸시 기기 등록은 네이티브에서 직접 서버 API를 호출하도록 변경)

  type DeepLinkNativePayload = { url: string };
  type PushPermissionNativePayload = { enabled: boolean };

  type NativeTokenResponse =
    | { requestId: string; ok: true; accessToken: string; serverOk?: boolean }
    | { requestId: string; ok: false; code?: string; message?: string; serverOk?: boolean };

  // ✅ Native login result payloads (Native -> Web)
  type NativeEmailLoginPayload =
    | { error: true; code: string; message: string }
    | {
        error?: false;
        signIn: { message?: string; userId: string; nickname: string; role: string };
      };

  type NativeSocialLoginPayload =
    | { error: true; code: string; message: string }
    | {
        error?: false;
        needSignUp: boolean;
        provider?: string;
        socialId?: string;
        signIn?: { message?: string; userId: string; nickname: string; role: string } | null;
      };

  interface Window {
    // ✅ 콜백 방식 (로그인/토큰)
    dearwithAuth?: {
      onNativeTokenResponse?: (payload: NativeTokenResponse) => void;

      onEmailLoginComplete?: (payload: NativeEmailLoginPayload) => void;
      onKakaoLoginComplete?: (payload: NativeSocialLoginPayload) => void;
      onAppleLoginComplete?: (payload: NativeSocialLoginPayload) => void;
    };

    // ✅ iOS messageHandlers
    webkit?: {
      messageHandlers?: {
        appleLogin?: { postMessage: (msg: { action: string }) => void };
        kakaoLogin?: { postMessage: (msg: { action: string }) => void };
        emailLogin?: { postMessage: (msg: { email: string; password: string }) => void };

        getAccessToken?: { postMessage: (msg: { requestId: string }) => void };
        refreshAccessToken?: { postMessage: (msg: { requestId: string }) => void };
        logout?: { postMessage: (msg: { requestId: string }) => void };

        share?: { postMessage: (msg: { text?: string; url?: string }) => void };

        getPushPermission?: { postMessage: (msg: Record<string, never>) => void };
        openNotificationSettings?: { postMessage: (msg: Record<string, never>) => void };
        requestPushPermission?: { postMessage: (msg: Record<string, never>) => void };
      };
    };

    // ✅ Android bridge
    Android?: {
      appleLogin?: (json: string) => void;
      kakaoLogin?: (json: string) => void;
      emailLogin?: (json: string) => void;

      getAccessToken?: (json: string) => void;
      refreshAccessToken?: (json: string) => void;
      logout?: (json: string) => void;

      share?: (json: string) => void;
      requestPushPermission?: (json: string) => void;
      getPushPermission?: (json: string) => void;
      openNotificationSettings?: (json: string) => void;
    };

    // ✅ event.ts가 dispatch할 때 쓰는 엔트리포인트(딥링크/푸시 권한)
    __dearwith_onDeepLink?: (payload: DeepLinkNativePayload) => void;
    __dearwith_onPushPermissionResult?: (payload: PushPermissionNativePayload) => void;
  }
}
