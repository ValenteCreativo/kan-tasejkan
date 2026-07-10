import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '../../../../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../../../../lib/constants';
import { hashPassword, verifyPassword } from '../../../../lib/auth';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_MS } from '../../../../lib/session';

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

      // Create session cookie
      const token = await createSessionToken(newUser.email);
      const response = NextResponse.json({
        success: true,
        user: { id: newUser.id, email: newUser.email, name: newUser.name, isAdmin: true },
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_DURATION_MS / 1000,
      });

      return response;
    }

    // User exists — verify password
    const isValid = await verifyPassword(password, existingUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    // Create session cookie
    const token = await createSessionToken(existingUser.email);
    const response = NextResponse.json({
      success: true,
      user: { id: existingUser.id, email: existingUser.email, name: existingUser.name, isAdmin: existingUser.isAdmin },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
