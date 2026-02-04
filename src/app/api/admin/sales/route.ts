import { NextResponse } from 'next/server';
import { db, cryptoOrders, artworks, walletUsers, shippingAddresses } from '../../../../db';
import { desc } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../lib/auth';

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

    const summary = orders.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        if (order.status === 'paid' || order.status === 'delivered' || order.status === 'shipped') {
          acc.paidOrders += 1;
          acc.totalRevenueUsd += Number(order.amountUsd);
        }
        if (order.status === 'pending') acc.pendingOrders += 1;
        return acc;
      },
      { totalOrders: 0, paidOrders: 0, pendingOrders: 0, totalRevenueUsd: 0 }
    );

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
