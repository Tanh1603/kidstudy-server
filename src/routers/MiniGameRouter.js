import express from "express";
import {
  getRandomGameQuestionsController,
  createGameQuestionController,
  deleteGameQuestionController,
  getGameQuestionsController,
  updateGameQuestionController,
} from "../controllers/MiniGameController.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const userMiniGameRouter = express.Router();
const adminMiniGameRouter = express.Router();

userMiniGameRouter.get("/", getRandomGameQuestionsController);

adminMiniGameRouter.get("/", getGameQuestionsController);
adminMiniGameRouter.post(
  "/",
  upload.fields([
    { name: "imageSrc", maxCount: 1 },
    { name: "audioSrc", maxCount: 1 },
  ]),
  createGameQuestionController
);
adminMiniGameRouter.put(
  "/:id",
  upload.fields([
    { name: "imageSrc", maxCount: 1 },
    { name: "audioSrc", maxCount: 1 },
  ]),
  updateGameQuestionController
);
adminMiniGameRouter.delete("/:id", deleteGameQuestionController);

export { userMiniGameRouter, adminMiniGameRouter };
