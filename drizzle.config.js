import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'drizzle-kit';

// Explicitly load .env.local
dotenv.config({ path: path.resolve('./.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

export default defineConfig({
  out: './drizzle/migrations',     // folder where migrations will be stored
  schema: './src/db/schema.js',    // path to your schema file
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL, // now this will be correctly defined
  },
});
