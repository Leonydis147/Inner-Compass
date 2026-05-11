import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  let supabaseResponse = createClient(request);

  // Get the current path
  const { pathname } = request.nextUrl;

  // Check if user is authenticated
  const { data: { user } } = await supabaseResponse.auth.getUser();

  // Protected routes
  const protectedRoutes = ['/journal', '/dashboard', '/settings'];
  const authRoutes = ['/auth', '/login', '/signup'];

  // Redirect to auth if trying to access protected route without login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if already logged in and trying to access auth routes
  if (authRoutes.some(route => pathname.startsWith(route)) && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/journal';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
