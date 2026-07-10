'use server';

import { cookies } from 'next/headers';
import { validateSessionToken, SESSION_COOKIE_NAME } from './session';

/**
 * Verifies that the current request has a valid admin session.
 * Use in server actions to protect write operations.
 */
export async function requireAdmin(): Promise<{ authorized: boolean; email?: string }> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    return { authorized: false };
  }

  const result = await validateSessionToken(session.value);
  return { authorized: result.valid, email: result.email };
}
