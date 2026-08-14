import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { TOKEN_KEY } from "@/lib/constants"

const PROTECTED = ["/dashboard"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next()
  }

  const token = request.cookies.get(TOKEN_KEY)?.value

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !token) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}