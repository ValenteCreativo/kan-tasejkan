import { NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
