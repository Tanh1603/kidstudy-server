import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
const MAX_HEARTS = 5;
const POINTS_TO_REFILL = 10;
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

const refillHearts = async (userId) => {
  const userProgress = await db.query.userProgress.findFirst({
    where: eq(schema.userProgress.userId, userId),
  });

  if (!userProgress) throw new Error("User progress not found.");
  if (userProgress.hearts === MAX_HEARTS)
    throw new Error("Hearts are already full.");
  if (userProgress.points < POINTS_TO_REFILL)
    throw new Error("Not enough points.");

  await db
    .update(schema.userProgress)
    .set({
      hearts: MAX_HEARTS,
      points: userProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(schema.userProgress.userId, userId));

  return {
    success: true,
    message: "Hearts refilled successfully.",
  };
};

const reduceHearts = async (challengeId, userId) => {
  const currentUserProgress = await getUserProgressByUserId(userId);
  if (!currentUserProgress) throw new Error("User progress not found.");

  const challenge = await db.query.challenges.findFirst({
    where: eq(schema.challenges.id, challengeId),
  });
  if (!challenge) throw new Error("Challenge not found.");

  const lessonId = challenge.lessonId;
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(schema.challengeProgress.userId, userId),
      eq(schema.challengeProgress.challengeId, challengeId)
    ),
  });
  const isPractice = !!existingChallengeProgress;
  if (isPractice) return { error: "practice" };

  if (currentUserProgress.hearts === 0 && !isPractice)
    return { error: "hearts" };
  // if (userSubscription?.isActive) return { error: "subscription" };
  await db
    .update(schema.userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(schema.userProgress.userId, userId));

  return {
    success: true,
    message: "Hearts reduced successfully.",
  };
};

const updatePoints = async (userId, points) => {
  const userProgress = await db.query.userProgress.findFirst({
    where: eq(schema.userProgress.userId, userId),
  });

  if (!userProgress) throw new Error("User progress not found.");
  const currentPoints = Number(userProgress.points) || 0;
  const addedPoints = Number(points) || 0;

  const updatedUserProgress = await db
    .update(schema.userProgress)
    .set({
      points: currentPoints + addedPoints,
    })
    .where(eq(schema.userProgress.userId, userId))
    .returning();

  return updatedUserProgress;
}

export {
  upsertUserProgress,
  getAllUserProgress,
  getUserProgressByUserId,
  getLeaderboard,
  reduceHearts,
  refillHearts,
  updatePoints
};
