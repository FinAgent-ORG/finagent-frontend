"use client";

import { AppErrorProvider } from "@/src/state/AppErrorContext.jsx";
import { AuthProvider } from "@/src/state/AuthContext.jsx";

export default function Providers({ children }) {
  return (
    <AppErrorProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppErrorProvider>
  );
}
