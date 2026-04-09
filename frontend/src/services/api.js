import axios from "axios";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL: baseApiUrl,
});

export default api;