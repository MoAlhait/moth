import { NextRequest, NextResponse } from 'next/server'

/**
 * On moth subdomain, open the widget directly at root.
 * Example: https://moth.example.com -> /moth
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const pathname = req.nextUrl.pathname

  if (pathname === '/' && host.startsWith('moth.')) {
    const url = req.nextUrl.clone()
    url.pathname = '/moth'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
