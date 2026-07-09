// Mindfulverso — shared constants (safe for client and server)

export const WHITELISTED_EMAIL = 'veromafud09@gmail.com';

export const DEFAULT_ADMIN_PASSWORD = 'Admin1234';

export const SITE_NAME = 'Mindfulverso';
export const SITE_TAGLINE = 'Bienestar Universal';
export const SITE_DESCRIPTION = 'Un espacio para cultivar bienestar, conciencia y transformación.';

export const WHATSAPP_NUMBER = '+525555555555'; // TODO: Update with real number
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`;

export const SERVICE_CATEGORIES = [
  'Psicoterapia',
  'Mindfulness',
  'Access Bars',
  'Ceremonias',
  'Círculos',
  'Diplomado',
  'Talleres',
  'Retiros',
] as const;

export const EVENT_CATEGORIES = [
  'Ceremonias',
  'Círculos',
  'Mindfulness',
  'Retiros',
  'Talleres',
  'Cursos',
  'Diplomado',
] as const;

export const PRODUCT_CATEGORIES = [
  'Velas',
  'Yoga',
  'Cojines',
  'Cuidado personal',
  'Objetos conscientes',
  'Otros',
] as const;
