"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  loadDeviceInfo,
  saveDeviceInfo,
  shouldRegisterPushDevice,
  markRegistered,
} from "@/lib/native/bridge";
import { postPushDevice } from "@/apis/api";
import { installNativeCallbacks, NATIVE_EVENTS, uninstallNativeCallbacks } from "./event";

export default function NativeBridgeProvider() {
  const router = useRouter();

  useEffect(() => {
    installNativeCallbacks();

    // ------------------------------
    // Apple login complete (Native -> Web)
    // ------------------------------
    const onApple = async (e: Event) => {
        const payload = (e as CustomEvent<AppleLoginNativeResult>).detail;
      
        // error case
        if ("error" in payload && payload.error) {
          alert(payload.message ?? "애플 로그인 실패");
          return;
        }
      
        // 여기부터는 성공 타입으로 안전하게 좁혀짐
        if (payload.needSignUp) {
          router.push(
            `/signup?provider=${encodeURIComponent(
              payload.provider ?? "APPLE"
            )}&socialId=${encodeURIComponent(payload.socialId ?? "")}`
          );
          return;
        }
      
        router.replace("/main");
      };
      

    // ------------------------------
    // Push device info (Native -> Web)
    // ------------------------------
    const onPushDevice = async (e: Event) => {
      const deviceInfo = (e as CustomEvent<PushDeviceNativePayload>).detail;

      // persist device info
      saveDeviceInfo(deviceInfo);

      // cache rule (fingerprint change => immediate / same => TTL)
      if (!shouldRegisterPushDevice(deviceInfo)) return;

      try {
        await postPushDevice({
          deviceId: deviceInfo.deviceId,
          fcmToken: deviceInfo.fcmToken,
          platform: deviceInfo.platform,
          phoneModel: deviceInfo.phoneModel,
          osVersion: deviceInfo.osVersion,
        });

        // ✅ mark cache ONLY on success
        markRegistered(deviceInfo);
      } catch (err) {
        // ✅ on failure => do not mark cache, retry next opportunity
        console.warn("⚠️ push device register failed, will retry later", err);
      }
    };

    window.addEventListener(NATIVE_EVENTS.APPLE_LOGIN, onApple as EventListener);
    window.addEventListener(NATIVE_EVENTS.PUSH_DEVICE, onPushDevice as EventListener);

    // ------------------------------
    // (Optional) startup retry if saved deviceInfo exists
    // ------------------------------
    const saved = loadDeviceInfo();
    if (saved && shouldRegisterPushDevice(saved)) {
      (async () => {
        try {
          await postPushDevice({
            deviceId: saved.deviceId,
            fcmToken: saved.fcmToken,
            platform: saved.platform,
            phoneModel: saved.phoneModel,
            osVersion: saved.osVersion,
          });
          markRegistered(saved);
        } catch {
          // ignore: will retry on next event/foreground/login
        }
      })();
    }

    return () => {
      window.removeEventListener(NATIVE_EVENTS.APPLE_LOGIN, onApple as EventListener);
      window.removeEventListener(NATIVE_EVENTS.PUSH_DEVICE, onPushDevice as EventListener);
      uninstallNativeCallbacks();
    };
  }, [router]);

  return null;
}