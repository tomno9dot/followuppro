import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ VERY IMPORTANT: Always allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const token = req.cookies.get("token")?.value

  // Protect dashboard only
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && pathname.startsWith("/dashboard")) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/upgrade/:path*", "/onboarding/:path*"]
}