CREATE TABLE "news_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(180) NOT NULL,
	"summary" text NOT NULL,
	"category" varchar(24) DEFAULT 'general' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "news_articles_published_idx" ON "news_articles" USING btree ("published_at");
--> statement-breakpoint
INSERT INTO "news_articles" ("id", "title", "summary", "category", "published_at")
VALUES
	('8eb27499-9988-4d8c-9f10-83e82e895287', 'Дешёвые авиабилеты', 'Цены на рейс Ташкент — Фукуок снизились. Самое время проверить новые варианты.', 'promotion', now()),
	('f14d22f7-ce38-41bd-a728-cac10fbd801d', 'Безопасность', 'Ваши данные защищены. Мы обновили настройки безопасности профиля.', 'security', now() - interval '1 day');
