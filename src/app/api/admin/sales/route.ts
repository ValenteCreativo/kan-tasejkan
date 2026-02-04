import { NextRequest, NextResponse } from 'next/server';
import { db, cryptoOrders, artworks, walletUsers, shippingAddresses } from '../../../../db';
import { desc, eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../lib/constants';
import { summarizeOrders } from '../../../../lib/admin';

export async function GET(request: NextRequest) {
  const adminEmail = request.headers.get('x-admin-email');
  if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const [adminUser] = await db
      .select()
      .from(walletUsers)
      .where(eq(walletUsers.email, adminEmail.toLowerCase()));

    if (!adminUser || !adminUser.isWhitelisted) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const limit = Math.min(Number(searchParams.get('limit') || 50), 200);

    const query = db
      .select({
        id: cryptoOrders.id,
        status: cryptoOrders.status,
        amountUsd: cryptoOrders.amountUsd,
        tokenAddress: cryptoOrders.tokenAddress,
        chainId: cryptoOrders.chainId,
        txHash: cryptoOrders.txHash,
        createdAt: cryptoOrders.createdAt,
        artworkTitle: artworks.title,
        buyerEmail: walletUsers.email,
        walletAddress: walletUsers.walletAddress,
        shippingCity: shippingAddresses.city,
        shippingCountry: shippingAddresses.country,
        shippingAddress: shippingAddresses.address,
        shippingName: shippingAddresses.fullName,
        shippingPhone: shippingAddresses.phone,
      })
      .from(cryptoOrders)
      .leftJoin(artworks, eq(artworks.id, cryptoOrders.artworkId))
      .leftJoin(walletUsers, eq(walletUsers.id, cryptoOrders.buyerId))
      .leftJoin(shippingAddresses, eq(shippingAddresses.id, cryptoOrders.shippingAddressId));

    const orders = await query
      .where(statusFilter ? eq(cryptoOrders.status, statusFilter) : undefined)
      .orderBy(desc(cryptoOrders.createdAt))
      .limit(limit);

    const summary = summarizeOrders(orders as any);

    return NextResponse.json({
      summary,
      orders: orders.map((o) => ({
        ...o,
        amountUsd: Number(o.amountUsd),
      })),
    });
  } catch (error) {
    console.error('Sales dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load sales' }, { status: 500 });
  }
}
