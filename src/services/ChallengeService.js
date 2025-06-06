import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, asc, and, desc } from "drizzle-orm";
import { getUserProgressByUserId } from "./UserProgressService.js";
const MAX_HEARTS = 5;

// Challenges
const getAllChallenges = async () => {
  const challenges = await db.query.challenges.findMany({
    orderBy: [asc(schema.challenges.id)],
    with: {
      challengeOptions: true,
    },
  });
  return challenges ?? [];
};

const getChallengeById = async (id) => {
  const challenge = await db.query.challenges.findFirst({
    where: eq(schema.challenges.id, id),
    with: {
      challengeOptions: true,
    },
  });
  return challenge;
};

const createChallenge = async (challenge) => {
  const newChallenge = await db
    .insert(schema.challenges)
    .values(challenge)
    .returning();
  return newChallenge[0];
};

const updateChallenge = async (id, challenge) => {
  const updatedChallenge = await db
    .update(schema.challenges)
    .set(challenge)
    .where(eq(schema.challenges.id, id))
    .returning();
  return updatedChallenge[0];
};

const deleteChallenge = async (id) => {
  const deletedChallenge = await db
    .delete(schema.challenges)
    .where(eq(schema.challenges.id, id))
    .returning();
  return deletedChallenge[0];
};

// Challenge Options

const getChallengeOptionByChallengeId = async (challengeId) => {
  const options = await db.query.challengeOptions.findMany({
    orderBy: [asc(schema.challengeOptions.id)],
    where: eq(schema.challengeOptions.challengeId, challengeId),
  });
  return options ?? [];
};

const addChallengeOption = async (challengeOption) => {
  const newChallengeOption = await db
    .insert(schema.challengeOptions)
    .values(challengeOption)
    .returning();
  return newChallengeOption[0];
};

const updateChallengeOption = async (id, challengeOption) => {
  const updatedChallengeOption = await db
    .update(schema.challengeOptions)
    .set(challengeOption)
    .where(eq(schema.challengeOptions.id, id))
    .returning();
  return updatedChallengeOption[0];
};

const deleteChallengeOption = async (id) => {
  const deletedChallengeOption = await db
    .delete(schema.challengeOptions)
    .where(eq(schema.challengeOptions.id, id))
    .returning();
  return deletedChallengeOption[0];
};

// challenge progress
const updateChallengeProgress = async (userId, challengeId) => {
  // Check if progress entry exists
  const existingProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(schema.challengeProgress.userId, userId),
      eq(schema.challengeProgress.challengeId, challengeId)
    ),
  });

  if (existingProgress) {
    // Update existing progress
    const result = await db
      .update(schema.challengeProgress)
      .set({ completed: completed === "true" ? true : false })
      .where(
        and(
          eq(schema.challengeProgress.userId, userId),
          eq(schema.challengeProgress.challengeId, challengeId)
        )
      )
      .returning();

    return result[0];
  } else {
    // Create new progress entry
    const result = await db
      .insert(schema.challengeProgress)
      .values({
        userId,
        challengeId,
        completed: completed === "true" ? true : false,
      })
      .returning();

    return result[0];
  }
};

const upsertChallengeProgress = async (userId, challengeId) => {
  const currentUserProgress = await getUserProgressByUserId(userId);

  if (!currentUserProgress) throw new Error("User progress not found.");

  const challenge = await db.query.challenges.findFirst({
    where: eq(schema.challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(schema.challengeProgress.userId, userId),
      eq(schema.challengeProgress.challengeId, challengeId)
    ),
  });

  const isPractice = !!existingChallengeProgress;

  if (currentUserProgress.hearts === 0 && !isPractice)
    return { error: "hearts" };

  if (isPractice) {
    await db
      .update(schema.challengeProgress)
      .set({ completed: true })
      .where(eq(schema.challengeProgress.id, existingChallengeProgress.id));

    await db
      .update(schema.userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, MAX_HEARTS),
        points: currentUserProgress.points + 10,
      })
      .where(eq(schema.userProgress.userId, userId));

    return { success: true };
  }

  await db.insert(schema.challengeProgress).values({
    userId,
    challengeId,
    completed: true,
  });

  await db
    .update(schema.userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(schema.userProgress.userId, userId));

  return { success: true };
};

export {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  addChallengeOption,
  updateChallengeOption,
  deleteChallengeOption,
  updateChallengeProgress,
  upsertChallengeProgress,
  getChallengeOptionByChallengeId,
};
