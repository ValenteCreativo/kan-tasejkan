import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title, price, description, picture_url } = body;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: id,
                        title: title,
                        unit_price: Number(price),
                        quantity: 1,
                        description: description,
                        picture_url: picture_url,
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
                    artwork_id: id
                }
            },
        });

        return NextResponse.json({ id: result.id, url: result.init_point });
    } catch (error) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
    }
}
