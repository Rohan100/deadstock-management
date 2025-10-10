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
CREATE TABLE "warehouse_stock" (
	"warehouse_stock_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"quantity_available" integer DEFAULT 0 NOT NULL,
	"remarks" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_history_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_history_vendor_id_vendors_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("vendor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_stock" ADD CONSTRAINT "warehouse_stock_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;