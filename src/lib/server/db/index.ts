// ═══════════════════════════════════════════════════════════
// Database Connection — Drizzle + postgres.js
// ═══════════════════════════════════════════════════════════

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

const connectionString = env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/breakthebox_dev';

const client = postgres(connectionString);
export const db = drizzle(client);
