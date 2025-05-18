import { db } from "../db/index.js" ;
import { friendRequests } from "../db/schema.js";

// 📩 Gửi lời mời kết bạn
async function sendFriendRequest(senderId, receiverId) {
    return db.insert(friendRequests).values({
        senderId,
        receiverId,
        status: "pending",
    });
}

// ✅ Chấp nhận lời mời
async function acceptFriendRequest(requestId) {
    return db.update(friendRequests)
        .set({ status: "accepted" })
        .where(friendRequests.id.eq(requestId));
}

// ❌ Từ chối lời mời
async function declineFriendRequest(requestId) {
    return db.update(friendRequests)
        .set({ status: "declined" })
        .where(friendRequests.id.eq(requestId));
}

// 🗑 Xóa bạn bè
async function unfriend(senderId, receiverId) {
    return db.delete(friendRequests)
        .where(friendRequests.senderId.eq(senderId)
        .and(friendRequests.receiverId.eq(receiverId)));
}

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    unfriend,
};
