CREATE TABLE "tour_booking_travelers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"traveler_id" uuid,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(80) NOT NULL,
	"middle_name" varchar(80),
	"gender" "traveler_gender" NOT NULL,
	"birth_date" date,
	"citizenship_country_code" varchar(2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD COLUMN "customer_phone" varchar(32);--> statement-breakpoint
ALTER TABLE "tour_booking_travelers" ADD CONSTRAINT "tour_booking_travelers_booking_id_tour_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."tour_bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_booking_travelers" ADD CONSTRAINT "tour_booking_travelers_traveler_id_travelers_id_fk" FOREIGN KEY ("traveler_id") REFERENCES "public"."travelers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tour_booking_travelers_booking_idx" ON "tour_booking_travelers" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "tour_booking_travelers_traveler_idx" ON "tour_booking_travelers" USING btree ("traveler_id");