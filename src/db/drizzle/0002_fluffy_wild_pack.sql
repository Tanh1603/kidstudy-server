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
	"tartget_points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_progress" ADD COLUMN "tickets" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_user" ADD CONSTRAINT "quest_user_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;