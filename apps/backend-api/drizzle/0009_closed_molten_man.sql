CREATE TABLE "tour_departure_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"departure_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "active_from" date;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "active_to" date;--> statement-breakpoint
ALTER TABLE "tour_departure_dates" ADD CONSTRAINT "tour_departure_dates_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tour_departure_dates_tour_date_unique" ON "tour_departure_dates" USING btree ("tour_id","departure_date");--> statement-breakpoint
CREATE INDEX "tour_departure_dates_date_idx" ON "tour_departure_dates" USING btree ("departure_date");