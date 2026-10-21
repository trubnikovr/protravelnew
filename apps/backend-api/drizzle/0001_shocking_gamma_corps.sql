CREATE TYPE "public"."admin_role" AS ENUM('super_admin', 'admin', 'content_manager', 'support_manager', 'finance_manager');--> statement-breakpoint
CREATE TYPE "public"."admin_status" AS ENUM('active', 'blocked');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(80),
	"role" "admin_role" DEFAULT 'admin' NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "admin_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admins_email_unique" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admins_status_idx" ON "admins" USING btree ("status");--> statement-breakpoint
CREATE INDEX "admins_role_idx" ON "admins" USING btree ("role");