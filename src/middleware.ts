import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];
// Routes that should redirect to dashboard if user is already logged in
const authRoutes = ['/login'];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // Get the session from the cookie
  const cookie = request.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // Redirect to login if trying to access protected route without session
  if (isProtectedRoute && !session?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if trying to access auth routes while logged in
  if (isAuthRoute && session?.email) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
