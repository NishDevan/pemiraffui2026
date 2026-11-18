import { NextResponse } from 'next/server';
import { getCasLogoutUrl } from '@/lib/cas';

// GET Handler Function
export async function GET(request) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    
    // Redirect to logout URL for SSO UI
    const response = NextResponse.redirect(getCasLogoutUrl(appUrl));

    // Clear the session cookie
    response.cookies.set('pemira_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Deleting the cookie immediately
    });

    return response;
}

// POST Handler Function
export async function POST(request) {
    const response = NextResponse.json({
        success: true,
        message: 'Berhasil logout',
    });

    response.cookies.set('pemira_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return response;
}