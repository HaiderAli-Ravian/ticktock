import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((request) => {
  const { nextUrl } = request
  const isAuthed = !!request.auth

  if (!isAuthed && nextUrl.pathname.startsWith("/timesheets")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthed && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/timesheets", request.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
