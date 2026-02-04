import { NextResponse } from 'next/server';
import { db, cryptoOrders } from '../../../../../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../../lib/auth';
import { summarizeOrders } from '../../../../../lib/admin';

export async function POST(request: Request) {
  try {
    const { orderId, status, adminEmail } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [updated] = await db
      .update(cryptoOrders)
      .set({ status, updatedAt: new Date() })
      .where(eq(cryptoOrders.id, orderId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
