"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { authApi } from "@/src/lib/api-client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function hydrate() {
    try {
      const profile = await authApi.me();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    hydrate();
  }, []);

  async function signin(credentials) {
    const payload = await authApi.signin(credentials);
    setUser({ user_id: payload.user_id, email: payload.email });
    return payload;
  }

  async function signup(credentials) {
    const payload = await authApi.signup(credentials);
    setUser({ user_id: payload.user_id, email: payload.email });
    return payload;
  }

  async function signout() {
    await authApi.signout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ loading, signin, signout, signup, user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
