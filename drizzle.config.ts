import type { Config } from "drizzle-kit";

// Don't fail if DATABASE_URL is missing during build
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config;