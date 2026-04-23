import { proxyAuthenticatedRequest } from "@/src/server/backend.js";

export async function POST(request) {
  return proxyAuthenticatedRequest(request, {
    service: "chat",
    upstreamPath: "/api/v1/chat/messages",
  });
}
