import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { db } from '@/prisma/db';

export async function GET(request) {
    const token = request.cookies.get('pemira_session')?.value;

    if (!token) {
        return NextResponse.json(
            { 
                authenticated: false, 
                message: 'Belum login' 
            },
            { status: 401}
        );
    }

    const payload = await verifySessionToken(token);

    if (!payload) {
        return NextResponse.json(
            {
                authenticated: false,
                message: 'Sesi sudah kadaluarsa'
            },
            { status: 401}
        );
    }

    // Check if this user is an admin
    const adminNpm = (process.env.ADMIN_NPM || '').split(',').map((npm) => npm.trim());
    const isAdmin = adminNpm.includes(String(payload.npm));

    // Fetch status of the voter
    const voter = await db.orm.public.Dpt.where({ npm: payload.npm }).first();

    return NextResponse.json({
        authenticated: true,
        user: {
            npm: payload.npm,
            name: payload.name,
            studyProgram: payload.studyProgram,
            batch: payload.batch,
            hasVoted: voter?.hasVoted || false,
            isAdmin: isAdmin,
        },
    });
}