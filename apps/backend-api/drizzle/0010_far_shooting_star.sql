CREATE TABLE "airports" (
	"id" uuid PRIMARY KEY NOT NULL,
	"iata_code" varchar(3) NOT NULL,
	"country_id" uuid NOT NULL,
	"city_id" uuid,
	"name_ru" varchar(255),
	"name_en" varchar(255),
	"latitude" numeric(11, 7) NOT NULL,
	"longitude" numeric(11, 7) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"legacy_id" bigint,
	"legacy_region_id" bigint,
	"country_id" uuid NOT NULL,
	"name_ru" varchar(180) NOT NULL,
	"name_uz" varchar(180),
	"name_en" varchar(180),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"legacy_id" bigint,
	"iso_code" varchar(2),
	"name_ru" varchar(180) NOT NULL,
	"name_uz" varchar(180),
	"name_en" varchar(180),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "airports" ADD CONSTRAINT "airports_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "airports" ADD CONSTRAINT "airports_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "airports_iata_code_unique" ON "airports" USING btree ("iata_code");--> statement-breakpoint
CREATE INDEX "airports_country_idx" ON "airports" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "airports_city_idx" ON "airports" USING btree ("city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cities_legacy_id_unique" ON "cities" USING btree ("legacy_id");--> statement-breakpoint
CREATE INDEX "cities_country_name_ru_idx" ON "cities" USING btree ("country_id","name_ru");--> statement-breakpoint
CREATE UNIQUE INDEX "countries_legacy_id_unique" ON "countries" USING btree ("legacy_id");--> statement-breakpoint
CREATE UNIQUE INDEX "countries_iso_code_unique" ON "countries" USING btree ("iso_code");--> statement-breakpoint
CREATE INDEX "countries_name_ru_idx" ON "countries" USING btree ("name_ru");