CREATE TYPE "public"."traveler_document_type" AS ENUM('national_passport', 'international_passport', 'id_card', 'birth_certificate');--> statement-breakpoint
CREATE TYPE "public"."traveler_gender" AS ENUM('male', 'female', 'unspecified');--> statement-breakpoint
CREATE TYPE "public"."traveler_relationship" AS ENUM('self', 'spouse', 'child', 'parent', 'sibling', 'other');--> statement-breakpoint
CREATE TABLE "traveler_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"traveler_id" uuid NOT NULL,
	"type" "traveler_document_type" NOT NULL,
	"number_encrypted" text NOT NULL,
	"number_iv" varchar(24) NOT NULL,
	"number_auth_tag" varchar(24) NOT NULL,
	"number_last4" varchar(4) NOT NULL,
	"issuing_country_code" varchar(2) NOT NULL,
	"issued_at" date,
	"expires_at" date,
	"first_name_latin" varchar(80) NOT NULL,
	"last_name_latin" varchar(80) NOT NULL,
	"file_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "travelers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"relationship" "traveler_relationship" NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(80) NOT NULL,
	"middle_name" varchar(80),
	"first_name_latin" varchar(80),
	"last_name_latin" varchar(80),
	"gender" "traveler_gender" DEFAULT 'unspecified' NOT NULL,
	"birth_date" date,
	"citizenship_country_code" varchar(2),
	"phone" varchar(32),
	"email" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "time_zone" varchar(64) DEFAULT 'Asia/Tashkent' NOT NULL;--> statement-breakpoint
ALTER TABLE "traveler_documents" ADD CONSTRAINT "traveler_documents_traveler_id_travelers_id_fk" FOREIGN KEY ("traveler_id") REFERENCES "public"."travelers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travelers" ADD CONSTRAINT "travelers_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "traveler_documents_traveler_idx" ON "traveler_documents" USING btree ("traveler_id");--> statement-breakpoint
CREATE INDEX "traveler_documents_expiry_idx" ON "traveler_documents" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "travelers_customer_idx" ON "travelers" USING btree ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "travelers_single_self_per_customer_unique" ON "travelers" USING btree ("customer_id") WHERE "travelers"."relationship" = 'self';