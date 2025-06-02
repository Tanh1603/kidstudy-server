import express from "express";
import * as QuestController from "../controllers/QuestController.js"

const userQuestRouter = express.Router();
const adminQuestRouter = express.Router();

adminQuestRouter.get("/", QuestController.getQuest)
adminQuestRouter.post("/", QuestController.createQuest)
adminQuestRouter.put("/:id", QuestController.updateQuest);
adminQuestRouter.delete("/:id", QuestController.deleteQuest)

userQuestRouter.get("/", QuestController.getUserQuest)
userQuestRouter.put("/daily-points", QuestController.addDailyPoints);
userQuestRouter.post("/reset", QuestController.createDailyQuestsForUser);

export { adminQuestRouter, userQuestRouter}