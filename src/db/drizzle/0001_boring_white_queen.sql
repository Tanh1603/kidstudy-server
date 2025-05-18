CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"group_id" integer,
	"receiver_id" text,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friend_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"status" "status" NOT NULL
);
