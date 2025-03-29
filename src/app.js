 import express from "express";
 import path from "path";
 import cookieParser from "cookie-parser";
 import logger from "morgan";
 import cors from "cors";
 import { fileURLToPath } from "url";
 import dotenv from "dotenv";


 // Load environment variables
 dotenv.config();

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


 // Default route
 app.get("/", (req, res) => {
   res.json({ message: "Welcome to KidStudy API" });
 });

 export default app;