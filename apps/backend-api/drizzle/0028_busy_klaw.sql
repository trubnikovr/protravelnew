CREATE TABLE "flight_offers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"search_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "flight_offers_search_id_idx" ON "flight_offers" USING btree ("search_id");--> statement-breakpoint
CREATE INDEX "flight_offers_expires_at_idx" ON "flight_offers" USING btree ("expires_at");