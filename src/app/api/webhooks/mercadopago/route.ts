import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { artworkService } from '../../../../lib/services';
import { db, mercadoPagoOrders } from '../../../../db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

/**
 * Verifies MercadoPago webhook signature.
 * See: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
function verifyWebhookSignature(request: NextRequest, rawBody: string): boolean {
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    // If no secret configured, skip verification (dev mode)
    if (!webhookSecret) {
        console.warn('MERCADO_PAGO_WEBHOOK_SECRET not set — skipping signature verification');
        return true;
    }

    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    if (!xSignature || !xRequestId) {
        console.warn('Missing MercadoPago signature headers');
        return false;
    }

    // Parse ts and v1 from x-signature header (format: "ts=...;v1=...")
    const parts = xSignature.split(';');
    let ts = '';
    let v1 = '';
    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') v1 = value;
    }

    if (!ts || !v1) return false;

    // Build signed template: "id:{data.id};request-id:{x-request-id};ts:{ts};"
    // We use the rawBody to extract data.id without double-parsing
    let dataId = '';
    try {
        const body = JSON.parse(rawBody);
        dataId = body?.data?.id || '';
    } catch {
        return false;
    }

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(manifest)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(v1, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

export async function POST(req: NextRequest) {
    // Read raw body once for signature verification and parsing
    const rawBody = await req.text();

    // Verify webhook authenticity
    if (!verifyWebhookSignature(req, rawBody)) {
        console.error('Invalid MercadoPago webhook signature');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = JSON.parse(rawBody);
        const { type, data } = body;

        // Handle Payment notifications
        if (type === 'payment' && data?.id) {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: data.id });

            const artworkId = paymentInfo.metadata?.artwork_id || paymentInfo.external_reference;
            const paymentId = String(paymentInfo.id);
            // preference_id is not typed in the SDK but exists at runtime
            const preferenceId = (paymentInfo as unknown as Record<string, unknown>)['preference_id'] as string || '';
            const status = paymentInfo.status || 'pending';
            const buyerEmail = paymentInfo.payer?.email || '';
            const buyerName = [
                paymentInfo.payer?.first_name,
                paymentInfo.payer?.last_name,
            ].filter(Boolean).join(' ');

            // Upsert the MercadoPago order record
            const existing = await db
                .select()
                .from(mercadoPagoOrders)
                .where(eq(mercadoPagoOrders.paymentId, paymentId))
                .limit(1);

            if (existing.length === 0) {
                await db.insert(mercadoPagoOrders).values({
                    artworkId: artworkId || null,
                    preferenceId,
                    paymentId,
                    externalReference: String(artworkId || ''),
                    buyerEmail,
                    buyerName,
                    amountArs: paymentInfo.transaction_amount?.toString() || '0',
                    status,
                });
            } else {
                await db
                    .update(mercadoPagoOrders)
                    .set({ status, updatedAt: new Date() })
                    .where(eq(mercadoPagoOrders.paymentId, paymentId));
            }

            // Mark artwork as sold when payment is approved
            if (status === 'approved' && artworkId) {
                console.log(`Payment approved for artwork ${artworkId}. Marking as sold.`);
                await artworkService.update(String(artworkId), { available: false });
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}
