ALTER TABLE "labs" ALTER COLUMN "building_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "labs" ADD COLUMN IF NOT EXISTS "department_id" integer;--> statement-breakpoint
ALTER TABLE "labs" ADD CONSTRAINT "labs_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE restrict ON UPDATE no action;