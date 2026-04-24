import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl
  
  const rawPathname = url.pathname
  const pathname = rawPathname.toLowerCase()
  
  if (pathname.startsWith('/admin')) {
    // Force lowercase for admin paths to avoid 404s on case-sensitive hosting
    if (rawPathname !== pathname) {
      url.pathname = pathname
      return NextResponse.redirect(url)
    }

    if (basicAuth) {
      try {
        const authValue = basicAuth.split(' ')[1]
        const decoded = atob(authValue)
        const colonIndex = decoded.indexOf(':')
        if (colonIndex !== -1) {
          const user = decoded.substring(0, colonIndex)
          const pwd = decoded.substring(colonIndex + 1)
          
          if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
            return NextResponse.next()
          }
        }
      } catch (e) {
        // Silently fail auth attempt
      }
    }
    
    // Auth failed
    return new NextResponse('Authentication required to access the admin panel.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/Admin', '/Admin/:path*'],
}
