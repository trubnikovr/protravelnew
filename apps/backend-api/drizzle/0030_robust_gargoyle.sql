ALTER TABLE "featured_flight_locations" ADD COLUMN "city_id" uuid;--> statement-breakpoint
UPDATE "featured_flight_locations" AS featured SET "city_id" = airport."city_id" FROM "airports" AS airport WHERE featured."code" = airport."iata_code" AND airport."city_id" IS NOT NULL;--> statement-breakpoint
UPDATE "featured_flight_locations" AS featured SET "city_id" = city."id" FROM "cities" AS city INNER JOIN "countries" AS country ON country."id" = city."country_id" WHERE featured."city_id" IS NULL AND lower(city."name_ru") = lower(featured."name") AND lower(country."name_ru") = lower(featured."country_name");--> statement-breakpoint
DELETE FROM "featured_flight_locations" WHERE "city_id" IS NULL;--> statement-breakpoint
DELETE FROM "featured_flight_locations" AS duplicate USING "featured_flight_locations" AS kept WHERE duplicate."city_id" = kept."city_id" AND (duplicate."sort_order", duplicate."code") > (kept."sort_order", kept."code");--> statement-breakpoint
ALTER TABLE "featured_flight_locations" DROP CONSTRAINT "featured_flight_locations_pkey";--> statement-breakpoint
ALTER TABLE "featured_flight_locations" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "featured_flight_locations" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "featured_flight_locations" DROP COLUMN "country_name";--> statement-breakpoint
ALTER TABLE "featured_flight_locations" ALTER COLUMN "city_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_flight_locations" ADD CONSTRAINT "featured_flight_locations_city_id_pk" PRIMARY KEY("city_id");--> statement-breakpoint
ALTER TABLE "featured_flight_locations" ADD CONSTRAINT "featured_flight_locations_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
