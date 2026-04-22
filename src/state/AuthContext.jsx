import { createContext, useContext, useEffect, useState } from "react";

import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    async function hydrate() {
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const profile = await authApi.me(token);
        setUser(profile);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, [token]);

  const signin = (payload) => {
    localStorage.setItem("token", payload.access_token);
    setToken(payload.access_token);
    setUser({ user_id: payload.user_id, email: payload.email });
  };

  const signout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
