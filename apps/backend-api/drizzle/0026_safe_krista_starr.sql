CREATE TABLE "travel_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"country_code" varchar(2),
	"destination_code" varchar(3),
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "travel_facts_country_published_idx" ON "travel_facts" USING btree ("country_code","is_published");--> statement-breakpoint
CREATE INDEX "travel_facts_destination_published_idx" ON "travel_facts" USING btree ("destination_code","is_published");