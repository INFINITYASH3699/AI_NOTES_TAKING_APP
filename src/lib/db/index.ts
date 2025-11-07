import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://localhost/placeholder";

const sql = neon(connectionString);

export const db = drizzle(sql as any, { schema });