import multer from "multer";
import express from "express";
import { createTopicController, getAllTopicsController, patchTopicTitleController, patchTopicIconController, deleteTopicController } from "../controllers/TopicController.js";

const upload = multer({ storage: multer.memoryStorage() });

const userTopicRouter = express.Router();
const adminTopicRouter = express.Router();

userTopicRouter.get("/", getAllTopicsController);

adminTopicRouter.get("/", getAllTopicsController);
adminTopicRouter.post("/", upload.single("icon"), createTopicController);
adminTopicRouter.patch("/:id/title", patchTopicTitleController);
adminTopicRouter.patch("/:id/icon", upload.single("icon"), patchTopicIconController);
adminTopicRouter.delete("/:id", deleteTopicController);

export { userTopicRouter, adminTopicRouter };
