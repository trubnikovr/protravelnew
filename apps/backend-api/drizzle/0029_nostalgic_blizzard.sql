CREATE TABLE "flight_shares" (
	"token_hash" varchar(64) PRIMARY KEY NOT NULL,
	"snapshot" jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "flight_shares_expires_at_idx" ON "flight_shares" USING btree ("expires_at");