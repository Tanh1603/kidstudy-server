import express from "express";
import {
  upsertUserProgress,
  getAllUserProgress,
  getUserProgressByUserId,
  getLeaderboard,
  reduceHearts,
  refillHearts,
} from "../controllers/UserProgressController.js";

const userProgressRouter = express.Router();

userProgressRouter.put("/upsert", upsertUserProgress);
userProgressRouter.get("/leaderboard", getLeaderboard);
userProgressRouter.get("/:userId", getUserProgressByUserId);
userProgressRouter.get("/", getAllUserProgress);
userProgressRouter.put("/reduce-hearts", reduceHearts);
userProgressRouter.put("/refill-hearts", refillHearts);

export { userProgressRouter };
