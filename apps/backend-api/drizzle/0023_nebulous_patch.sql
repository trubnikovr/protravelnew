CREATE TYPE "public"."payment_payable_type" AS ENUM('tour_booking', 'flight_order');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('creating', 'pending', 'processing', 'succeeded', 'failed', 'expired', 'refund_pending', 'partially_refunded', 'refunded');--> statement-breakpoint
ALTER TYPE "public"."flight_order_status" ADD VALUE 'payment_pending' BEFORE 'failed';--> statement-breakpoint
ALTER TYPE "public"."flight_order_status" ADD VALUE 'paid' BEFORE 'failed';--> statement-breakpoint
ALTER TYPE "public"."tour_booking_status" ADD VALUE 'awaiting_payment' BEFORE 'paid';--> statement-breakpoint
CREATE TABLE "payment_webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(32) NOT NULL,
	"event_key" varchar(255) NOT NULL,
	"payload" jsonb NOT NULL,
	"processed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"customer_id" uuid NOT NULL,
	"payable_type" "payment_payable_type" NOT NULL,
	"payable_id" uuid NOT NULL,
	"idempotency_key" varchar(128) NOT NULL,
	"status" "payment_status" NOT NULL,
	"total_amount" numeric(20, 0) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"provider" varchar(32) NOT NULL,
	"provider_order_id" varchar(40) NOT NULL,
	"provider_payment_id" varchar(128),
	"payment_method" varchar(32),
	"payment_url" varchar(2048),
	"expires_at" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone,
	"failure_code" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "payment_webhooks_provider_event_unique" ON "payment_webhooks" USING btree ("provider","event_key");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_customer_idempotency_unique" ON "payments" USING btree ("customer_id","idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_provider_order_unique" ON "payments" USING btree ("provider","provider_order_id");--> statement-breakpoint
CREATE INDEX "payments_payable_idx" ON "payments" USING btree ("payable_type","payable_id");--> statement-breakpoint
CREATE INDEX "payments_customer_created_idx" ON "payments" USING btree ("customer_id","created_at");