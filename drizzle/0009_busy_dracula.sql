CREATE TYPE "public"."condition_status_enum" AS ENUM('New', 'Good', 'Fair', 'Poor', 'Damaged');--> statement-breakpoint
CREATE TYPE "public"."disposal_method_enum" AS ENUM('Sale', 'Donation', 'Scrap', 'E-Waste', 'Other');--> statement-breakpoint
CREATE TYPE "public"."transfer_type_enum" AS ENUM('Warehouse to Lab', 'Lab to Lab', 'Lab to Warehouse');--> statement-breakpoint
CREATE TABLE "disposal_records" (
	"disposal_id" serial PRIMARY KEY NOT NULL,
	"lab_id" integer,
	"item_id" integer,
	"disposal_date" date DEFAULT now() NOT NULL,
	"disposal_method" "disposal_method_enum" NOT NULL,
	"disposal_reason" text,
	"disposal_quantity" integer,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "lab_stock" (
	"lab_stock_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"lab_id" integer NOT NULL,
	"quantity" integer DEFAULT 1,
	"condition_status" "condition_status_enum" DEFAULT 'New',
	"remarks" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_transfers" (
	"transfer_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"transfer_type" "transfer_type_enum" NOT NULL,
	"from_lab_id" integer,
	"to_lab_id" integer,
	"quantity" integer NOT NULL,
	"transfer_date" timestamp DEFAULT now(),
	"performed_by" integer NOT NULL,
	"remarks" text
);
--> statement-breakpoint
ALTER TABLE "disposal_records" ADD CONSTRAINT "disposal_records_lab_id_labs_lab_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disposal_records" ADD CONSTRAINT "disposal_records_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_stock" ADD CONSTRAINT "lab_stock_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_stock" ADD CONSTRAINT "lab_stock_lab_id_labs_lab_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_lab_id_labs_lab_id_fk" FOREIGN KEY ("from_lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_lab_id_labs_lab_id_fk" FOREIGN KEY ("to_lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;