import { proxyAuthenticatedRequest } from "@/src/server/backend.js";

export async function GET(request) {
  return proxyAuthenticatedRequest(request, {
    service: "expense",
    upstreamPath: "/api/v1/expenses/totals",
  });
}
