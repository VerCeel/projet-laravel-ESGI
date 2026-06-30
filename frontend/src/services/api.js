import axios from "axios";

import { clearToken, getToken } from "@/lib/token";
import { clearUser } from "@/lib/user";

const baseApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

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
      clearUser();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);

export default api;
