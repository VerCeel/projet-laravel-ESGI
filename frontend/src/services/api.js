import axios from "axios";

import { clearToken, getToken } from "@/lib/token";

const baseApiUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: baseApiUrl,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearToken();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);

export default api;
