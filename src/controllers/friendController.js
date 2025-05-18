const express = require("express");
const router = express.Router();
const friendService = require("../services/friendService");

// 📩 API gửi lời mời kết bạn
router.post("/send", async (req, res) => {
    const { senderId, receiverId } = req.body;
    await friendService.sendFriendRequest(senderId, receiverId);
    res.json({ message: "Lời mời kết bạn đã được gửi." });
});

// ✅ API chấp nhận lời mời kết bạn
router.post("/accept", async (req, res) => {
    const { requestId } = req.body;
    await friendService.acceptFriendRequest(requestId);
    res.json({ message: "Đã chấp nhận lời mời kết bạn." });
});

// ❌ API từ chối/hủy lời mời
router.post("/decline", async (req, res) => {
    const { requestId } = req.body;
    await friendService.declineFriendRequest(requestId);
    res.json({ message: "Lời mời đã bị từ chối hoặc hủy." });
});

// 🗑 API xóa bạn bè
router.post("/unfriend", async (req, res) => {
    const { senderId, receiverId } = req.body;
    await friendService.unfriend(senderId, receiverId);
    res.json({ message: "Đã xóa bạn bè." });
});

module.exports = router;
