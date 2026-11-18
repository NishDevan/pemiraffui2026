import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { db } from '@/prisma/db';

// GET status open/close & schedule of the election page
export async function GET() {
    try {
        const statusSetting = await db.orm.public.SystemSetting.where({ key: 'ELECTION_STATUS' }).first();
        const scheduleSetting = await db.orm.public.SystemSetting.where({ key: 'ELECTION_SCHEDULE' }).first();

        return NextResponse.json({
            success: true,
            status: statusSetting?.value || 'OPEN',
            schedule: scheduleSetting?.value || '08.00 - 16.00 WIB',
        });
    } catch (error) {
        console.error('Fetch Setting Error:', error);
        
        return NextResponse.json(
            { success: true, status: 'OPEN', schedule: '08.00 - 16.00 WIB'}
        );
    }
}

// POST to update the status open/close & schedule of the election page (only for admin)
export async function POST(request) {
    try {
        const token = request.cookies.get('pemira_session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
        }

        const payload = await verifySessionToken(token);
        const adminNpms = (process.env.ADMIN_NPM || '').split(',').map((npm) => npm.trim());
        const isAdmin = adminNpms.includes(String(payload?.npm));

        if (!isAdmin) {
            return NextResponse.json({ error: 'Hanya panitia yang dapat mengubah pengaturan.' }, { status: 403 });
        }

        const body = await request.json();
        const { status, schedule } = body;

        // Save the status
        if (status) {
            const existingStatus = await db.orm.public.SystemSetting.where({ key: 'ELECTION_STATUS' }).first();

            if (existingStatus) {
                await db.orm.public.SystemSetting.where({ key: 'ELECTION_STATUS' }).update({ value: status });
            } else {
                await db.orm.public.SystemSetting.create({ key: 'ELECTION_STATUS', value: status });
            }
        }

        // Save the schedule
        if (schedule) {
            const existingSchedule = await db.orm.public.SystemSetting.where({ key: 'ELECTION_SCHEDULE' }).first();

            if (existingSchedule) {
                await db.orm.public.SystemSetting.where({ key: 'ELECTION_SCHEDULE' }).update({ value: schedule });
            } else {
                await db.orm.public.SystemSetting.create({ key: 'ELECTION_SCHEDULE', value: schedule });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Pengaturan bilik suara berhasil diperbarui!',
            status,
            schedule,
        });
    } catch (error) {
        console.error('Update Setting Error:', error);
        return NextResponse.json({ error: 'Gagal memperbarui pengaturan.', detail: error.message }, { status: 500 });
    }
}