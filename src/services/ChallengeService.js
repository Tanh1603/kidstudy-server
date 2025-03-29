import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, asc, and, desc } from "drizzle-orm";

// Challenges
const getAllChallenges = async () => {
  const challenges = await db.query.challenges.findMany({
    orderBy: [asc(schema.challenges.order)],
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
  await db.transaction(async (tx) => {
    try {
      
      // Add new challenge to database
      const newChallenge = await tx
        .insert(schema.challenges)
        .values({
          ...challenge,
        })
        .returning();

      // get challenge id from new challenge
      const challengeId = newChallenge[0].id;

      // copy challenge options
      const challengeOptions = challenge.challengeOptions.map((option) => ({
        ...option,
        challengeId,
      }));

      // Add new challenge options to database
      const newOptions = await tx
      .insert(schema.challengeOptions)
      .values(challengeOptions)
      .returning();

      return { ...newChallenge[0], newOptions };
    } catch (error) {
      throw error;
    }
  });
};

const updateChallenge = async (id, challenge) => {
  const updatedChallenge = await db
    .update(schema.challenges)
    .set(challenge)
    .where(eq(schema.challenges.id, id))
    .returning();
  return updatedChallenge;
};

const deleteChallenge = async (id) => {
  const deletedChallenge = await db
    .delete(schema.challenges)
    .where(eq(schema.challenges.id, id))
    .returning();
  return deletedChallenge;
};

// Challenge Options
const addChallengeOption = async (challengeId, challengeOption) => {
  const newChallengeOption = await db
    .insert(schema.challengeOptions)
    .values({
      challengeId,
      ...challengeOption,
    })
    .returning();
  return newChallengeOption;
};

const updateChallengeOption = async (id, challengeOption) => {
  const updatedChallengeOption = await db
    .update(schema.challengeOptions)
    .set(challengeOption)
    .where(eq(schema.challengeOptions.id, id))
    .returning();
  return updatedChallengeOption;
};

const deleteChallengeOption = async (id) => {
  const deletedChallengeOption = await db
    .delete(schema.challengeOptions)
    .where(eq(schema.challengeOptions.id, id))
    .returning();
  return deletedChallengeOption;
};

// challenge progress
const updateChallengeProgress = async (userId, challengeId, completed) => {
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
};
