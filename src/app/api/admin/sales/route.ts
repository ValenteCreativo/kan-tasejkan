import { NextResponse } from 'next/server';
import { db, cryptoOrders, artworks, walletUsers, shippingAddresses } from '../../../../db';
import { desc } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../lib/auth';
import { summarizeOrders } from '../../../../lib/admin';

export async function GET(request: Request) {
  const adminEmail = request.headers.get('x-admin-email');
  if (!adminEmail || adminEmail.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const orders = await db
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
      })
      .from(cryptoOrders)
      .leftJoin(artworks, artworks.id.eq(cryptoOrders.artworkId))
      .leftJoin(walletUsers, walletUsers.id.eq(cryptoOrders.buyerId))
      .leftJoin(shippingAddresses, shippingAddresses.id.eq(cryptoOrders.shippingAddressId))
      .orderBy(desc(cryptoOrders.createdAt))
      .limit(50);

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
