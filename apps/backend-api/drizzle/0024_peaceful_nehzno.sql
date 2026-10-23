CREATE TABLE "featured_flight_locations" (
	"code" varchar(3) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_name" varchar(180) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "featured_flight_locations_order_idx" ON "featured_flight_locations" USING btree ("sort_order");
