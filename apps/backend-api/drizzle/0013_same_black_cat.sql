UPDATE "users" SET "currency" = 'RUB' WHERE "currency" = 'UZS';--> statement-breakpoint
UPDATE "users" SET "locale" = 'ru' WHERE "locale" <> 'ru';--> statement-breakpoint
UPDATE "users" SET "time_zone" = 'Europe/Moscow' WHERE "time_zone" = 'Asia/Tashkent';--> statement-breakpoint
UPDATE "tours" SET "currency" = 'RUB' WHERE "currency" = 'UZS';--> statement-breakpoint
UPDATE "flight_orders" SET "currency" = 'RUB' WHERE "currency" = 'UZS';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "currency" SET DEFAULT 'RUB';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "time_zone" SET DEFAULT 'Europe/Moscow';
