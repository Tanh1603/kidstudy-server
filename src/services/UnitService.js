import db from "../db/index.js";
import { eq, asc } from "drizzle-orm";
import * as schema from "../db/schema.js";
import { isLessonCompleted } from "./LessonService.js";

// admin
const getAllUnits = async () => {
  const units = await db.query.units.findMany({
    orderBy: [asc(schema.units.id)],
  });
  return units;
};

const getUnitById = async (id) => {
  const unit = await db.query.units.findFirst({
    where: eq(schema.units.id, id),
  });
  return unit;
};

const createUnit = async (unit) => {
  const newUnit = await db.insert(schema.units).values(unit).returning();
  return newUnit[0];
};

const updateUnit = async (id, unit) => {
  const updatedUnit = await db
    .update(schema.units)
    .set(unit)
    .where(eq(schema.units.id, id))
    .returning();
  return updatedUnit[0];
};

const deleteUnit = async (id) => {
  const deletedUnit = await db
    .delete(schema.units)
    .where(eq(schema.units.id, id))
    .returning();
  return deletedUnit[0];
};

// user
const getAllUnitsForUser = async (userId) => {
  if (!userId) return [];

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(schema.challengeProgress.userId, userId),
                columns: { completed: true }, // Chỉ lấy cột cần thiết để tối ưu DB query
              },
            },
          },
        },
      },
    },
  });

  return data.map((unit) => {
    // Tính toán completed cho từng lesson
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => ({
      ...lesson,
      completed: lesson.challenges.every((challenge) =>
        challenge.challengeProgress?.some((progress) => progress.completed)
      ),
    }));

    // Một unit hoàn thành nếu tất cả lessons của nó hoàn thành
    const unitCompleted = lessonsWithCompletedStatus.every(
      (lesson) => lesson.completed
    );

    return {
      ...unit,
      lessons: lessonsWithCompletedStatus,
      completed: unitCompleted, // ✅ Thêm trường `completed` cho unit
    };
  });
};


const isUnitCompleted = async (userId, unitId) => {
  // get all lessons for the unit
  const lessons = await db.query.lessons.findMany({
    where: eq(schema.lessons.unitId, unitId),
  });
  // get all lesson progress for the user
  const lessonIds = lessons.map((lesson) => lesson.id);
  for (const lessonId of lessonIds) {
    const isCompleted = await isLessonCompleted(userId, lessonId);
    if (!isCompleted) {
      return false;
    }
  }
  return true;
};

export {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
  getAllUnitsForUser,
  isUnitCompleted,
};
