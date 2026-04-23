import { proxyAuthenticatedRequest } from "@/src/server/backend.js";

export async function GET(request) {
  return proxyAuthenticatedRequest(request, {
    service: "auth",
    upstreamPath: "/api/v1/auth/me",
  });
}
