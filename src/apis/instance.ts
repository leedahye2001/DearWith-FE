import axios from "axios";
import useUserStore from "@/app/stores/userStore";
import { BASE_URL } from "@/app/routePath";

// 기본 인스턴스 생성
const api = axios.create({
  baseURL: `http://${BASE_URL}`,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 요청 인터셉터: token 자동 추가
api.interceptors.request.use(async (config) => {
  let token = useUserStore.getState().token;

  if (!token) {
    await new Promise((res) => setTimeout(res, 100));
    token = useUserStore.getState().token;
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
