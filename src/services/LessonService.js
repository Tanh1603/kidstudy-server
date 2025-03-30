import db from "../db/index.js";
import { eq, asc, and, inArray } from "drizzle-orm";
import * as schema from "../db/schema.js";

const getAllLessons = async () => {
  const lessons = await db.query.lessons.findMany({
    orderBy: [asc(schema.lessons.order)],
    with: {
      challenges: {
        orderBy: [asc(schema.challenges.order)],
      },
    },
  });
  return lessons;
};

const getLessonById = async (id) => {
  const lesson = await db.query.lessons.findFirst({
    where: eq(schema.lessons.id, id),
    with: {
      challenges: {
        orderBy: [asc(schema.challenges.order)],
      },
    },
  });
  return lesson;
};

const createLesson = async (lesson) => {
  const newLesson = await db.insert(schema.lessons).values(lesson).returning();
  return newLesson;
};

const updateLesson = async (id, lesson) => {
  const updatedLesson = await db
    .update(schema.lessons)
    .set(lesson)
    .where(eq(schema.lessons.id, id))
    .returning();
  return updatedLesson;
};

const deleteLesson = async (id) => {
  const deletedLesson = await db
    .delete(schema.lessons)
    .where(eq(schema.lessons.id, id))
    .returning();
  return deletedLesson;
};

const isLessonCompleted = async (userId, lessonId) => {
  // get all challenges for the lesson
  const challenges = await db.query.challenges.findMany({
    where: eq(schema.challenges.lessonId, lessonId),
  });
  // get all challenge progress for the user
  const challengeIds = challenges.map((challenge) => challenge.id);
  const completedChallenges = await db.query.challengeProgress.findMany({
    where: and(
      eq(schema.challengeProgress.userId, userId),
      inArray(schema.challengeProgress.challengeId, challengeIds),
      eq(schema.challengeProgress.completed, true)
    ),
  });
  return completedChallenges.length === challenges.length;
};

// user
const getFirstIncompleteLesson = async (userId) => {
  // Lấy lessons với điều kiện where ngay từ đầu để hiệu quả hơn
  const lessons = await db.query.lessons.findMany({
    orderBy: [asc(schema.lessons.order)],
    with: {
      unit: true,
      challenges: {
        orderBy: [asc(schema.challenges.order)],
        with: {
          challengeProgress: {
            where: eq(schema.challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  // Kiểm tra challenge chưa hoàn thành với logic rõ ràng hơn
  const firstIncompleteLesson = lessons.find((lesson) => {
    // Đảm bảo lesson có challenges
    if (!lesson.challenges || lesson.challenges.length === 0) {
      return {
        activeLesson: null,
        activeLessonId: null,
      };
    }

    // Log thông tin để debug
    console.log(
      `Checking lesson ${lesson.id} with ${lesson.challenges.length} challenges`
    );

    return lesson.challenges.some((challenge) => {
      // Kiểm tra chi tiết từng challenge
      const hasNoProgress =
        !challenge.challengeProgress ||
        challenge.challengeProgress.length === 0;
      const hasIncompleteProgress =
        challenge.challengeProgress &&
        challenge.challengeProgress.some((p) => p && p.completed === false);

      return hasNoProgress || hasIncompleteProgress;
    });
  });

  return {
    activeLesson: firstIncompleteLesson || null,
    activeLessonId: firstIncompleteLesson?.id || null,
  };
};

const getLessonByUserId = async (lessonId, userId) => {
  const data = await db.query.lessons.findFirst({
    where: eq(schema.lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: [asc(schema.challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(schema.challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
};

const getLessonPercentage = async (lessonId, userId) => {
  const lesson = await getLessonByUserId(lessonId, userId);
  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );
  return completedChallenges.length / lesson.challenges.length;
};

export {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  isLessonCompleted,
  getFirstIncompleteLesson,
  getLessonByUserId,
  getLessonPercentage,
};
