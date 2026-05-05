DO $$ BEGIN
 EXECUTE 'CREATE TYPE "public"."item_condition_enum" AS ENUM(''New'', ''Good'', ''Used'', ''Damaged'')';
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 EXECUTE 'CREATE TYPE "public"."item_status_enum" AS ENUM(''Active'', ''Low Stock'', ''Out of Stock'')';
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departments" (
	"department_id" serial PRIMARY KEY NOT NULL,
	"department_name" varchar(150) NOT NULL,
	"head" varchar(100),
	"location" varchar(100),
	"status" text DEFAULT 'Active' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT IF EXISTS "unique_item";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT IF EXISTS "items_category_id_categories_category_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT IF EXISTS "items_sub_category_id_sub_categories_sub_category_id_fk";
--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'Active' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "sku" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "quantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "min_stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "unit_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "status" "item_status_enum" DEFAULT 'Active' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "department_id" integer;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "supplier_id" integer;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "location" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "condition" "item_condition_enum" DEFAULT 'New' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "is_consumable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN IF NOT EXISTS "vendorType" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_supplier_id_vendors_vendor_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."vendors"("vendor_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_sub_category_id_sub_categories_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("sub_category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "brand";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "model_number";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "specifications";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "unit_of_measurement";--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "unique_sku" UNIQUE("sku");