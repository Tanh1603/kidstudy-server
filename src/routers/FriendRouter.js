import express from "express";
import {db,sql} from "../db/index.js";

const friendRouter = express.Router();

//  Gửi lời mời kết bạn
friendRouter.post("/send", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.body;
    if (!senderEmail || !receiverEmail) {
      return res.status(400).json({ error: "Thiếu senderEmail hoặc receiverEmail." });
    }

    const result = await sql`
      INSERT INTO friend_requests (sender_email, receiver_email, status)
      VALUES (${senderEmail}, ${receiverEmail}, 'pending')
      RETURNING *;
    `;

    res.json({ message: "Lời mời kết bạn đã được gửi.", data: result });
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu:", error);
    res.status(500).json({ error: error.message });
  }
});

//  Chấp nhận lời mời
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

//  Từ chối lời mời kết bạn
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

//  Xóa bạn bè
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

// Lấy danh sách bạn bè
friendRouter.get("/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const friends = await sql`
      SELECT sender_email FROM friend_requests WHERE receiver_email = ${userEmail} AND status = 'accepted'
      UNION
      SELECT receiver_email FROM friend_requests WHERE sender_email = ${userEmail} AND status = 'accepted';
    `;
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách lời mời kết bạn
friendRouter.get("/requests/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const requests = await sql`
      SELECT id, sender_email FROM friend_requests WHERE receiver_email = ${userEmail} AND status = 'pending'
    `;
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
friendRouter.get("/check-email/:receiverEmail", async (req, res) => {
  try {
    const { receiverEmail } = req.params;

    const result = await sql`
      SELECT user_email FROM user_progress WHERE user_email = ${receiverEmail}
    `;

    if (result.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
friendRouter.get("/validate/:senderEmail/:receiverEmail", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.params;

    // 1. Kiểm tra trùng nhau
    if (senderEmail === receiverEmail) {
      return res.status(400).json({ valid: false, message: "Không thể gửi kết bạn cho chính mình." });
    }

    // 2. Kiểm tra đã là bạn bè chưa (2 chiều)
    const friendCheck = await sql`
      SELECT * FROM friend_requests 
      WHERE
      sender_email = ${senderEmail} AND receiver_email = ${receiverEmail} AND status = 'accepted'
      OR sender_email = ${receiverEmail} AND receiver_email = ${senderEmail} AND status = 'accepted'
    `;
    if (friendCheck.length > 0) {
      return res.status(400).json({ valid: false, message: "Đây đã là bạn bè của bạn." });
    }
    // 3. Nếu qua hết các điều kiện
    res.json({ valid: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

friendRouter.put("/gift", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.body; 

    await sql`
      UPDATE user_progress 
      SET hearts = hearts + 1
      WHERE user_email = ${receiverEmail};`
    await sql`
      UPDATE user_progress 
      SET hearts = hearts - 1 
      WHERE user_email = ${senderEmail};
    `
    res.json({ message: "Tim đã được tặng thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default friendRouter;
