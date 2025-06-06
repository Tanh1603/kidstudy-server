import express from "express";
import {db,sql} from "../db/index.js";

const friendRouter = express.Router();

// ✅ Gửi lời mời kết bạn
friendRouter.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Thiếu senderId hoặc receiverId." });
    }

    const result = await sql`
      INSERT INTO friend_requests (sender_id, receiver_id, status)
      VALUES (${senderId}, ${receiverId}, 'pending')
      RETURNING *;
    `;

    res.json({ message: "Lời mời kết bạn đã được gửi.", data: result });
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Chấp nhận lời mời
friendRouter.post("/accept", async (req, res) => {
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

// ❌ Từ chối lời mời kết bạn
friendRouter.post("/decline", async (req, res) => {
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
friendRouter.post("/unfriend", async (req, res) => {
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

// 📋 Lấy danh sách bạn bè
friendRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await sql`
      SELECT sender_id FROM friend_requests WHERE receiver_id = ${userId} AND status = 'accepted'
      UNION
      SELECT receiver_id FROM friend_requests WHERE sender_id = ${userId} AND status = 'accepted';
    `;
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📩 Lấy danh sách lời mời kết bạn
friendRouter.get("/requests/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await sql`
      SELECT id, sender_id FROM friend_requests WHERE receiver_id = ${userId} AND status = 'pending'
    `;
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default friendRouter;
