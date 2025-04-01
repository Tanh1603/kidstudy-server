import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq } from "drizzle-orm";
const getAllChallengeOptions = async () => {
  const challengeOptions = await db.query.challengeOptions.findMany();
  return challengeOptions;
};

const getChallengeOptions = async (challengeId) => {
  const challengeOptions = await db.query.challengeOptions.findMany({
    where: eq(schema.challengeOptions.id, challengeId),
  });
  return challengeOptions;  
};

const createChallengeOption = async (challengeId, option) => {
  const challengeOption = await db.insert(schema.challengeOptions).values({
    challengeId,
    option,
  });
  return challengeOption;
};

const updateChallengeOption = async (id, option) => {
  const challengeOption = await db
    .update(schema.challengeOptions)
    .set({
      option,
    })
    .where(eq(schema.challengeOptions.id, id));
  return challengeOption;
};

const deleteChallengeOption = async (id) => {
  const challengeOption = await db
    .delete(schema.challengeOptions)
    .where(eq(schema.challengeOptions.id, id));
  return challengeOption;
};

export {
  getAllChallengeOptions,
  getChallengeOptions,
  createChallengeOption,
  updateChallengeOption,
  deleteChallengeOption,
};
