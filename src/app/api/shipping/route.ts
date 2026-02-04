import { NextRequest, NextResponse } from 'next/server';
import { db, shippingAddresses, cryptoOrders, walletUsers } from '../../../db';
import { eq } from 'drizzle-orm';

// POST: Create/update shipping address for an order
export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      fullName,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
    } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!fullName || !address || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Missing required shipping fields' },
        { status: 400 }
      );
    }

    // Get the order
    const [order] = await db
      .select()
      .from(cryptoOrders)
      .where(eq(cryptoOrders.id, orderId));

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create shipping address
    const [shippingAddress] = await db
      .insert(shippingAddresses)
      .values({
        userId: order.buyerId,
        fullName,
        address,
        city,
        state: state || null,
        postalCode,
        country,
        phone: phone || null,
        isDefault: true,
      })
      .returning();

    // Update order with shipping address
    await db
      .update(cryptoOrders)
      .set({
        shippingAddressId: shippingAddress.id,
        updatedAt: new Date(),
      })
      .where(eq(cryptoOrders.id, orderId));

    return NextResponse.json({
      success: true,
      shippingAddress,
    });
  } catch (error) {
    console.error('Shipping address error:', error);
    return NextResponse.json(
      { error: 'Failed to save shipping address' },
      { status: 500 }
    );
  }
}

// GET: Get shipping addresses for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    if (orderId) {
      // Get shipping address for specific order
      const [order] = await db
        .select()
        .from(cryptoOrders)
        .where(eq(cryptoOrders.id, orderId));

      if (!order || !order.shippingAddressId) {
        return NextResponse.json({ shippingAddress: null });
      }

      const [shippingAddress] = await db
        .select()
        .from(shippingAddresses)
        .where(eq(shippingAddresses.id, order.shippingAddressId));

      return NextResponse.json({ shippingAddress });
    }

    if (userId) {
      // Get all addresses for user
      const addresses = await db
        .select()
        .from(shippingAddresses)
        .where(eq(shippingAddresses.userId, userId));

      return NextResponse.json({ addresses });
    }

    return NextResponse.json(
      { error: 'userId or orderId is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get shipping address error:', error);
    return NextResponse.json(
      { error: 'Failed to get shipping address' },
      { status: 500 }
    );
  }
}
