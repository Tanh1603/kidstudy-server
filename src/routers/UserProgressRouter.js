import express from "express";
import {
  createUserProgress,
  updateUserProgress,
} from "../controllers/UserProgressController.js";

const userProgressRouter = express.Router();

userProgressRouter.post("/", createUserProgress);
userProgressRouter.put("/:id", updateUserProgress);

export default userProgressRouter;
