import { drizzle } from "drizzle-orm/neon-http";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@placeholder/placeholder";

const sql: NeonQueryFunction<boolean, boolean> = neon(connectionString);
export const db = drizzle(sql, { schema });