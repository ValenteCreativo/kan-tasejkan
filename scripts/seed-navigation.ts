/**
 * Seed script to populate initial navigation items.
 * Run with: npx tsx scripts/seed-navigation.ts
 */
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

const NAV_ITEMS = [
  { label: '¿Quiénes somos?', description: 'Conoce nuestra historia, propósito y equipo.', href: '/nosotros', icon: 'heart', orderIndex: 0 },
  { label: 'Servicios', description: 'Terapias, ceremonias y más para tu bienestar.', href: '/servicios', icon: 'flower', orderIndex: 1 },
  { label: 'Retiros', description: 'Experiencias transformadoras en lugares sagrados.', href: '/servicios#retiros', icon: 'mountain', orderIndex: 2 },
  { label: 'Cursos', description: 'Formaciones para profundizar tu práctica.', href: '/cursos', icon: 'lotus', orderIndex: 3 },
  { label: 'Mindfulness', description: 'Prácticas y entrenamientos para tu día a día.', href: '/servicios#mindfulness', icon: 'person', orderIndex: 4 },
  { label: 'Contacto', description: 'Estamos aquí para acompañarte.', href: '/contacto', icon: 'mail', orderIndex: 5 },
  { label: 'Testimonios', description: 'Historias reales de transformación.', href: '/testimonios', icon: 'chat', orderIndex: 6 },
  { label: 'Tienda', description: 'Productos conscientes para tu camino.', href: '/tienda', icon: 'bag', orderIndex: 7 },
  { label: 'Calendario', description: 'Eventos, talleres y próximas fechas.', href: '/calendario', icon: 'calendar', orderIndex: 8 },
];

async function seed() {
  console.log('Seeding navigation items...');
  
  // Check if items already exist
  const existing = await db.select().from(schema.navigationItems);
  if (existing.length > 0) {
    console.log(`Already have ${existing.length} navigation items. Skipping.`);
    return;
  }

  for (const item of NAV_ITEMS) {
    await db.insert(schema.navigationItems).values({
      label: item.label,
      description: item.description,
      href: item.href,
      icon: item.icon,
      orderIndex: item.orderIndex,
      isVisible: true,
    });
  }

  console.log(`✓ Seeded ${NAV_ITEMS.length} navigation items.`);
}

seed().catch(console.error).finally(() => process.exit(0));
