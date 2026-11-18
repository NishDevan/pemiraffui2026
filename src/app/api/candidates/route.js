import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

export async function GET() {
    try {
        // Fetch all sorted candidates from the database
        const candidates = await db.orm.public.Candidate.all();

        candidates.sort((a, b) => a.orderNumber - b.orderNumber);
        
        return NextResponse.json({
            success: true,
            data: candidates,
        });
    } catch (error) {
        console.error('Fetch Candidates Error:', error);
        return NextResponse.json(
            { error: 'Gagal memuat daftar kandidat', detail: error.message },
            { status: 500 }
        );
    }
}