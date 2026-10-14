import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = "super-secret-key-wavebot-dev-only"; // Match auth.ts
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  let isAuthenticated = false;

  if (session) {
    try {
      await jwtVerify(session, key, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch (err) {
      // Invalid token
    }
  }

  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
