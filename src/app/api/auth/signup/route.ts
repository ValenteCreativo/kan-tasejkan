import { NextResponse } from 'next/server';
import { createUser, isWhitelisted } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!isWhitelisted(email)) {
      return NextResponse.json(
        { error: 'Email not whitelisted. Only hola@martina.com can create an account.' },
        { status: 403 }
      );
    }

    const user = await createUser(email, password, name);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
      },
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
