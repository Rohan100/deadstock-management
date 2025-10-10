CREATE TABLE "buildings" (
	"building_id" serial PRIMARY KEY NOT NULL,
	"building_name" varchar(100) NOT NULL,
	"address" text
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
ALTER TABLE "labs" ADD CONSTRAINT "labs_building_id_buildings_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("building_id") ON DELETE cascade ON UPDATE no action;