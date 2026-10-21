CREATE TYPE "public"."flight_order_status" AS ENUM('draft', 'booking', 'booked', 'failed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TABLE "flight_orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"customer_id" uuid NOT NULL,
	"offer_id" uuid NOT NULL,
	"idempotency_key" varchar(128) NOT NULL,
	"status" "flight_order_status" NOT NULL,
	"provider" varchar(32) NOT NULL,
	"contact" jsonb NOT NULL,
	"travelers" jsonb NOT NULL,
	"offer_snapshot" jsonb NOT NULL,
	"total_amount" numeric(20, 0) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"provider_booking_token" text,
	"record_locator" varchar(64),
	"booking_expires_at" timestamp with time zone,
	"provider_status" varchar(64),
	"failure_code" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flight_orders" ADD CONSTRAINT "flight_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flight_orders_customer_idempotency_unique" ON "flight_orders" USING btree ("customer_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "flight_orders_customer_created_idx" ON "flight_orders" USING btree ("customer_id","created_at");--> statement-breakpoint
CREATE INDEX "flight_orders_status_idx" ON "flight_orders" USING btree ("status");