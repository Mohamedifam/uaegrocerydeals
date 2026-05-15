import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this');

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const rawPathname = url.pathname
  const pathname = rawPathname.toLowerCase()
  
  // 1. Handle Admin and API Path Normalization
  if (pathname.startsWith('/stanger-user-dashboard') || pathname.startsWith('/api/admin')) {
    // Skip protection for login routes
    if (pathname === '/stanger-user-dashboard/login' || pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    if (pathname.startsWith('/stanger-user-dashboard') && rawPathname !== pathname) {
      url.pathname = pathname
      return NextResponse.redirect(url)
    }

    // 2. Check for Session Cookie
    const session = req.cookies.get('admin_session')?.value

    if (!session) {
      // For API routes, return 401 instead of redirecting
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/stanger-user-dashboard/login', req.url))
    }

    try {
      await jwtVerify(session, SECRET)
      return NextResponse.next()
    } catch (e) {
      // Session invalid or expired
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/stanger-user-dashboard/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/stanger-user-dashboard', 
    '/stanger-user-dashboard/:path*', 
    '/api/admin/:path*'
  ],
}
