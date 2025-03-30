import express from "express";
import {
  upsertUserProgress,
  getAllUserProgress,
  getUserProgressByUserId,
  getLeaderboard,
} from "../controllers/UserProgressController.js";

const userProgressRouter = express.Router();

userProgressRouter.put("/upsert", upsertUserProgress);
userProgressRouter.get("/leaderboard", getLeaderboard);
userProgressRouter.get("/:userId", getUserProgressByUserId);
userProgressRouter.get("/", getAllUserProgress);

export { userProgressRouter };
