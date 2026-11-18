import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

// Helper function to verify admin key
function verifyAdmin(request) {
  const secretHeader = request.headers.get('x-admin-key');
  const { searchParams } = new URL(request.url);
  const secretQuery = searchParams.get('secret');

  const expectedSecret = process.env.ADMIN_SECRET;
  return (secretHeader && secretHeader === expectedSecret) || (secretQuery && secretQuery === expectedSecret);
}

export async function GET(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Akses ditolak. Kunci admin tidak valid.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const actionFilter = searchParams.get('action');

    // Get all audit logs from the database
    let logs = await db.orm.public.AuditLog.all();

    // Filter logs by action if the action query parameter is provided
    if (actionFilter) {
      logs = logs.filter((log) => log.action === actionFilter);
    }

    // Sort from newest to oldest based on createdAt timestamp
    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      totalCount: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('Audit Logs Error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat audit log', detail: error.message },
      { status: 500 }
    );
  }
}