import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { db } from '@/prisma/db';

export async function POST(request) {
  try {
    // 1. Verifikasi Sesi Pemilih
    const token = request.cookies.get('pemira_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.npm) {
      return NextResponse.json({ error: 'Sesi sudah kedaluwarsa. Silakan login kembali.' }, { status: 401 });
    }

    // 2. Cek apakah bilik suara sedang ditutup oleh panitia
    const statusSetting = await db.orm.public.SystemSetting.where({ key: 'ELECTION_STATUS' }).first();
    if (statusSetting && statusSetting.value !== 'OPEN') {
      return NextResponse.json(
        { error: 'Bilik suara sedang ditutup. Pemungutan suara tidak aktif saat ini.' },
        { status: 403 }
      );
    }

    // 3. Baca Data Suara (Bisa Single Vote atau Array Votes)
    const body = await request.json();
    let votesToCast = [];

    if (Array.isArray(body.votes)) {
      votesToCast = body.votes;
    } else if (body.candidateId && body.category) {
      votesToCast = [{ candidateId: body.candidateId, category: body.category }];
    }

    if (votesToCast.length === 0) {
      return NextResponse.json({ error: 'Data pilihan suara kosong.' }, { status: 400 });
    }

    // 4. KUNCI STATUS PEMILIH TERLEBIH DAHULU (Pencegah Race Condition)
    const voter = await db.orm.public.Dpt.where({ npm: payload.npm }).first();
    if (!voter) {
      return NextResponse.json({ error: 'NPM Anda tidak terdaftar dalam DPT.' }, { status: 403 });
    }

    if (voter.hasVoted) {
      return NextResponse.json({ error: 'Anda sudah pernah menggunakan hak suara Anda sebelumnya.' }, { status: 403 });
    }

    // Langsung kunci status pemilih di awal sebelum menyimpan surat suara
    await db.orm.public.Dpt.where({ npm: payload.npm }).update({
      hasVoted: true,
      votedAt: new Date(),
    });

    // 5. Catat Seluruh Pilihan Suara Secara Anonim ke Kotak Suara
    for (const item of votesToCast) {
      const candidate = await db.orm.public.Candidate.where({ id: Number(item.candidateId) }).first();
      if (candidate) {
        await db.orm.public.Vote.create({
          category: item.category,
          candidateId: candidate.id,
        });
      }
    }

    // 6. Kunci Status Pemilih
    await db.orm.public.Dpt.where({ npm: payload.npm }).update({
      hasVoted: true,
      votedAt: new Date(),
    });

    // 7. Catat ke Audit Log
    await db.orm.public.AuditLog.create({
      action: 'VOTE_CAST_SUCCESS',
      detail: `NPM ${payload.npm} berhasil memberikan suara untuk ${votesToCast.length} kategori.`,
    });

    return NextResponse.json({
      success: true,
      message: 'Suara Anda berhasil tercatat secara sah dan rahasia. Terima kasih telah berpartisipasi dalam PEMIRA IKM FF UI 2026!',
    });
  } catch (error) {
    console.error('Vote Processing Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat mencatat suara.', detail: error.message },
      { status: 500 }
    );
  }
}