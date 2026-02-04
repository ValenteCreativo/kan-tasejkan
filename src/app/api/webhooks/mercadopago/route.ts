import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { artworkService } from '../../../../lib/services';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        // Handle Payment notifications
        if (type === 'payment') {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: data.id });

            if (paymentInfo.status === 'approved') {
                const artworkId = paymentInfo.metadata?.artwork_id || paymentInfo.external_reference;

                if (artworkId) {
                    console.log(`Payment approved for artwork ${artworkId}. Marking as sold.`);
                    await artworkService.update(String(artworkId), { available: false });
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}
