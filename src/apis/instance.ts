import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "@/app/routePath";
import Router from "next/router";
import useUserStore from "@/app/stores/userStore";
import { getRefreshToken } from "./api";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedRequestQueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((queued) => {
    if (error) queued.reject(error);
    else queued.resolve(token);
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: `https://${BASE_URL}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// refresh token 요청용 별도 인스턴스 (interceptor 없음)
export const refreshApi = axios.create({
  baseURL: `https://${BASE_URL}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (!error.response) {
      return Promise.reject(error);
    }

    // refresh token 요청 자체가 401이면 무한 루프 방지 (즉시 실패 처리)
    if (originalRequest.url?.includes("/auth/refresh")) {
      // refresh 요청 자체가 401이면 세션 만료
      if (error.response.status === 401) {
        useUserStore.getState().clearUser();
        Router.push("/login");
      }
      return Promise.reject(error);
    }

    // 401 에러 처리
    if (error.response.status === 401) {
      // 이미 재시도한 요청이면 실패 처리
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // 로그인 상태 확인: userId가 있으면 로그인 상태로 간주
      const userId = useUserStore.getState().userId;

      // 비로그인 상태: refresh 시도하지 않고 바로 로그인 화면으로
      if (!userId) {
        useUserStore.getState().clearUser();
        Router.push("/login");
        return Promise.reject(error);
      }

      // 로그인 상태: refresh 1회 시도
      originalRequest._retry = true;

      // 동시에 여러 요청이 401이면 refresh는 한 번만 실행
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === "string") {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            // 원 요청 1회 재시도
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // refresh token 재발급 시도
        const res = await getRefreshToken();

        // refresh 성공: 서버가 Set-Cookie로 새 ACCESS/REFRESH 쿠키를 내려줌
        // 프론트는 토큰을 저장하지 않음 (HttpOnly 쿠키)
        if (res.token) {
          api.defaults.headers.common.Authorization = `Bearer ${res.token}`;
          originalRequest.headers.Authorization = `Bearer ${res.token}`;
        }

        // 대기 중인 요청들에 성공 결과 전달
        processQueue(null, res.token || null);

        // 원 요청 1회 재시도
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Failed:", refreshError);

        // refresh 실패: 서버 세션이 없거나 refresh 만료/무효
        // 대기 중인 요청들에 실패 결과 전달
        processQueue(refreshError, null);

        // store 비우고 로그인 화면으로 이동
        useUserStore.getState().clearUser();
        Router.push("/login");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
