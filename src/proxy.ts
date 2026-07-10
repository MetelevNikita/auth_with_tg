import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'


export async function proxy(request: NextRequest) {

  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname
  console.log(pathname)

  const isPublicRoute =
  pathname === '/admin' ||
  pathname === '/admin/registration' ||
  pathname.startsWith('/api/')

  if (isPublicRoute) {
    return NextResponse.next()
  }


  if (!token) {
  return NextResponse.redirect(new URL('/admin', request.url))
  }

  try {
    jwt.verify(token as string, process.env.JWT_SECRET as string)
    return NextResponse.next()
  } catch (err: Error | unknown) {

    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        console.error('Срок действия токена истек')
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      console.error('Неизвестная ошибка')
      return NextResponse.redirect(new URL('/admin', request.url))
    }

  }

  
  
  return NextResponse.next()
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|png|jpg|jpeg|svg|ico|webp)$).*)',
  ]
}