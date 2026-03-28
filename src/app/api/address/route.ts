import { NextResponse, type NextRequest } from "next/server";
import { cookies, headers } from "next/headers";

function getGatewayBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  return base.replace(/\/+$/, "");
}

async function buildForwardHeaders() {
  const h = new Headers();
  h.set("Accept", "application/json");
  h.set("Content-Type", "application/json");

  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieHeader = cookieStore.toString();
  if (cookieHeader) h.set("cookie", cookieHeader);

  const authHeader = headerStore.get("authorization");
  if (authHeader) h.set("authorization", authHeader);

  const authToken = cookieStore.get("authToken")?.value;
  if (!authHeader && authToken) h.set("authorization", `Bearer ${authToken}`);

  const cookieId = cookieStore.get("cookieId")?.value;
  if (cookieId) h.set("x-cookie-id", cookieId);

  return h;
}

type RefreshedTokens = { accessToken: string; refreshToken: string };

async function tryRefreshTokens(): Promise<RefreshedTokens | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return null;

  const res = await fetch(`${getGatewayBaseUrl()}/v1/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const accessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;
  if (!accessToken || !newRefreshToken) return null;

  return { accessToken, refreshToken: newRefreshToken };
}

async function fetchWithRefreshOnAuthFailure(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, headers: await buildForwardHeaders(), cache: "no-store" });
  if (res.status !== 401 && res.status !== 403) return { res, refreshed: null as RefreshedTokens | null };

  const refreshed = await tryRefreshTokens();
  if (!refreshed) return { res, refreshed: null as RefreshedTokens | null };

  const retryHeaders = await buildForwardHeaders();
  retryHeaders.set("authorization", `Bearer ${refreshed.accessToken}`);

  const retryRes = await fetch(url, { ...init, headers: retryHeaders, cache: "no-store" });
  return { res: retryRes, refreshed };
}

function attachAuthCookies(response: NextResponse, tokens: RefreshedTokens) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set("authToken", tokens.accessToken, {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("refreshToken", tokens.refreshToken, {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function GET() {
  try {
    const url = `${getGatewayBaseUrl()}/v1/address`;
    const { res, refreshed } = await fetchWithRefreshOnAuthFailure(url, {
      method: "GET",
    });
    const text = await res.text();
    const response = new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
    if (refreshed) attachAuthCookies(response, refreshed);
    return response;
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Address proxy failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = `${getGatewayBaseUrl()}/v1/address`;
    const { res, refreshed } = await fetchWithRefreshOnAuthFailure(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const response = new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
    if (refreshed) attachAuthCookies(response, refreshed);
    return response;
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Address proxy failed" },
      { status: 500 }
    );
  }
}
