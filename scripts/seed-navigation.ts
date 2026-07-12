import 'dotenv/config';
import { db } from '../src/db';
import { navigationItems } from '../src/db/schema';

async function seed() {
  console.log('🌱 Seeding Kan-Tasejkan navigation...');

  // Clear existing
  await db.delete(navigationItems);

  // Insert new nav items for Kan-Tasejkan
  const items = [
    {
      label: 'Quiénes Somos',
      description: 'Nuestra historia y comunidad.',
      href: '/quienes-somos',
      icon: 'people',
      orderIndex: 0,
      isVisible: true,
    },
    {
      label: 'Servicios',
      description: 'Hospedaje, restaurant, aventura, balneario y camping.',
      href: '/servicios',
      icon: 'mountain',
      orderIndex: 1,
      isVisible: true,
    },
    {
      label: 'Talleres',
      description: 'Aprende de nuestra cultura ancestral.',
      href: '/talleres',
      icon: 'hands',
      orderIndex: 2,
      isVisible: true,
    },
    {
      label: 'Experiencias',
      description: 'Gastronómica, rituales, bodas tradicionales.',
      href: '/experiencias',
      icon: 'fire',
      orderIndex: 3,
      isVisible: true,
    },
    {
      label: 'Premios y Certificaciones',
      description: 'Reconocimientos a nuestro trabajo.',
      href: '/premios',
      icon: 'star',
      orderIndex: 4,
      isVisible: true,
    },
  ];

  for (const item of items) {
    await db.insert(navigationItems).values(item);
  }

  console.log(`✅ ${items.length} navigation items seeded for Kan-Tasejkan`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
