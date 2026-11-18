import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

function verifyAdmin(request) {
    const secretHeader = request.headers.get('x-admin-secret');
    const { searchParams } = new URL(request.url);
    const secretQuery = searchParams.get('secret');

    const expectedSecret = process.env.ADMIN_SECRET;

    return (secretHeader && secretHeader === expectedSecret) || (secretQuery && secretQuery === expectedSecret);
}

// GET for searching DPT
export async function GET(request) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Akses ditolak. Kunci admin tidak valid.' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.toLowerCase();
        const batch = searchParams.get('batch');
        
        let voters = await db.orm.public.Dpt.all();

        // Filter by NPM or Name if provided
        if (search) {
            voters = voters.filter(
                (v) => v.npm.toLowerCase().includes(search) || v.name.toLowerCase().includes(search)
            );
        }

        // Filter by NPM
        voters.sort((a, b) => a.npm.localeCompare(b.npm));

        return NextResponse.json({
            success: true,
            totalCount: voters.length,
            data: voters,
        });
    } catch (error) {
        console.error('Admin GET DPT Error:', error);
        return NextResponse.json({ error: 'Gagal memuat data DPT', detail: error.message }, { status: 500 });
    }
}

// POST for Bulk Import DPT (JSON or CSV)
export async function POST(request) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Akses ditolak. Kunci admin tidak valid.' }, { status: 401 });
    }

    try {
        const contentType = request.headers.get('content-type') || '';
        let studentsToImport = [];

        if (contentType.includes('application/json')) {
            // If uses JSON
            const body = await request.json();
            studentsToImport = Array.isArray(body) ? body : body.students || [];
        } else {
            // If uses CSV
            const textData = await request.text();
            const lines = textData
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
            
            // Skip the header if the first row contains the title
            const startIndex = lines[0].toLowerCase().includes('npm') ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                const parts = lines[i].split(',').map((p) => p.trim());
                if (parts.length >= 4) {
                    studentsToImport.push({
                        npm: parts[0],
                        name: parts[1],
                        studyProgram: parts[2],
                        batch: parts[3],
                    });
                }
            }
        }

        if (studentsToImport.length === 0) {
            return NextResponse.json(
                { error: 'Tidak ada data mahasiswa valid yang ditemukan untuk diimport.' },
                { status: 400 }
            );
        }

        // Import Process to PostgreSQL
        let insertedCount = 0;
        let skippedCount = 0;

        for (const student of studentsToImport) {
            if (!student.npm || !student.name) {
                skippedCount++;
                continue;
            }

            // Check if the student already exists in the database
            const existing = await db.orm.public.Dpt.where({ npm: String(student.npm) }).first();

            if (!existing) {
                await db.orm.public.Dpt.create({
                npm: String(student.npm),
                name: student.name,
                faculty: 'Fakultas Farmasi',
                studyProgram: student.studyProgram || 'S1 Farmasi',
                batch: String(student.batch || '2024'),
                hasVoted: false,
                });
                insertedCount++;
            } else {
                skippedCount++;
            }
        }

        // Logging to Audit Log
        await db.orm.public.AuditLog.create({
            action: 'DPT_BULK_IMPORT',
            detail: `Panitia mengimpor data DPT: ${insertedCount} ditambahkan, ${skippedCount} dilewati/duplikat.`,
        });

        return NextResponse.json({
            success: true,
            message: `Proses import DPT selesai.`,
            summary: {
                totalReceived: studentsToImport.length,
                inserted: insertedCount,
                skippedOrDuplicate: skippedCount,
            },
        });
    } catch (error) {
        console.error('Admin POST DPT Error:', error);
        return NextResponse.json({ error: 'Gagal mengimpor data DPT', detail: error.message }, { status: 500 });
    }
}