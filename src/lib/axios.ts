import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: ((ok: boolean) => void)[] = [];

function subscribeTokenRefresh(cb: (ok: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(ok: boolean) {
  refreshSubscribers.forEach((cb) => cb(ok));
  refreshSubscribers = [];
}

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((ok) => {
            if (ok) {
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // coba refresh token
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        onRefreshed(true);
        return api(originalRequest);
      } catch {
        onRefreshed(false);

        // lempar event global biar ditangani di layout / _app
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(new Error("401_UNAUTHORIZED"));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
