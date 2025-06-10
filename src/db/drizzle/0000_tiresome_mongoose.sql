CREATE TYPE "public"."type" AS ENUM('SELECT', 'ASSIST');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."game_type" AS ENUM('ANAGRAM', 'MATCH_UP', 'MEMORY', 'SPELLING_BEE');--> statement-breakpoint
CREATE TYPE "public"."memory_type" AS ENUM('WORD_IMAGE', 'WORD_AUDIO', 'IMAGE_AUDIO', 'WORD_WORD');--> statement-breakpoint
CREATE TABLE "challenge_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"text" text NOT NULL,
	"correct" boolean NOT NULL,
	"image_src" text,
	"audio_src" text
);
--> statement-breakpoint
CREATE TABLE "challenge_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"type" "type" NOT NULL,
	"question" text NOT NULL,
	"image_src" text,
	"audio_src" text,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friend_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_email" text NOT NULL,
	"receiver_email" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_type" "game_type" NOT NULL,
	"topic_id" integer NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"memory_type" "memory_type",
	"word" text,
	"image_src" text,
	"audio_src" text,
	"match_text" text
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"unit_id" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"quest_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"daily_point" integer DEFAULT 0,
	"completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"reward" integer NOT NULL,
	"target_points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"icon" text
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" text PRIMARY KEY NOT NULL,
	"user_name" text DEFAULT 'User' NOT NULL,
	"user_email" text NOT NULL,
	"user_image_src" text DEFAULT '/mascot.svg' NOT NULL,
	"hearts" integer DEFAULT 5 NOT NULL,
	"points" integer DEFAULT 100 NOT NULL,
	"tickets" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_progress_user_email_unique" UNIQUE("user_email")
);
--> statement-breakpoint
ALTER TABLE "challenge_options" ADD CONSTRAINT "challenge_options_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_progress" ADD CONSTRAINT "challenge_progress_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_questions" ADD CONSTRAINT "game_questions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_user" ADD CONSTRAINT "quest_user_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;