import { NextResponse } from 'next/server';
import { getCasLoginUrl } from '@/lib/cas';

export async function GET(request) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const callbackUrl = `${appUrl}/api/auth/callback`;

    // Redirect to SSO UI Login Page
    return NextResponse.redirect(getCasLoginUrl(callbackUrl));
}