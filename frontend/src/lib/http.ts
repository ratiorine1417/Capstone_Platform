import axios from "axios";
import { tokenStore } from "./token";

const instance = axios.create({
  // 프록시 사용: baseURL 없이 /api, /auth로 바로 칠 수 있음
  withCredentials: true, // 필요 시
  timeout: 10000
});

// 요청 인터셉터: Access 토큰 주입
instance.interceptors.request.use((config) => {
  const t = tokenStore.access;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// 응답 인터셉터: 401 → refresh 시도 후 재시도
let refreshing = false;
let queue: Array<() => void> = [];

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (!response) throw error;

    if (response.status === 401 && !config.__isRetry) {
      if (refreshing) {
        await new Promise<void>((ok) => queue.push(ok));
      } else {
        try {
          refreshing = true;
          const rt = tokenStore.refresh;
          if (!rt) throw error;
          // 백엔드 리프레시 엔드포인트 가정
          const { data } = await axios.post("/auth/refresh", { refreshToken: rt });
          tokenStore.access = data.accessToken;
          if (data.refreshToken) tokenStore.refresh = data.refreshToken;
        } catch (e) {
          tokenStore.clear();
          refreshing = false;
          queue.forEach(fn => fn());
          queue = [];
          throw error;
        }
        refreshing = false;
        queue.forEach(fn => fn());
        queue = [];
      }
      // 원요청 재시도
      config.__isRetry = true;
      const t = tokenStore.access;
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return instance(config);
    }
    throw error;
  }
);

export default instance;