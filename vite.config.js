import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1/auth": "http://127.0.0.1:8001",
      "/api/v1/expenses": "http://127.0.0.1:8002",
      "/api/v1/insights": "http://127.0.0.1:8003",
      "/api/v1/chat": "http://127.0.0.1:8004",
    },
  },
});
