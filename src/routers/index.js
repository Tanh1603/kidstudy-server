import express from "express";
import { adminLessonRouter, userLessonRouter } from "./LessonRouter.js";
import { adminUnitRouter, userUnitRouter } from "./UnitRouter.js";
import {
  adminChallengeOptionsRouter,
  adminChallengeRouter,
  userChallengeRouter,
} from "./ChallengeRouter.js";
import conservationRouter from "./ConversationRouter.js";
import { userProgressRouter } from "./UserProgressRouter.js";
import { uploadFile, deleteFile } from "../services/CloudinaryService.js";
import multer from "multer";

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

// conversations
adminRouter.use("/conversations", conservationRouter);
userRouter.use("/conversations", conservationRouter);

// user progress
adminRouter.use("/user-progress", userProgressRouter);
userRouter.use("/user-progress", userProgressRouter);

//FeatFriend----------------------------------------------------------------------------------------------------------
import { db, sql } from "./db.js"; // Kết nối PostgreSQL
//Test
userRouter.get("/test", (req, res) => {
    res.send("Hello, World!");
});
// 📩 Gửi lời mời kết bạn
userRouter.post("/send", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        await sql`
        INSERT INTO friend_requests (sender_id, receiver_id, status)
        VALUES (${senderId}, ${receiverId}, 'pending')
    `;
        res.json({ message: "Lời mời kết bạn đã được gửi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Chấp nhận lời mời
userRouter.post("/accept", async (req, res) => {
    try {
        const { requestId } = req.body;
        await sql`
            UPDATE friend_requests 
            SET status = 'accepted' 
            WHERE id = ${requestId}
        `;
        res.json({ message: "Đã chấp nhận lời mời kết bạn." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ❌ Từ chối hoặc hủy lời mời
userRouter.post("/decline", async (req, res) => {
    try {
        const { requestId } = req.body;
        
        await sql`
            UPDATE friend_requests 
            SET status = 'declined' 
            WHERE id = ${requestId}
        `;
        
        res.json({ message: "Đã từ chối lời mời kết bạn." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 🗑 Xóa bạn bè
userRouter.post("/unfriend", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        await sql`
            DELETE FROM friend_requests 
            WHERE sender_id = ${senderId} AND receiver_id = ${receiverId}
        `;
        
        res.json({ message: "Đã xóa bạn bè." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Lấy danh sách bạn bè
userRouter.get("/friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const friends = await sql`
        SELECT sender_id
        FROM friend_requests
        WHERE receiver_id = ${userId}
        AND status = 'accepted'
        UNION
        SELECT receiver_id
        FROM friend_requests
        WHERE sender_id = ${userId}
        AND status = 'accepted';

        `;
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Lấy danh sách lời mời
userRouter.get("/requests/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const requests = await sql`
            SELECT id,sender_id
            FROM friend_requests
            WHERE receiver_id=${userId}
            AND status = 'pending'
        `;
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//-----------------------------------------------------------------------------------------------------------------------------
//Diễn đàn Chat
//API Gửi tin nhắn
userRouter.post("/send_messages", async (req, res) => {
    try {
        const { userId, content } = req.body;
        await sql`
            INSERT INTO chat_logs (user_id, content)
            VALUES (${userId}, ${content})
        `;
        res.json({ message: "Đã gửi tin nhắn!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//API Lấy danh sách tin nhắn
userRouter.post("/get_messages", async (req, res) => {
    try {
        const chatData = await sql`SELECT * FROM chat_logs ORDER BY created_at ASC`;
        res.json(chatData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//----------------------------------------------------------------------------------------------------------------------------

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

export { adminRouter, userRouter };
