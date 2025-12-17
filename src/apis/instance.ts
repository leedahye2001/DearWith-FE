import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "@/app/routePath";
import Router from "next/router";
import useUserStore, { useAuthStore } from "@/app/stores/userStore";
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

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // refresh token 요청 자체가 401이면 무한 루프 방지
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (typeof token === "string") {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await getRefreshToken();

        useAuthStore.getState().setTokens({
          accessToken: res.token,
          refreshToken: res.refreshToken,
          expirationTime: res.expirationTime,
        });

        api.defaults.headers.common.Authorization = `Bearer ${res.token}`;
        originalRequest.headers.Authorization = `Bearer ${res.token}`;

        processQueue(null, res.token);

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Failed:", refreshError);

        processQueue(refreshError, null);

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
