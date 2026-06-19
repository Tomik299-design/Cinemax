import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
    }
    if (req.auth.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect authenticated user routes
  if (["/profile", "/favorites"].includes(pathname)) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/favorites/:path*"],
};
