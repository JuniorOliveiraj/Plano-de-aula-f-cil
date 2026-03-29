import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Next 16 replacement for middleware.ts
export default auth((req) => {
  const isLoggedIn = !!req.auth

  const protectedPaths = [
    "/dashboard",
  ]

  const isProtectedRoute = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
}
