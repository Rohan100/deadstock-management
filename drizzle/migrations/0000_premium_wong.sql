CREATE TYPE "public"."condition_status_enum" AS ENUM('New', 'Good', 'Fair', 'Poor', 'Damaged');--> statement-breakpoint
CREATE TYPE "public"."disposal_method_enum" AS ENUM('Sale', 'Donation', 'Scrap', 'E-Waste', 'Other');--> statement-breakpoint
CREATE TYPE "public"."transfer_type_enum" AS ENUM('Warehouse to Lab', 'Lab to Lab', 'Lab to Warehouse');--> statement-breakpoint
CREATE TABLE "buildings" (
	"building_id" serial PRIMARY KEY NOT NULL,
	"building_name" varchar(100) NOT NULL,
	"address" text
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
CREATE TABLE "items" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"item_name" varchar(200) NOT NULL,
	"category_id" integer NOT NULL,
	"sub_category_id" integer,
	"brand" varchar(100),
	"model_number" varchar(100),
	"specifications" text,
	"unit_of_measurement" varchar(20),
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_item" UNIQUE("item_name","brand","model_number")
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
CREATE TABLE "labs" (
	"lab_id" serial PRIMARY KEY NOT NULL,
	"building_id" integer NOT NULL,
	"lab_name" varchar(100) NOT NULL,
	"lab_code" varchar(50),
	"floor_number" integer,
	"lab_type" varchar(50),
	"capacity" integer,
	"in_charge_name" varchar(100),
	"in_charge_contact" varchar(15),
	CONSTRAINT "labs_lab_code_unique" UNIQUE("lab_code")
);
--> statement-breakpoint
CREATE TABLE "purchase_history" (
	"purchase_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"vendor_id" integer,
	"quantity_purchased" integer NOT NULL,
	"unit_price" numeric(10, 2),
	"total_amount" numeric(12, 2),
	"purchase_date" date NOT NULL,
	"invoice_number" varchar(50),
	"invoice_date" date,
	"remarks" text,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "sub_categories" (
	"sub_category_id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"sub_category_name" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"vendor_id" serial PRIMARY KEY NOT NULL,
	"vendor_name" varchar(150) NOT NULL,
	"contact_person" varchar(100),
	"email" varchar(100),
	"phone" varchar(15),
	"address" text,
	"gstin" varchar(15),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "warehouse_stock" (
	"warehouse_stock_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"quantity_available" integer DEFAULT 0 NOT NULL,
	"remarks" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "disposal_records" ADD CONSTRAINT "disposal_records_lab_id_labs_lab_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disposal_records" ADD CONSTRAINT "disposal_records_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_sub_category_id_sub_categories_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("sub_category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_stock" ADD CONSTRAINT "lab_stock_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_stock" ADD CONSTRAINT "lab_stock_lab_id_labs_lab_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labs" ADD CONSTRAINT "labs_building_id_buildings_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("building_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_history_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_history_vendor_id_vendors_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("vendor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_lab_id_labs_lab_id_fk" FOREIGN KEY ("from_lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_lab_id_labs_lab_id_fk" FOREIGN KEY ("to_lab_id") REFERENCES "public"."labs"("lab_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_stock" ADD CONSTRAINT "warehouse_stock_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;