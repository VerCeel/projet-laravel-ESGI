import { clearToken, setToken } from "@/lib/token";

import api from "./api";

export async function login(credentials) {
  const response = await api.post("/login", credentials);
  return response.data;
}

export async function register(payload) {
  const response = await api.post("/register", payload);
  return response.data;
}

export async function logout() {
  try {
    await api.post("/logout");
  } finally {
    clearToken();
  }
}

export function saveSession(token) {
  setToken(token);
}

export function parseValidationErrors(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return {};

  return Object.fromEntries(
    Object.entries(data).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
}
