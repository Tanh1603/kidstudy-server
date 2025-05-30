import express from "express";
import { adminLessonRouter, userLessonRouter } from "./LessonRouter.js";
import { adminUnitRouter, userUnitRouter } from "./UnitRouter.js";
import {
  adminChallengeOptionsRouter,
  adminChallengeRouter,
  userChallengeRouter,
} from "./ChallengeRouter.js";
import { userProgressRouter } from "./UserProgressRouter.js";
import { uploadFile, deleteFile } from "../services/CloudinaryService.js";
import multer from "multer";
import { adminTopicRouter, userTopicRouter } from "./TopicRouter.js";
import { adminMiniGameRouter } from "./MiniGameRouter.js";
const upload = multer({ storage: multer.memoryStorage() });

const userRouter = express.Router();
const adminRouter = express.Router();
// admin
// units
adminRouter.use("/units", adminUnitRouter);
userRouter.use("/units", userUnitRouter);

// lessons
adminRouter.use("/lessons", adminLessonRouter);
userRouter.use("/lessons", userLessonRouter);

// challenges
adminRouter.use("/challenges", adminChallengeRouter);
userRouter.use("/challenges", userChallengeRouter);

// challenge options
adminRouter.use("/challenge-options", adminChallengeOptionsRouter);

// user progress
adminRouter.use("/user-progress", userProgressRouter);
userRouter.use("/user-progress", userProgressRouter);

adminRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadFile(file.buffer);
    return res.status(201).json({
      message: "Success",
      url: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: error.message });
  }
});

adminRouter.delete("/upload", async (req, res) => {
  try {
    const url = req.query.fileUrl;
    const result = await deleteFile(url);
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// topics
adminRouter.use("/topics", adminTopicRouter);
userRouter.use("/topics", userTopicRouter);

// minigames
adminRouter.use("/mini-games", adminMiniGameRouter);
userRouter.use("/mini-games", adminMiniGameRouter);


export { adminRouter, userRouter };
