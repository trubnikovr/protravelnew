ALTER TABLE "admins" ADD COLUMN "login" varchar(80);--> statement-breakpoint
UPDATE "admins"
SET "login" = CASE
  WHEN "role" = 'super_admin' THEN 'admin'
  ELSE 'admin_' || substring(replace("id"::text, '-', '') from 1 for 12)
END;--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "login" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "admins_login_unique" ON "admins" USING btree ("login");
