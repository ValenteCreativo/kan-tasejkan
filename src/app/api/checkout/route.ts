import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { db, mercadoPagoOrders, artworks } from '../../../db';
import { eq } from 'drizzle-orm';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title, price, description, picture_url } = body;

        if (!id || !title || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify artwork exists and is available
        const [artwork] = await db
            .select()
            .from(artworks)
            .where(eq(artworks.id, id));

        if (!artwork) {
            return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
        }

        if (!artwork.available) {
            return NextResponse.json({ error: 'Artwork is no longer available' }, { status: 400 });
        }

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id,
                        title,
                        unit_price: Number(price),
                        quantity: 1,
                        description: description || '',
                        picture_url: picture_url || '',
                    },
                ],
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
                },
                auto_return: 'approved',
                external_reference: id,
                metadata: {
                    artwork_id: id,
                },
            },
        });

        // Register a pending MercadoPago order in our DB
        await db.insert(mercadoPagoOrders).values({
            artworkId: id,
            preferenceId: result.id || '',
            externalReference: id,
            amountUsd: price.toString(),
            status: 'pending',
        }).onConflictDoNothing();

        return NextResponse.json({ id: result.id, url: result.init_point });
    } catch (error) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
    }
}
