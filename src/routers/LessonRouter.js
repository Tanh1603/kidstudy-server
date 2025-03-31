import express from "express";
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  isLessonCompleted,
  getFirstIncompleteLesson,
  getLessonPercentage,
  getUserLessonById,
} from "../controllers/LessonController.js";

const adminLessonRouter = express.Router();
const userLessonRouter = express.Router();

adminLessonRouter.get("/", getLessons);
adminLessonRouter.get("/:id", getLessonById);
adminLessonRouter.post("/", createLesson);
adminLessonRouter.put("/:id", updateLesson);
adminLessonRouter.delete("/:id", deleteLesson);
adminLessonRouter.get("/:id/is-completed", isLessonCompleted);

userLessonRouter.get("/first-incomplete", getFirstIncompleteLesson);
userLessonRouter.get("/:id/is-completed", isLessonCompleted);
userLessonRouter.get("/:id/percentage", getLessonPercentage);
userLessonRouter.get("/:id", getUserLessonById);

export { adminLessonRouter, userLessonRouter };
