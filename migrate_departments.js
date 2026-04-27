import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const sql = `
-- Create departments table
CREATE TABLE IF NOT EXISTS "departments" (
  "department_id" serial PRIMARY KEY NOT NULL,
  "department_name" varchar(150) NOT NULL,
  "head" varchar(100),
  "location" varchar(100),
  "status" text NOT NULL DEFAULT 'Active',
  "description" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Drop old department varchar column from items (if it exists)
ALTER TABLE "items" DROP COLUMN IF EXISTS "department";

-- Add departmentId FK column to items (if not exists)
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "department_id" integer;

-- Add FK constraint (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'items_department_id_departments_department_id_fk'
  ) THEN
    ALTER TABLE "items"
      ADD CONSTRAINT "items_department_id_departments_department_id_fk"
      FOREIGN KEY ("department_id")
      REFERENCES "departments"("department_id")
      ON DELETE SET NULL;
  END IF;
END $$;
`;

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Running migration...');
    await client.query(sql);
    console.log('✅ Migration complete!');
    console.log('  - Created departments table');
    console.log('  - Dropped old department varchar from items');
    console.log('  - Added department_id FK to items');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
