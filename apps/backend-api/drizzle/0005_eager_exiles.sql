CREATE TYPE "public"."tour_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "tour_translations" (
	"tour_id" uuid NOT NULL,
	"locale" varchar(2) NOT NULL,
	"title" varchar(180) NOT NULL,
	"short_description" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"inclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "tour_translations_tour_id_locale_pk" PRIMARY KEY("tour_id","locale")
);
--> statement-breakpoint
CREATE TABLE "tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"status" "tour_status" DEFAULT 'draft' NOT NULL,
	"departure_city_code" varchar(8) NOT NULL,
	"destination_country_code" varchar(2) NOT NULL,
	"duration_days" integer NOT NULL,
	"duration_nights" integer NOT NULL,
	"base_price_amount" numeric(18, 0) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"cover_image_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tour_translations" ADD CONSTRAINT "tour_translations_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tour_translations_locale_title_idx" ON "tour_translations" USING btree ("locale","title");--> statement-breakpoint
CREATE UNIQUE INDEX "tours_slug_unique" ON "tours" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tours_status_idx" ON "tours" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tours_featured_sort_idx" ON "tours" USING btree ("is_featured","sort_order");