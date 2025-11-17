import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard'];

// Define public routes that should redirect to dashboard if authenticated
const publicRoutes = ['/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if this is a navigation request (has referer from same origin)
  // This allows client-side redirects to work even if cookie isn't set yet
  const referer = request.headers.get('referer');
  const isNavigation = referer && new URL(referer).origin === new URL(request.url).origin;

  // Redirect unauthenticated users away from protected routes
  // But allow navigation requests (client-side redirects) to pass through
  // The client-side auth check will handle the redirect if needed
  if (isProtectedRoute && !authToken && !isNavigation) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from public routes (optional)
  // Uncomment if you want to redirect logged-in users from landing to dashboard
  // if (isPublicRoute && authToken) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }
  
  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

