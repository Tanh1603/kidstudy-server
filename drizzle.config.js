// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.js",
  out: "./src/db/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
