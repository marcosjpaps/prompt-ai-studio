import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("Neon DATABASE_URL binding is unavailable.");
  }

  const sql = neon(dbUrl as string);
  return drizzle(sql, { schema });
}
