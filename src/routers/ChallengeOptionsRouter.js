import express from "express";
import {
  getAllChallengeOptions,
  getChallengeOptions,
  createChallengeOption,
  updateChallengeOption,
  deleteChallengeOption,
} from "../controllers/ChallengeOptionsController.js";

const challengeOptionsRouter = express.Router();
challengeOptionsRouter.get("/:id", getChallengeOptions);
challengeOptionsRouter.get("/", getAllChallengeOptions);
challengeOptionsRouter.post("/", createChallengeOption);
challengeOptionsRouter.put("/:id", updateChallengeOption);
challengeOptionsRouter.delete("/:id", deleteChallengeOption);

export { challengeOptionsRouter };
