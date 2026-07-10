import { getSiteSettings } from '../actions';

/**
 * Fetches site settings from DB, returns a map of key → value.
 * Use server-side or in client components.
 */
export async function loadSiteSettings(): Promise<Record<string, string>> {
  try {
    const { data } = await getSiteSettings();
    return data || {};
  } catch {
    return {};
  }
}

/**
 * Gets the WhatsApp URL, preferring DB setting over env variable.
 */
export function getWhatsAppUrl(settings: Record<string, string>): string {
  const number = settings['whatsapp_number'] || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+525555555555';
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`;
}
