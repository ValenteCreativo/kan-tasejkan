// Admin helpers — kept for backward compatibility with admin module
import { WHITELISTED_EMAIL } from './constants';

export const ADMIN_EMAIL = WHITELISTED_EMAIL;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
