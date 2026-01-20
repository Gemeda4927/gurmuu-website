// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Only handle auth redirects - backend handles everything else
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // If user has token and tries to access auth pages, redirect to appropriate dashboard
  if (token && isAuthRoute) {
    // We don't know user role here - let backend handle it
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For protected routes, let the backend handle 401 redirects via API interceptor
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/admin/:path*', '/superadmin/:path*'],
};