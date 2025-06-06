ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_email_unique";--> statement-breakpoint
ALTER TABLE "user_progress" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "friend_requests" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_email_unique" UNIQUE("email");