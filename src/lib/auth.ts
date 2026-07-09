/**
 * Auth helpers — Simple email-based admin authentication.
 */
import { WHITELISTED_EMAIL } from './constants';

export function isWhitelisted(email: string): boolean {
  return email.toLowerCase() === WHITELISTED_EMAIL.toLowerCase();
}
