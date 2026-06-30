"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getToken } from "@/lib/token";
import { clearUser, getUser, setUser } from "@/lib/user";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  saveSession,
} from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUserState] = useState(null);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const existingToken = getToken();
    if (!existingToken) return;

    setTokenState(existingToken);
    const cachedUser = getUser();
    if (cachedUser) {
      setUserState(cachedUser);
    }

    fetchCurrentUser()
      .then((profile) => {
        setUserState(profile);
        setUser(profile);
      })
      .catch(() => {
        setTokenState(null);
        clearUser();
      });
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    saveSession(data.token, data.user);
    setTokenState(data.token);
    setUserState(data.user ?? null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setTokenState(null);
    setUserState(null);
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setTokenState(null);
      setUserState(null);
      clearUser();
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login, logout],
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
