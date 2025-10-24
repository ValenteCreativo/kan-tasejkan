import { compare, hash } from 'bcryptjs';
import { supabase } from './supabase';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: hashedPassword,
      name,
      is_admin: email === 'hola@martina.com', // Only Martina is admin
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const WHITELISTED_EMAIL = 'hola@martina.com';

export function isWhitelisted(email: string): boolean {
  return email.toLowerCase() === WHITELISTED_EMAIL.toLowerCase();
}
