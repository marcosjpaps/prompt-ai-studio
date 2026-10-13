import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

if (process.env.VERCEL_ENV !== 'production' || process.env.STUDIO_DB_BOOTSTRAP !== '1') {
  console.log('Studio database bootstrap skipped.');
} else {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is missing.');
  const url = new URL(connectionString);
  const expectedHost = 'ep-blue-queen-b5rl9vly-pooler.c-7.us-east-2.aws.neon.tech';
  if (url.hostname !== expectedHost || url.pathname !== '/neondb') {
    throw new Error('Database bootstrap blocked: target is not the new dedicated Neon database.');
  }

  const db = neon(connectionString);
  const statements = readFileSync(new URL('../drizzle/0000_lumpy_mystique.sql', import.meta.url), 'utf8')
    .split('--> statement-breakpoint')
    .map(sql => sql.trim())
    .filter(Boolean)
    .map(sql => sql
      .replace(/^CREATE TABLE\s+/i, 'CREATE TABLE IF NOT EXISTS ')
      .replace(/^CREATE INDEX\s+/i, 'CREATE INDEX IF NOT EXISTS '));

  if (statements.length !== 6 || statements.some(sql => !/^CREATE (TABLE|INDEX) IF NOT EXISTS\b/i.test(sql))) {
    throw new Error('Unexpected migration content; refusing to run.');
  }

  console.log('Creating missing Prompt AI Studio tables and indexes...');
  for (const statement of statements) await db.query(statement);

  const check = await db.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('projects','memories','images') ORDER BY table_name"
  );
  const tables = check.map(row => row.table_name);
  if (tables.length !== 3) throw new Error('Studio database bootstrap incomplete.');
  console.log('Database bootstrap OK: ' + tables.join(', '));
}
