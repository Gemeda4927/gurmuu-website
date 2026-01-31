// lib/api/api.ts
import axios, { AxiosError } from "axios";

/* =========================
   BASE URL
========================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://hayyuu.onrender.com/api/v1";

/* =========================
   AXIOS INSTANCE
========================= */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set true only if backend uses cookies
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    // Guard for SSR
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      // Clear auth state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");

      // Avoid infinite redirect loops
      if (
        !window.location.pathname.startsWith(
          "/login"
        )
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
