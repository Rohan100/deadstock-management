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
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_sub_category_id_sub_categories_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("sub_category_id") ON DELETE no action ON UPDATE no action;