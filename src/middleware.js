import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'pemira-ikm-ff-ui-super-secret-key-vote-secure-2026'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the cookie session
  const token = request.cookies.get('pemira_session')?.value;

  // If no token is found, redirect to SSO UI login page
  if (!token) {
    const loginUrl = new URL('/api/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the JWT token
  try {
    await jwtVerify(token, SECRET_KEY);
    
    // If the token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {

    // If the token is fake or expired, delete the cookie and redirect to the login page
    const response = NextResponse.redirect(new URL('/api/auth/login', request.url));
    response.cookies.set('pemira_session', '', { maxAge: 0, path: '/' });
    return response;
  }
}

// Configure which path the middleware should protect
export const config = {
  matcher: [
    '/voting/:path*',
    '/bilik-suara/:path*',
  ],
};