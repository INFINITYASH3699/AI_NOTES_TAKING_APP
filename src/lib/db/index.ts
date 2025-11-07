import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Provide a fallback for build time
const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@placeholder/placeholder";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });