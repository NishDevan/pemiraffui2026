import { NextResponse } from 'next/server';
import { validateCasTicket } from '@/lib/cas';
import { createSessionToken } from '@/lib/auth';
import { db } from '@/prisma/db';

export async function GET(request) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const callbackUrl = `${appUrl}/api/auth/callback`;

  const { searchParams } = new URL(request.url);
  const ticket = searchParams.get('ticket');

  if (!ticket) {
    return NextResponse.json({ error: 'Parameter ticket SSO tidak ditemukan' }, { status: 400 });
  }

  try {
    // 1. Validasi tiket CAS ke server SSO UI
    const casResult = await validateCasTicket(ticket, callbackUrl);

    if (!casResult.success) {
      return NextResponse.json(
        { error: 'Autentikasi SSO UI gagal', detail: casResult.error },
        { status: 401 }
      );
    }

    const { npm, name, username } = casResult;

    // 2. Validasi DPT di Database: Apakah mahasiswa FF UI terdaftar?
    const voter = await db.orm.public.Dpt.where({ npm: String(npm) }).first();

    if (!voter) {
      // Catat log jika mahasiswa non-FF mencoba masuk
      await db.orm.public.AuditLog.create({
        action: 'UNREGISTERED_LOGIN_ATTEMPT',
        detail: `NPM ${npm} (${name || username}) tidak terdaftar pada DPT`,
      });

      return NextResponse.json(
        {
          error: 'Akses Ditolak',
          message: `NPM ${npm} tidak terdaftar dalam DPT PEMIRA IKM FF UI. Jika Anda mahasiswa aktif Fakultas Farmasi UI, silahkan hubungi panitia.`,
        },
        { status: 403 }
      );
    }

    // 3. Catat log login berhasil
    await db.orm.public.AuditLog.create({
      action: 'LOGIN_SUCCESS',
      detail: `NPM ${npm} berhasil login.`,
    });

    // 4. Buat JWT Session Token
    const sessionToken = await createSessionToken({
      npm: voter.npm,
      name: voter.name,
      studyProgram: voter.studyProgram,
      batch: voter.batch,
    });

    // 5. Set Cookie dan Redirect langsung ke Halaman Utama (/)
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('pemira_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // Berlaku 2 jam
    });

    return response;
  } catch (error) {
    console.error('SSO Callback Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server ketika memproses login SSO UI', detail: error.message },
      { status: 500 }
    );
  }
}