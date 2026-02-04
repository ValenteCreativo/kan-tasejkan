import { NextResponse } from 'next/server';
import { createUser, isWhitelisted } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!isWhitelisted(email)) {
      return NextResponse.json(
        { error: 'Email not whitelisted. Solo martinagorozo1@proton.me puede crear cuenta.' },
        { status: 403 }
      );
    }

    const user = await createUser(email, password, name);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'Signup failed',
      details: (error as Error).message || 'Unknown error'
    }, { status: 500 });
  }
}
