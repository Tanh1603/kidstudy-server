import express from "express";
import {db,sql} from "../db/index.js";


const chatRouter = express.Router();

// 📨 Gửi tin nhắn
chatRouter.post("/send_messages", async (req, res) => {
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

// 📩 Lấy danh sách tin nhắn
chatRouter.get("/get_messages", async (req, res) => {
  try {
    const chatData = await sql`SELECT * FROM chat_logs ORDER BY created_at ASC`;
    res.json(chatData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default chatRouter;