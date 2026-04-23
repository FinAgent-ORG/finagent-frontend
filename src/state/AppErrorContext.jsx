"use client";

import { createContext, useContext, useState } from "react";

const AppErrorContext = createContext(null);

export function AppErrorProvider({ children }) {
  const [error, setError] = useState("");

  return <AppErrorContext.Provider value={{ error, setError }}>{children}</AppErrorContext.Provider>;
}

export function useAppError() {
  const context = useContext(AppErrorContext);

  if (!context) {
    throw new Error("useAppError must be used within AppErrorProvider");
  }

  return context;
}
