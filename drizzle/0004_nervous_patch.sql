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
