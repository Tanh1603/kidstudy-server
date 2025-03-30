import express from "express";
import { adminLessonRouter, userLessonRouter } from "./LessonRouter.js";
import { adminUnitRouter, userUnitRouter } from "./UnitRouter.js";
import { adminChallengeRouter, userChallengeRouter } from "./ChallengeRouter.js";
import conservationRouter from "./ConversationRouter.js";
import { userProgressRouter } from "./UserProgressRouter.js";

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

// conversations
adminRouter.use("/conversations", conservationRouter);
userRouter.use("/conversations", conservationRouter);

// user progress
adminRouter.use("/user-progress", userProgressRouter);
userRouter.use("/user-progress", userProgressRouter);

export { adminRouter, userRouter };
