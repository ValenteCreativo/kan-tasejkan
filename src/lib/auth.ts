import { compare, hash } from 'bcryptjs';
import { db, users } from '../db';
import { eq } from 'drizzle-orm';
import { WHITELISTED_EMAIL } from './constants';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);

  const [user] = await db.insert(users).values({
    email,
    passwordHash: hashedPassword,
    name,
    isAdmin: email === 'martinagorozo1@proton.me', // Only Martina is admin
  }).returning();

  return user;
}

export function isWhitelisted(email: string): boolean {
  return email.toLowerCase() === WHITELISTED_EMAIL.toLowerCase();
}
