import express from "express";
import {
  upsertUserProgress,
  getAllUserProgress,
  getUserProgressByUserId,
  getLeaderboard,
  reduceHearts,
  refillHearts,
  updateUserPoints,
} from "../controllers/UserProgressController.js";

const userProgressRouter = express.Router();

userProgressRouter.put("/upsert", upsertUserProgress);
userProgressRouter.get("/leaderboard", getLeaderboard);
userProgressRouter.get("/:userId", getUserProgressByUserId);
userProgressRouter.patch("/:userId/points", updateUserPoints);
userProgressRouter.get("/", getAllUserProgress);
userProgressRouter.put("/reduce-hearts", reduceHearts);
userProgressRouter.put("/refill-hearts", refillHearts);

export { userProgressRouter };
