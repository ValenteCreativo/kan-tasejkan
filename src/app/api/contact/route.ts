import { NextRequest, NextResponse } from 'next/server';
import { getSiteSetting } from '../../../actions';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nombre, email y mensaje son requeridos' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Get WhatsApp number from DB settings, fallback to env
    const { data: dbNumber } = await getSiteSetting('whatsapp_number');
    const whatsappNumber = dbNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+525555555555';
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

    const whatsappMessage = encodeURIComponent(
      `📩 Nuevo mensaje de contacto\n\n` +
      `👤 Nombre: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📋 Asunto: ${subject || 'Sin asunto'}\n\n` +
      `💬 Mensaje:\n${message}`
    );
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${whatsappMessage}`;

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente',
      whatsappUrl,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
