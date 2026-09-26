CREATE TABLE "otp_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text NOT NULL,
	"otp_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_otp_phone" ON "otp_requests" USING btree ("phone_number");
--> statement-breakpoint
DROP TABLE IF EXISTS "password_resets" CASCADE;
--> statement-breakpoint
-- Assign a dummy phone number to existing users who don't have one to satisfy NOT NULL UNIQUE constraint
UPDATE "users" SET "phone" = '+0000000000_' || "id" WHERE "phone" IS NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;