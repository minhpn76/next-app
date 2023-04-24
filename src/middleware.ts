import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const nextUrl = req.nextUrl;
  if (nextUrl.pathname === '/dashboard') {
    if (req.cookies.get('authToken')) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-hello-from-middleware1', 'hello');
      const response = NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      });
      return NextResponse.rewrite(new URL('/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}
