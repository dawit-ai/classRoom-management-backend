import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
const isMigrationCommand =
  process.env.DRIZZLE_MIGRATION === "1" || process.argv.includes("migrate");

if (isMigrationCommand && !databaseUrl) {
  throw new Error("DATABASE_URL is not set in classRoom-backend/.env.");
}

export default defineConfig({
  schema: "./src/schema/app.ts",
  out: "./drizzle",
  dialect: "postgresql",
  ...(databaseUrl ? { dbCredentials: { url: databaseUrl } } : {}),
});
