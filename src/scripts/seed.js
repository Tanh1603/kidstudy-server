import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";

dotenv.config({ path: ".env.development" });
const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Xóa dữ liệu cũ
    // await Promise.all([
    //   db.delete(schema.userProgress),
    //   db.delete(schema.challenges),
    //   db.delete(schema.units),
    //   db.delete(schema.lessons),
    //   db.delete(schema.challengeOptions),
    //   db.delete(schema.userSubscription),
    // ]);
    // await db.execute(`TRUNCATE TABLE "user_progress" RESTART IDENTITY CASCADE`);
    await db.execute(`TRUNCATE TABLE "challenges" RESTART IDENTITY CASCADE`);
    await db.execute(`TRUNCATE TABLE "units" RESTART IDENTITY CASCADE`);
    await db.execute(`TRUNCATE TABLE "lessons" RESTART IDENTITY CASCADE`);
    await db.execute(
      `TRUNCATE TABLE "challenge_options" RESTART IDENTITY CASCADE`
    );
    await db.execute(
      `TRUNCATE TABLE "user_subscription" RESTART IDENTITY CASCADE`
    );
    await db.execute(
      `TRUNCATE TABLE "challenge_progress" RESTART IDENTITY CASCADE`
    );

    // Thêm dữ liệu Unit
    const units = await db
      .insert(schema.units)
      .values([
        { title: "Unit 1", description: "Learn the basics", order: 1 },
        {
          title: "Unit 2",
          description: "Learn intermediate concepts",
          order: 2,
        },
      ])
      .returning();

    for (const unit of units) {
      // Thêm dữ liệu Lesson
      const lessons = await db
        .insert(schema.lessons)
        .values([
          { unitId: unit.id, title: "Nouns", order: 1 },
          { unitId: unit.id, title: "Verbs", order: 2 },
          { unitId: unit.id, title: "Adjectives", order: 3 },
        ])
        .returning();

      for (const lesson of lessons) {
        // Thêm dữ liệu Challenge
        const challenges = await db
          .insert(schema.challenges)
          .values([
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: "Which one is 'the man'?",
              order: 1,
            },
            {
              lessonId: lesson.id,
              type: "SELECT",
              question: "Which one is 'the woman'?",
              order: 2,
            },
          ])
          .returning();

        for (const challenge of challenges) {
          // Thêm dữ liệu Challenge Options
          if (challenge.order === 1) {
            await db.insert(schema.challengeOptions).values([
              {
                challengeId: challenge.id,
                correct: true,
                text: "el hombre",
                imageSrc: "/man.svg",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "la mujer",
                imageSrc: "/woman.svg",
              },
            ]);
          } else if (challenge.order === 2) {
            await db.insert(schema.challengeOptions).values([
              {
                challengeId: challenge.id,
                correct: true,
                text: "la mujer",
                imageSrc: "/woman.svg",
              },
              {
                challengeId: challenge.id,
                correct: false,
                text: "el hombre",
                imageSrc: "/man.svg",
              },
            ]);
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
