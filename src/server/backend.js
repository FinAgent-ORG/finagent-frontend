import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/src/lib/auth-session.js";

const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL,
  chat: process.env.CHAT_SERVICE_URL,
  expense: process.env.EXPENSE_SERVICE_URL,
  insights: process.env.INSIGHTS_SERVICE_URL,
};

function isCookieSecure(request) {
  if (process.env.SESSION_COOKIE_SECURE === "true") {
    return true;
  }

  if (process.env.SESSION_COOKIE_SECURE === "false") {
    return false;
  }

  return request.headers.get("x-forwarded-proto") === "https";
}

function cookieOptions(request) {
  return {
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: isCookieSecure(request),
  };
}

function copyHeaders(request, token) {
  const headers = new Headers();

  for (const [key, value] of request.headers.entries()) {
    const lowerKey = key.toLowerCase();
    if (["connection", "content-length", "cookie", "host"].includes(lowerKey)) {
      continue;
    }
    headers.set(key, value);
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    headers.set("x-forwarded-for", forwardedFor);
  }

  if (realIp) {
    headers.set("x-real-ip", realIp);
  }

  return headers;
}

async function proxyFetch(request, service, upstreamPath, token) {
  const serviceUrl = serviceUrls[service];

  if (!serviceUrl) {
    return NextResponse.json({ detail: `Missing ${service.toUpperCase()} service URL.` }, { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(upstreamPath, serviceUrl);
  upstreamUrl.search = incomingUrl.search;

  const requestBody =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  const body = requestBody && requestBody.byteLength ? requestBody : undefined;

  try {
    return await fetch(upstreamUrl, {
      method: request.method,
      headers: copyHeaders(request, token),
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Upstream request failed." },
      { status: 502 },
    );
  }
}

async function toNextResponse(upstreamResponse) {
  if (upstreamResponse instanceof NextResponse) {
    return upstreamResponse;
  }

  const responseText = await upstreamResponse.text();
  const nextResponse = new NextResponse(responseText, { status: upstreamResponse.status });

  for (const [key, value] of upstreamResponse.headers.entries()) {
    const lowerKey = key.toLowerCase();
    if (["content-encoding", "content-length", "transfer-encoding"].includes(lowerKey)) {
      continue;
    }
    nextResponse.headers.set(key, value);
  }

  return nextResponse;
}

export async function clearSessionCookie(request, init = {}) {
  const response = NextResponse.json(init.body ?? { detail: "Signed out." }, {
    status: init.status ?? 200,
  });
  response.cookies.set(AUTH_COOKIE_NAME, "", { ...cookieOptions(request), maxAge: 0 });
  return response;
}

export async function proxyAuthMutation(request, upstreamPath) {
  const upstreamResponse = await proxyFetch(request, "auth", upstreamPath);
  if (upstreamResponse instanceof NextResponse) {
    return upstreamResponse;
  }

  try {
    const responseText = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      const response = new NextResponse(responseText, { status: upstreamResponse.status });
      const contentType = upstreamResponse.headers.get("content-type");
      if (contentType) {
        response.headers.set("content-type", contentType);
      }
      return response;
    }

    const payload = JSON.parse(responseText);
    const response = NextResponse.json(payload, { status: upstreamResponse.status });
    response.cookies.set(AUTH_COOKIE_NAME, payload.access_token, cookieOptions(request));
    return response;
  } catch {
    return NextResponse.json({ detail: "Authentication response was invalid." }, { status: 502 });
  }
}

export async function proxyAuthenticatedRequest(request, { service, upstreamPath }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ detail: "Authentication required." }, { status: 401 });
  }

  const upstreamResponse = await proxyFetch(request, service, upstreamPath, token);

  if (upstreamResponse.status === 401 && service === "auth") {
    return clearSessionCookie(request, {
      body: { detail: "Authentication required." },
      status: 401,
    });
  }

  return toNextResponse(upstreamResponse);
}
