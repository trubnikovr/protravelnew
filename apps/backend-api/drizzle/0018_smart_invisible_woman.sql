CREATE TABLE "news_readers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_reads" (
	"reader_id" uuid NOT NULL,
	"news_id" uuid NOT NULL,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_reads_reader_id_news_id_pk" PRIMARY KEY("reader_id","news_id")
);
--> statement-breakpoint
ALTER TABLE "news_reads" ADD CONSTRAINT "news_reads_reader_id_news_readers_id_fk" FOREIGN KEY ("reader_id") REFERENCES "public"."news_readers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_reads" ADD CONSTRAINT "news_reads_news_id_news_articles_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news_articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_reads_reader_idx" ON "news_reads" USING btree ("reader_id","read_at");