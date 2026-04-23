import { proxyAuthMutation } from "@/src/server/backend.js";

export async function POST(request) {
  return proxyAuthMutation(request, "/api/v1/auth/login");
}
