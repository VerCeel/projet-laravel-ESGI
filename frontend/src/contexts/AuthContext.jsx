import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getToken } from "@/lib/token";
import { login as loginRequest, logout as logoutRequest, saveSession } from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    saveSession(data.token);
    setTokenState(data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setTokenState(null);
  }, []);

  useEffect(() => {
    const handleLogout = () => setTokenState(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
