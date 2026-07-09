import { NextRequest, NextResponse } from 'next/server';
import { db, reservations } from '../../../db';
import { desc, eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../lib/constants';

// POST: Submit a new reservation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, serviceId, eventId, type, message, preferredDate, preferredTime, attendeesCount } = body;

        if (!name || !email || !type) {
            return NextResponse.json({ error: 'Nombre, email y tipo de reserva son requeridos' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
        }

        const [reservation] = await db
            .insert(reservations)
            .values({
                name,
                email,
                phone: phone || null,
                serviceId: serviceId || null,
                eventId: eventId || null,
                type: type || 'individual',
                message: message || null,
                preferredDate: preferredDate || null,
                preferredTime: preferredTime || null,
                attendeesCount: attendeesCount || null,
                status: 'pending',
            })
            .returning();

        return NextResponse.json({ success: true, reservationId: reservation.id }, { status: 201 });
    } catch (error) {
        console.error('Reservation error:', error);
        return NextResponse.json({ error: 'Error al crear la reserva' }, { status: 500 });
    }
}

// GET: Admin — list all reservations
export async function GET(request: NextRequest) {
    const adminEmail = request.headers.get('x-admin-email');
    if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status');
        const limit = Math.min(Number(searchParams.get('limit') || 50), 200);

        const results = statusFilter
            ? await db.select().from(reservations).where(eq(reservations.status, statusFilter)).orderBy(desc(reservations.createdAt)).limit(limit)
            : await db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(limit);

        return NextResponse.json({ reservations: results });
    } catch (error) {
        console.error('Get reservations error:', error);
        return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }
}
