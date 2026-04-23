import { clearSessionCookie } from "@/src/server/backend.js";

export async function POST(request) {
  return clearSessionCookie(request);
}
