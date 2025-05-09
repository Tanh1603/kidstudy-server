import express from "express";
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  addChallengeOption,
  updateChallengeOption,
  deleteChallengeOption,
  updateChallengeProgress,
  upsertChallengeProgress,
} from "../controllers/ChallengeController.js";

const adminChallengeRouter = express.Router();
const adminChallengeOptionsRouter = express.Router();
const userChallengeRouter = express.Router();

// Challenges
adminChallengeRouter.get("/", getChallenges);
adminChallengeRouter.get("/:id", getChallengeById);
adminChallengeRouter.post("/", createChallenge);
adminChallengeRouter.put("/:id", updateChallenge);
adminChallengeRouter.delete("/:id", deleteChallenge);

// Challenge Options
adminChallengeOptionsRouter.post("/", addChallengeOption);
adminChallengeOptionsRouter.put("/:id", updateChallengeOption);
adminChallengeOptionsRouter.delete("/:id", deleteChallengeOption);

// Challenge Progress
userChallengeRouter.put("/:id/progress/upsert", upsertChallengeProgress);
userChallengeRouter.put("/:id/progress", updateChallengeProgress);

export {
  adminChallengeRouter,
  userChallengeRouter,
  adminChallengeOptionsRouter,
};
