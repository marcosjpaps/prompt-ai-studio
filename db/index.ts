import { env } from "cloudflare:workers";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDb() {
  if (!env.DATABASE_URL) {
    throw new Error("Neon DATABASE_URL binding is unavailable.");
  }

  const sql = neon(env.DATABASE_URL as string);
  return drizzle(sql, { schema });
}
