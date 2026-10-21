ALTER TABLE "news_articles" ADD COLUMN "content" text;
--> statement-breakpoint
UPDATE "news_articles" SET "content" = "summary";
--> statement-breakpoint
ALTER TABLE "news_articles" ALTER COLUMN "content" SET NOT NULL;
