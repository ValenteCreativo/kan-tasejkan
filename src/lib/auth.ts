/**
 * Auth helpers — Privy-based admin authentication.
 * Password-based auth was removed. Admin access is handled via Privy + email whitelist.
 */
import { WHITELISTED_EMAIL } from './constants';

export function isWhitelisted(email: string): boolean {
  return email.toLowerCase() === WHITELISTED_EMAIL.toLowerCase();
}
