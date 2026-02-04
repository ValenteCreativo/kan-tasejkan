import { NextRequest, NextResponse } from 'next/server';
import { db, cryptoOrders, walletUsers } from '../../../../../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../../lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    const adminEmail = request.headers.get('x-admin-email');
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [adminUser] = await db
      .select()
      .from(walletUsers)
      .where(eq(walletUsers.email, adminEmail.toLowerCase()))
      .limit(1);

    if (!adminUser || !adminUser.isWhitelisted) {
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
