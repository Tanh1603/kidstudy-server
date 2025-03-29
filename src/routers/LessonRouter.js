import express from "express";
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  isLessonCompleted,
} from "../controllers/LessonController.js";

const lessonRouter = express.Router();

lessonRouter.get("/", getLessons);
lessonRouter.get("/:id", getLessonById);
lessonRouter.post("/", createLesson);
lessonRouter.put("/:id", updateLesson);
lessonRouter.delete("/:id", deleteLesson);
lessonRouter.get("/:id/is-completed", isLessonCompleted);

export default lessonRouter;
