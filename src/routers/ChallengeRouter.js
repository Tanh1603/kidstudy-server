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

const challengeRouter = express.Router();

// Challenges
challengeRouter.get("/", getChallenges);
challengeRouter.get("/:id", getChallengeById);
challengeRouter.post("/", createChallenge);
challengeRouter.put("/:id", updateChallenge);
challengeRouter.delete("/:id", deleteChallenge);

// Challenge Options
challengeRouter.post("/:id/options", addChallengeOption);
challengeRouter.put("/:id/options/:optionId", updateChallengeOption);
challengeRouter.delete("/:id/options/:optionId", deleteChallengeOption);

// Challenge Progress
challengeRouter.put("/:id/progress", updateChallengeProgress);

export default challengeRouter;
