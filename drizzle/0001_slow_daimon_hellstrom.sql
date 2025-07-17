ALTER TABLE "users" ADD COLUMN "resetPasswordToken" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resetPasswordExpires" timestamp;