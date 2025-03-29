import db from "../db/index.js";
import * as schema from "../db/schema.js";
// User Progress
const createUserProgress = async (userProgress) => {
  const newUserProgress = await db
    .insert(schema.userProgress)
    .values(userProgress)
    .returning();
  return newUserProgress;
};

const updateUserProgress = async (id, userProgress) => {
  const updatedUserProgress = await db
    .update(schema.userProgress)
    .set(userProgress)
    .where(eq(schema.userProgress.userId, id))
    .returning();
  return updatedUserProgress;
};

export { createUserProgress, updateUserProgress };
