import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '../../../../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from '../../../../lib/constants';
import { hashPassword, verifyPassword } from '../../../../lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Ambas contraseñas son requeridas' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    // Get admin user
    const [user] = await db.select().from(users).where(eq(users.email, WHITELISTED_EMAIL.toLowerCase()));

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 401 });
    }

    // Update password
    const newHash = await hashPassword(newPassword);
    await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
