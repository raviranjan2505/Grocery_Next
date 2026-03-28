import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const protectedRoutes = ["/account", "/checkout"];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token && !refreshToken) {
      console.log("No token, redirecting to /login-in");
      return NextResponse.redirect(new URL("/login-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*"
  ],
};
