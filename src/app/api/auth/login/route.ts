import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '../../../../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../../../../lib/constants';
import { hashPassword, verifyPassword } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // Only the whitelisted email can access
    if (email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
    }

    // Check if user exists in DB
    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

    if (!existingUser) {
      // First time login — create user with default password hash
      if (password !== DEFAULT_ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
      }

      // Create the admin user
      const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash,
        name: 'Verónica',
        isAdmin: true,
      }).returning();

      return NextResponse.json({
        success: true,
        user: { id: newUser.id, email: newUser.email, name: newUser.name, isAdmin: true },
      });
    }

    // User exists — verify password
    const isValid = await verifyPassword(password, existingUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { id: existingUser.id, email: existingUser.email, name: existingUser.name, isAdmin: existingUser.isAdmin },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
