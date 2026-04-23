import { proxyAuthenticatedRequest } from "@/src/server/backend.js";

export async function GET(request) {
  return proxyAuthenticatedRequest(request, {
    service: "insights",
    upstreamPath: "/api/v1/insights/summary",
  });
}
