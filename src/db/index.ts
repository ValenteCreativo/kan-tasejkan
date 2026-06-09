import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Lazily initialise the DB connection so that the module can be imported
 * during Next.js build without a DATABASE_URL present.
 * At runtime every API route that hits the DB will have the env var set.
 */
function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      '[db] DATABASE_URL is not set. Add it to your .env.local or deployment environment.'
    );
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

// Singleton — created once per worker on first real request
let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db) {
      _db = getDb();
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Re-export schema for convenience
export * from './schema';
