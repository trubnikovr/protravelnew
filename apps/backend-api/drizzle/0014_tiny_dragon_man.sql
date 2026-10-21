CREATE TYPE "public"."tour_meal_type" AS ENUM('room_only', 'breakfast', 'half_board', 'full_board', 'all_inclusive');--> statement-breakpoint
CREATE TYPE "public"."tour_type" AS ENUM('package', 'excursion');--> statement-breakpoint
CREATE TABLE "tour_content" (
	"tour_id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"short_description" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"inclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_departures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"departure_date" date NOT NULL,
	"return_date" date,
	"departure_city_id" uuid NOT NULL,
	"departure_airport_id" uuid,
	"arrival_airport_id" uuid,
	"price_amount" numeric(18, 0) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"seats_total" integer,
	"seats_available" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"country_id" uuid NOT NULL,
	"city_id" uuid,
	"arrival_airport_id" uuid,
	"nights" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_excursion_details" (
	"tour_id" uuid PRIMARY KEY NOT NULL,
	"guide_language" varchar(80) DEFAULT 'Русский' NOT NULL,
	"group_size_max" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_package_details" (
	"tour_id" uuid PRIMARY KEY NOT NULL,
	"hotel_name" varchar(255) NOT NULL,
	"hotel_category" integer,
	"meal_type" "tour_meal_type" NOT NULL,
	"transfer_included" boolean DEFAULT false NOT NULL,
	"insurance_included" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_program_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "type" "tour_type" DEFAULT 'package' NOT NULL;--> statement-breakpoint
INSERT INTO "countries" ("id", "iso_code", "name_ru")
SELECT gen_random_uuid(), "source"."code", "source"."code"
FROM (
	SELECT DISTINCT upper("destination_country_code") AS "code" FROM "tours"
) AS "source"
WHERE NOT EXISTS (
	SELECT 1 FROM "countries"
	WHERE upper("countries"."iso_code") = "source"."code"
);--> statement-breakpoint
INSERT INTO "tour_content" (
	"tour_id", "title", "short_description", "description", "inclusions",
	"exclusions", "created_at", "updated_at"
)
SELECT DISTINCT ON ("tour_id")
	"tour_id", "title", "short_description", "description", "inclusions",
	"exclusions", "created_at", "updated_at"
FROM "tour_translations"
ORDER BY "tour_id", CASE WHEN "locale" = 'ru' THEN 0 ELSE 1 END;--> statement-breakpoint
INSERT INTO "tour_content" (
	"tour_id", "title", "short_description", "description"
)
SELECT "id", "slug", "slug", "slug"
FROM "tours"
WHERE NOT EXISTS (
	SELECT 1 FROM "tour_content" WHERE "tour_content"."tour_id" = "tours"."id"
);--> statement-breakpoint
INSERT INTO "tour_destinations" ("tour_id", "position", "country_id")
SELECT "tours"."id", 1, "countries"."id"
FROM "tours"
INNER JOIN "countries"
	ON upper("countries"."iso_code") = upper("tours"."destination_country_code");--> statement-breakpoint
INSERT INTO "tour_package_details" ("tour_id", "hotel_name", "meal_type")
SELECT "tours"."id", "tour_content"."title", 'room_only'
FROM "tours"
INNER JOIN "tour_content" ON "tour_content"."tour_id" = "tours"."id";--> statement-breakpoint
ALTER TABLE "tour_departure_dates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tour_translations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tour_departure_dates" CASCADE;--> statement-breakpoint
DROP TABLE "tour_translations" CASCADE;--> statement-breakpoint
ALTER TABLE "tours" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tour_content" ADD CONSTRAINT "tour_content_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_departures" ADD CONSTRAINT "tour_departures_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_departures" ADD CONSTRAINT "tour_departures_departure_city_id_cities_id_fk" FOREIGN KEY ("departure_city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_departures" ADD CONSTRAINT "tour_departures_departure_airport_id_airports_id_fk" FOREIGN KEY ("departure_airport_id") REFERENCES "public"."airports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_departures" ADD CONSTRAINT "tour_departures_arrival_airport_id_airports_id_fk" FOREIGN KEY ("arrival_airport_id") REFERENCES "public"."airports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_arrival_airport_id_airports_id_fk" FOREIGN KEY ("arrival_airport_id") REFERENCES "public"."airports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_excursion_details" ADD CONSTRAINT "tour_excursion_details_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_package_details" ADD CONSTRAINT "tour_package_details_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_program_days" ADD CONSTRAINT "tour_program_days_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tour_departures_variant_unique" ON "tour_departures" USING btree ("tour_id","departure_date","departure_city_id","departure_airport_id");--> statement-breakpoint
CREATE INDEX "tour_departures_date_idx" ON "tour_departures" USING btree ("departure_date");--> statement-breakpoint
CREATE INDEX "tour_departures_city_idx" ON "tour_departures" USING btree ("departure_city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tour_destinations_tour_position_unique" ON "tour_destinations" USING btree ("tour_id","position");--> statement-breakpoint
CREATE INDEX "tour_destinations_country_idx" ON "tour_destinations" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "tour_destinations_city_idx" ON "tour_destinations" USING btree ("city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tour_program_days_tour_day_unique" ON "tour_program_days" USING btree ("tour_id","day_number");--> statement-breakpoint
CREATE INDEX "tours_type_idx" ON "tours" USING btree ("type");--> statement-breakpoint
ALTER TABLE "tours" DROP COLUMN "departure_city_code";--> statement-breakpoint
ALTER TABLE "tours" DROP COLUMN "destination_country_code";
