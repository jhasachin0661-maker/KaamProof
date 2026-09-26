ALTER TABLE "password_resets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "password_resets" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;