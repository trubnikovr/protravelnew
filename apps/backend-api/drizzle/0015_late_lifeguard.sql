CREATE TYPE "public"."tour_booking_status" AS ENUM('pending', 'confirmed', 'paid', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "tour_booking_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"storage_key" varchar(255) NOT NULL,
	"mime_type" varchar(127) NOT NULL,
	"size" integer NOT NULL,
	"uploaded_by_admin_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_number" varchar(32) NOT NULL,
	"customer_id" uuid NOT NULL,
	"tour_id" uuid NOT NULL,
	"status" "tour_booking_status" DEFAULT 'pending' NOT NULL,
	"travelers_count" integer NOT NULL,
	"departure_date" date,
	"total_amount" numeric(18, 0) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"notes" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tour_booking_documents" ADD CONSTRAINT "tour_booking_documents_booking_id_tour_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."tour_bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_booking_documents" ADD CONSTRAINT "tour_booking_documents_uploaded_by_admin_id_admins_id_fk" FOREIGN KEY ("uploaded_by_admin_id") REFERENCES "public"."admins"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD CONSTRAINT "tour_bookings_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD CONSTRAINT "tour_bookings_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tour_booking_documents_storage_key_unique" ON "tour_booking_documents" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "tour_booking_documents_booking_created_idx" ON "tour_booking_documents" USING btree ("booking_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tour_bookings_number_unique" ON "tour_bookings" USING btree ("booking_number");--> statement-breakpoint
CREATE INDEX "tour_bookings_customer_idx" ON "tour_bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "tour_bookings_tour_idx" ON "tour_bookings" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "tour_bookings_status_created_idx" ON "tour_bookings" USING btree ("status","created_at");