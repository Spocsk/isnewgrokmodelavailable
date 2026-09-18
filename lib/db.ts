import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let sql: Sql | null = null;
let tableReady = false;

export function getSql(): Sql {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!sql) {
    sql = neon(url);
  }
  return sql;
}

export async function ensureWaitlistTable(): Promise<Sql> {
  const client = getSql();
  if (!tableReady) {
    await client`
      CREATE TABLE IF NOT EXISTS waitlist (
        email text PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        notified_at timestamptz
      )
    `;
    tableReady = true;
  }
  return client;
}
