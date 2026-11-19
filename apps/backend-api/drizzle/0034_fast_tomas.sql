CREATE TABLE "flight_booking_attempts" (
	"customer_id" uuid NOT NULL,
	"idempotency_key" varchar(128) NOT NULL,
	"request_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flight_booking_attempts" ADD CONSTRAINT "flight_booking_attempts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flight_booking_attempts_customer_key_unique" ON "flight_booking_attempts" USING btree ("customer_id","idempotency_key");