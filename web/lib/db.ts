import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

/**
 * One pool per server process. Reused across dev hot reloads, which would
 * otherwise open a new pool (and leak connections) on every edit.
 */
export const db =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = db;
}
