import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Allow build to succeed even without DATABASE_URL
const connectionString = process.env.DATABASE_URL || "postgresql://placeholder";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });