import 'dotenv/config';
import { db } from '../src/db';
import { siteSettings } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const INITIAL_SETTINGS: Record<string, string> = {
  site_name: 'Kan-Tasejkan',
  site_tagline: 'Lugar de Sombras · Ecoturismo Indígena',
  site_description: 'Centro ecoturístico indígena en la Sierra Sur de Veracruz. Hospedaje, talleres, experiencias culturales y aventura.',
  whatsapp_number: '+529241078457',
  whatsapp_message: 'Hola, me interesa conocer más sobre Kan-Tasejkan. ¿Podrían orientarme?',
  contact_email: 'contacto@kan-tasejkan.com',
  horario: 'Lun – Dom, 8:00 – 20:00 (WhatsApp)',
  direccion: 'Centro Ecoturístico Kan-Tasejkan\nTonalapan, Mecayapan, Sierra Sur de Veracruz',
  google_maps_url: 'https://maps.app.goo.gl/B1ts4V4fcXwNtTnh7',
  facebook_url: 'https://facebook.com/kantasejkan',
  instagram_url: 'https://instagram.com/kantasejkan',
  tiktok_url: 'https://vt.tiktok.com/ZSXNr1XAr/',
  landing_subtitle: 'Lugar de Sombras · Ecoturismo Indígena',
};

async function seed() {
  console.log('🌱 Seeding site settings...');

  for (const [key, value] of Object.entries(INITIAL_SETTINGS)) {
    const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    if (!existing) {
      await db.insert(siteSettings).values({ key, value });
      console.log(`  ✅ ${key}`);
    } else {
      console.log(`  ⏭️  ${key} (already exists, skipping)`);
    }
  }

  console.log('\n✅ Settings seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
