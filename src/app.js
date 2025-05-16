import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { adminRouter, userRouter } from "./routers/index.js";
import {
  requireAuth,
  clerkClient,
  getAuth,
  clerkMiddleware,
} from "@clerk/express";
import fixRouter from "./routers/FixRouter.js";


import adminMiddleware from "./middlewares/AuthMiddleware.js";

// Load environment variables
dotenv.config({
  path: ".env.development",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(clerkMiddleware());

// Default route
app.get("/error", (req, res) => {
  res.status(401).json({ message: "Unauthorized" });
});

app.use(
  "/admin",
  // requireAuth({ signInUrl: "/error" }),
  // adminMiddleware,
  adminRouter
);
app.use("/user", requireAuth({ signInUrl: "/error" }), userRouter);
// app.use("/api/v1/user", userRouter);

app.use("/fix", fixRouter);

export default app;
