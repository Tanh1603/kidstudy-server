ALTER TABLE "friend_requests" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_progress" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_email_unique" UNIQUE("email");--> statement-breakpoint
DROP TYPE "public"."status";