import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function proxy(request: NextRequest) {

  const token = request.cookies.get('token')?.value
  const isAPublicRoute = ['/admin', '/admin/registration', '/api/:path*']
  const pathname = request.nextUrl.pathname
  console.log(pathname)

    const isPublicRoute =
    pathname === '/admin' ||
    pathname === '/admin/registration' ||
    pathname.startsWith('/api/')



  if (!token && !isPublicRoute) {
  return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  return NextResponse.next()
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|png|jpg|jpeg|svg|ico|webp)$).*)',
  ]
}