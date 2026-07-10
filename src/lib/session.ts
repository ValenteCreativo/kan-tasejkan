/**
 * Simple session management using signed cookies.
 * Uses HMAC-SHA256 for signing session tokens.
 */

const SESSION_SECRET = process.env.SESSION_SECRET || 'mindfulverso-session-secret-change-in-production';
const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verify(payload: string, signature: string): Promise<boolean> {
  const expectedSig = await sign(payload);
  return expectedSig === signature;
}

export async function createSessionToken(email: string): Promise<string> {
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;
  const sig = await sign(payload);
  return `${payload}:${sig}`;
}

export async function validateSessionToken(token: string): Promise<{ valid: boolean; email?: string }> {
  const parts = token.split(':');
  if (parts.length < 3) return { valid: false };

  const sig = parts.pop()!;
  const payload = parts.join(':');
  const [email, timestampStr] = payload.split(':');

  const isValid = await verify(payload, sig);
  if (!isValid) return { valid: false };

  // Check expiration
  const timestamp = parseInt(timestampStr, 10);
  if (Date.now() - timestamp > SESSION_DURATION_MS) return { valid: false };

  return { valid: true, email };
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };
