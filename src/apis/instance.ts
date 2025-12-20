// src/apis/instance.ts
import axios, { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "@/app/routePath";
import useUserStore from "@/app/stores/userStore";
import {
  isNativeApp,
  nativeGetAccessToken,
  nativeRefreshAccessToken,
  nativeLogout,
} from "@/lib/native/bridge";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedRequestQueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

/** =========================
 * Web refresh queue
 * ========================= */
let isRefreshingWeb = false;
let failedQueueWeb: FailedRequestQueueItem[] = [];

const processWebQueue = (error: unknown) => {
  failedQueueWeb.forEach((q) => (error ? q.reject(error) : q.resolve()));
  failedQueueWeb = [];
};

/** =========================
 * Native refresh queue
 * ========================= */
let isRefreshingNative = false;
let failedQueueNative: FailedRequestQueueItem[] = [];

const processNativeQueue = (error: unknown, accessToken: string | null) => {
  failedQueueNative.forEach((q) => (error ? q.reject(error) : q.resolve(accessToken)));
  failedQueueNative = [];
};

/** =========================
 * Axios instances
 * ========================= */
const api = axios.create({
  baseURL: `https://${BASE_URL}`,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// web refresh 전용(쿠키)
export const refreshApi = axios.create({
  baseURL: `https://${BASE_URL}`,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

/** =========================
 * Request interceptor
 * - Native: Bearer
 * - Web: cookie
 * ========================= */
api.interceptors.request.use(async (config) => {
  const native = isNativeApp();
  config.withCredentials = !native;

  if (native) {
    const token = await nativeGetAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    } else {
      // 토큰이 없으면 Authorization 없이 나가서 401 날 수 있음(정상)
    }
  }

  return config;
});

// web refresh는 항상 쿠키
refreshApi.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

/** =========================
 * Response interceptor (401 handling)
 * ========================= */
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (!error.response) return Promise.reject(error);
    if (error.response.status !== 401) return Promise.reject(error);

    // 이미 재시도 했는데 또 401이면 더 이상 반복 X
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    const native = isNativeApp();

    /** =========================================================
     * (A) Native: refresh 1번 + queue
     * ========================================================= */
    if (native) {
      // 이미 refresh 중이면 큐에 대기 → refresh 끝나면 받은 토큰으로 재시도
      if (isRefreshingNative) {
        return new Promise((resolve, reject) => {
          failedQueueNative.push({
            resolve: (newToken?: unknown) => {
              const at = typeof newToken === "string" ? newToken : null;
              originalRequest.headers = originalRequest.headers ?? {};
              if (at) (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${at}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshingNative = true;

      try {
        const newAccessToken = await nativeRefreshAccessToken();

        if (!newAccessToken) {
          await nativeLogout();
          useUserStore.getState().clearUser();
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }

          processNativeQueue(new Error("NATIVE_REFRESH_FAILED"), null);
          return Promise.reject(error);
        }

        processNativeQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (e) {
        processNativeQueue(e, null);
        await nativeLogout();
        useUserStore.getState().clearUser();
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(e);
      } finally {
        isRefreshingNative = false;
      }
    }

    /** =========================================================
     * (B) Web: cookie refresh + queue
     * ========================================================= */
    // 로그인 상태 확인: userId가 있으면 로그인 상태로 간주
    const userId = useUserStore.getState().userId;

    // 비로그인 상태: refresh 시도하지 않고 바로 로그인 화면으로
    if (!userId) {
      useUserStore.getState().clearUser();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (isRefreshingWeb) {
      return new Promise((resolve, reject) => {
        failedQueueWeb.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    isRefreshingWeb = true;

    try {
      await refreshApi.post("/auth/refresh", {}, { withCredentials: true });
      processWebQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processWebQueue(refreshError);
      useUserStore.getState().clearUser();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshingWeb = false;
    }
  }
);

export default api;
