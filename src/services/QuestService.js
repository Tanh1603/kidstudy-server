import { and, asc, eq, gte, lt } from "drizzle-orm";
import db from "../db/index.js";
import * as schema from "../db/schema.js";
import cron from "node-cron";
// quest
const getQuest = async () => {
  return await db.query.quests.findMany();
};

const createQuest = async (quest) => {
  return await db.transaction(async (tx) => {
    const newQuest = await tx.insert(schema.quests).values(quest).returning();
    return newQuest[0];
  });
};

const updateQuest = async (id, quest) => {
  return await db.transaction(async (tx) => {
    const updateQuest = await tx
      .update(schema.quests)
      .set(quest)
      .where(eq(schema.quests.id, id))
      .returning();
    return updateQuest[0];
  });
};

const deleteQuest = async (id) => {
  return await db.transaction(async (tx) => {
    const deleteQuest = await tx
      .delete(schema.quests)
      .where(eq(schema.quests.id, id))
      .returning();
    return deleteQuest[0];
  });
};

const getUserQuest = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const rows = await db.query.questUser.findMany({
      where: and(
        eq(schema.questUser.userId, userId),
        gte(schema.questUser.createdAt, today),
        lt(schema.questUser.createdAt, tomorrow)
      ),
      with: {
        quest: true,
      },
    });

    return (rows || [])
      .filter((uq) => uq.quest) // Chỉ giữ lại các quest còn tồn tại
      .sort(
        (a, b) => (a.quest?.targetPoints || 0) - (b.quest?.targetPoints || 0)
      )
      .map((uq) => ({
        id: uq.quest.id,
        questId: uq.quest.id,
        title: uq.quest.title,
        points: uq.dailyPoints,
        target: uq.quest.targetPoints,
        reward: uq.quest.reward,
        isCompleted: uq.completed,
      }));
  } catch (error) {
    console.error("Database query error:", error);
    return [];
  }
};

const addDailyPoints = async (userId, points) => {
  return await db.transaction(async (tx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Tìm tất cả quest của user có createdAt là hôm nay
    const todayQuests = await tx.query.questUser.findMany({
      with: {
        quest: true,
      },
      where: and(
        eq(schema.questUser.userId, userId),
        gte(schema.questUser.createdAt, today),
        lt(schema.questUser.createdAt, tomorrow)
      ),
    });

    // Lọc bỏ các quest không còn tồn tại
    const validQuests = todayQuests.filter((uq) => uq.quest);

    if (!validQuests || validQuests.length === 0) {
      throw Error("No valid quests found for user today");
    }

    // Lấy thông tin user progress một lần
    const userProgress = await tx.query.userProgress.findFirst({
      where: eq(schema.userProgress.userId, userId),
    });

    if (!userProgress) {
      throw Error("User progress not found");
    }

    let totalRewardTickets = 0;

    // Xử lý từng quest
    for (const questUser of validQuests) {
      const updatedPoints = Math.min(
        questUser.dailyPoints + points,
        questUser.quest.targetPoints
      );

      const isCompleted = updatedPoints >= questUser.quest.targetPoints;
      const wasNotCompleted = !questUser.completed;

      // Chỉ cộng reward nếu quest vừa được hoàn thành (chưa completed trước đó)
      if (isCompleted && wasNotCompleted) {
        totalRewardTickets += questUser.quest.reward;
      }

      // Cập nhật quest
      await tx
        .update(schema.questUser)
        .set({
          dailyPoints: updatedPoints,
          completed: isCompleted,
        })
        .where(eq(schema.questUser.id, questUser.id));
    }

    // Cập nhật user progress nếu có reward tickets
    if (totalRewardTickets > 0) {
      await tx
        .update(schema.userProgress)
        .set({
          tickets: userProgress.tickets + totalRewardTickets,
        })
        .where(eq(schema.userProgress.userId, userId));
    }
  });
};

const createDailyQuestsForUser = async (userId) => {
  return await db.transaction(async (tx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Kiểm tra quests hiện tại của user
    const existing = await tx.query.questUser.findMany({
      where: and(
        eq(schema.questUser.userId, userId),
        gte(schema.questUser.createdAt, today),
        lt(schema.questUser.createdAt, tomorrow)
      ),
    });

    // Lấy tất cả quests hiện có
    const allQuests = await tx.query.quests.findMany();

    // Kiểm tra nếu không có quest nào trong hệ thống
    if (!allQuests || allQuests.length === 0) {
      return;
    }

    if (existing.length > 0 && existing.length === allQuests.length) {
      console.log(`User ${userId} đã có quest hôm nay`);
      return;
    }

    // Tạo quest mới cho user với tất cả quests hiện có
    const insertData = allQuests.map((quest) => ({
      userId: userId,
      questId: quest.id,
      createdAt: new Date(),
      dailyPoints: 0,
      completed: false,
    }));

    return await tx.insert(schema.questUser).values(insertData).returning();
  });
};

export {
  getQuest,
  createQuest,
  updateQuest,
  deleteQuest,
  getUserQuest,
  addDailyPoints,
  createDailyQuestsForUser,
};
