import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this');

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const rawPathname = url.pathname
  const pathname = rawPathname.toLowerCase()
  
  // 1. Handle Admin Path Normalization
  if (pathname.startsWith('/admin')) {
    if (rawPathname !== pathname) {
      url.pathname = pathname
      return NextResponse.redirect(url)
    }

    // 2. Allow Login Page and Login API
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    // 3. Check for Session Cookie
    const session = req.cookies.get('admin_session')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    try {
      await jwtVerify(session, SECRET)
      return NextResponse.next()
    } catch (e) {
      // Session invalid or expired
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/Admin', '/Admin/:path*'],
}
