import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Units
const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Unit 1
  description: text("description").notNull(), // Learn the basics of spanish
  order: integer("order").notNull(),
});

const unitsRelations = relations(units, ({ many }) => ({
  lessons: many(lessons),
}));

// Lessons
const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

// Challenges
const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
  order: integer("order").notNull(),
});

const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

// Challenge Options
const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

// Challenge Progress
const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

// User Progress
const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userEmail: text("user_email").notNull().unique(),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(100),
  tickets: integer("tickets").notNull().default(0),
});

const userProgressRelations = relations(userProgress, () => ({}));

// Mini games
const gameTypeEnum = pgEnum("game_type", [
  "ANAGRAM",
  "MATCH_UP",
  "MEMORY",
  "SPELLING_BEE",
]);
const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);
const memoryTypeEnum = pgEnum("memory_type", [
  "WORD_IMAGE",
  "WORD_AUDIO",
  "IMAGE_AUDIO",
  "WORD_WORD",
]);

const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon"),
});

const topicsRelations = relations(topics, ({ many }) => ({
  gameQuestions: many(gameQuestions),
}));

const gameQuestions = pgTable("game_questions", {
  id: serial("id").primaryKey(),
  gameType: gameTypeEnum("game_type").notNull(),
  topicId: integer("topic_id")
    .references(() => topics.id, { onDelete: "cascade" })
    .notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  memoryType: memoryTypeEnum("memory_type"),

  word: text("word"), // dùng trong ANAGRAM, MATCH_UP, MEMORY
  imageSrc: text("image_src"), // dùng cho MATCH_UP, MEMORY
  audioSrc: text("audio_src"), // MEMORY
  matchText: text("match_text"), // MATCH_UP hoặc MEMORY
});

const gameQuestionsRelations = relations(gameQuestions, ({ one }) => ({
  topic: one(topics, {
    fields: [gameQuestions.topicId],
    references: [topics.id],
  }),
}));

// quest
const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  reward: integer("reward").notNull(),
  targetPoints: integer("target_points").notNull().default(0)
});

const questRelations = relations(quests, ({ many }) => ({
  questUser: many(questUser),
}));

const questUser = pgTable("quest_user", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  questId: integer("quest_id")
    .references(() => quests.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  dailyPoints: integer("daily_point").default(0),
  completed: boolean("completed").default(false),
});

const questUserRelation = relations(questUser, ({ one }) => ({
  quest: one(quests, {
    fields: [questUser.questId],
    references: [quests.id],
  }),
}));

//Friend
const friendRequests = pgTable("friend_requests", {
  id: serial("id").primaryKey(),
  senderEmail: text("sender_email").notNull(),
  receiverEmail: text("receiver_email").notNull(),
  status: text("status").notNull(), // 🔹 Đổi từ ENUM sang TEXT
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export {
  units,
  unitsRelations,
  lessons,
  lessonsRelations,
  challenges,
  challengesEnum,
  challengesRelations,
  challengeOptions,
  challengeOptionsRelations,
  challengeProgress,
  challengeProgressRelations,
  userProgress,
  userProgressRelations,
  topics,
  topicsRelations,
  gameQuestions,
  gameQuestionsRelations,
  gameTypeEnum,
  difficultyEnum,
  memoryTypeEnum,
  quests,
  questUser,
  questRelations,
  questUserRelation,
  friendRequests,
};
