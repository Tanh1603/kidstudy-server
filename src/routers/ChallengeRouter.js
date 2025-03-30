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
} from "../controllers/ChallengeController.js";

const adminChallengeRouter = express.Router();
const userChallengeRouter = express.Router();

// Challenges
adminChallengeRouter.get("/", getChallenges);
adminChallengeRouter.get("/:id", getChallengeById);
adminChallengeRouter.post("/", createChallenge);
adminChallengeRouter.put("/:id", updateChallenge);
adminChallengeRouter.delete("/:id", deleteChallenge);

// Challenge Options
adminChallengeRouter.post("/:id/options", addChallengeOption);
adminChallengeRouter.put("/:id/options/:optionId", updateChallengeOption);
adminChallengeRouter.delete("/:id/options/:optionId", deleteChallengeOption);

// Challenge Progress
userChallengeRouter.put("/:id/progress", updateChallengeProgress);

export { adminChallengeRouter, userChallengeRouter };
