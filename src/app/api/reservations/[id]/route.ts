import { NextRequest, NextResponse } from 'next/server';
import { db, reservations } from '../../../../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../lib/constants';

// PATCH: Admin updates reservation status or notes
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminEmail = request.headers.get('x-admin-email');
    if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { id } = await params;
        const { status, adminNotes } = await request.json();

        const validStatuses = ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const [updated] = await db
            .update(reservations)
            .set(updateData)
            .where(eq(reservations.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, reservation: updated });
    } catch (error) {
        console.error('Update reservation error:', error);
        return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
    }
}

// DELETE: Admin deletes a reservation
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminEmail = request.headers.get('x-admin-email');
    if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { id } = await params;
        await db.delete(reservations).where(eq(reservations.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete reservation error:', error);
        return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
    }
}
