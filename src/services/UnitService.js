import db from "../db/index.js";
import { eq, asc } from "drizzle-orm";
import * as schema from "../db/schema.js";
import { isLessonCompleted } from "./LessonService.js";

const getAllUnits = async () => {
  const units = await db.query.units.findMany({
    orderBy: [asc(schema.units.order)],
    with: {
      lessons: {
        orderBy: [asc(schema.lessons.order)],
      },
    },
  });
  return units;
};

const getUnitById = async (id) => {
  const unit = await db.query.units.findFirst({
    where: eq(schema.units.id, id),
    with: {
      lessons: {
        orderBy: [asc(schema.lessons.order)],
      },
    },
  });
  return unit;
};

const createUnit = async (unit) => {
  const newUnit = await db.insert(schema.units).values(unit).returning();
  return newUnit;
};

const updateUnit = async (id, unit) => {
  const updatedUnit = await db
    .update(schema.units)
    .set(unit)
    .where(eq(schema.units.id, id))
    .returning();
  return updatedUnit;
};

const deleteUnit = async (id) => {
  const deletedUnit = await db
    .delete(schema.units)
    .where(eq(schema.units.id, id))
    .returning();
  return deletedUnit;
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

export { getAllUnits, getUnitById, createUnit, updateUnit, deleteUnit, isUnitCompleted };
