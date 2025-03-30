import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
// User Progress

const getAllUserProgress = async () => {
  const userProgress = await db.query.userProgress.findMany();
  return userProgress;
};

const getUserProgressByUserId = async (userId) => {
  const userProgress = await db.query.userProgress.findFirst({
    where: eq(schema.userProgress.userId, userId),
  });
  return userProgress;
};

const upsertUserProgress = async (userProgress) => {
  const { userId, ...updateFields } = userProgress;

  const newUserProgress = await db
    .insert(schema.userProgress)
    .values(userProgress)
    .onConflictDoUpdate({
      target: schema.userProgress.userId, // Khóa cần kiểm tra
      set: updateFields, // Chỉ cập nhật những field còn lại
    })
    .returning();

  return newUserProgress;
};

const getLeaderboard = async (size) => {
  const leaderboard = await db.query.userProgress.findMany({
    orderBy: [desc(schema.userProgress.points)],
    limit: size,
  });
  return leaderboard;
};

export {
  upsertUserProgress,
  getAllUserProgress,
  getUserProgressByUserId,
  getLeaderboard,
};
