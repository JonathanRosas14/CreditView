import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthApi = pathname.startsWith("/api/auth")
  const isStatic = pathname.startsWith("/_next") || pathname === "/favicon.ico"

  if (isStatic || isAuthApi) return NextResponse.next()

  const token = request.cookies.get("authjs.session-token")?.value
  const secureToken = request.cookies.get("__Secure-authjs.session-token")?.value
  const hasSession = !!token || !!secureToken

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
