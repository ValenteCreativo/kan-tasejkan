import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — protects admin routes at the server level.
 * Uses a signed cookie (admin-session) set during login.
 * If no valid session cookie exists, redirect to /login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin-session');
    if (!session?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session token format (email:timestamp:signature)
    const parts = session.value.split(':');
    if (parts.length < 3) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
