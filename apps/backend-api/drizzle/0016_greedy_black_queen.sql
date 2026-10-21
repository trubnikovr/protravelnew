ALTER TABLE "users" RENAME TO "customers";--> statement-breakpoint
ALTER TABLE "flight_orders" DROP CONSTRAINT "flight_orders_customer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tour_bookings" DROP CONSTRAINT "tour_bookings_customer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "travelers" DROP CONSTRAINT "travelers_customer_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "users_phone_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_status_idx";--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD COLUMN "customer_name" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD COLUMN "customer_email" varchar(255);--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD COLUMN "tour_title" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE "tour_bookings" AS booking
SET
	"customer_name" = trim(concat(customer."first_name", ' ', coalesce(customer."last_name", ''))),
	"customer_email" = customer."email",
	"tour_title" = content."title"
FROM "customers" AS customer, "tour_content" AS content
WHERE booking."customer_id" = customer."id"
	AND booking."tour_id" = content."tour_id";--> statement-breakpoint
ALTER TABLE "flight_orders" ADD CONSTRAINT "flight_orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_bookings" ADD CONSTRAINT "tour_bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travelers" ADD CONSTRAINT "travelers_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "customers_phone_unique" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_email_unique" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customers_status_idx" ON "customers" USING btree ("status");
