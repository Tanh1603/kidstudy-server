import express from "express";
import lessonRouter from "./LessonRouter.js";
import unitRouter from "./UnitRouter.js";
import challengeRouter from "./ChallengeRouter.js";
import conservationRouter from "./ConversationRouter.js";
import userProgressRouter from "./UserProgressRouter.js";
const routes = [
  { path: "/lessons", router: lessonRouter },
  { path: "/units", router: unitRouter },
  { path: "/challenges", router: challengeRouter },
  { path: "/conversations", router: conservationRouter },
  { path: "/user-progress", router: userProgressRouter },
];

const mainRouter = express.Router();

routes.forEach((route) => {
  mainRouter.use(route.path, route.router);
});

export default mainRouter;
