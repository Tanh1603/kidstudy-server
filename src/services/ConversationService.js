import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

// Conversations
const getAllConversations = async () => {
  const conversations = await db.query.conversations.findMany({
    with: {
      messages: {
        orderBy: [desc(schema.messages.createdAt)],
      },
    },
    orderBy: [desc(schema.conversations.createdAt)],
  });
  return conversations;
};

const getConversationById = async (id) => {
  const conversation = await db.query.conversations.findFirst({
    where: eq(schema.conversations.id, id),
    with: {
      messages: {
        orderBy: [desc(schema.messages.createdAt)],
      },
    },
  });
  return conversation;
};

const createConversation = async (conversation) => {
  const newConversation = await db
    .insert(schema.conversations)
    .values(conversation)
    .returning();
  return newConversation;
};

const deleteConversation = async (id) => {
  const deletedConversation = await db
    .delete(schema.conversations)
    .where(eq(schema.conversations.id, id))
    .returning();
  return deletedConversation;
};

// Messages
const getAllMessages = async () => {
  const messages = await db.query.messages.findMany();
  return messages;
};

const addMessage = async (message) => {
  const newMessage = await db
    .insert(schema.messages)
    .values({
      conversationId,
      ...message,
    })
    .returning();
  return newMessage;
};

const updateMessage = async (id, message) => {
  const updatedMessage = await db
    .update(schema.messages)
    .set(message)
    .where(eq(schema.messages.id, id))
    .returning();
  return updatedMessage;
};
export {
  getAllConversations,
  getConversationById,
  createConversation,
  deleteConversation,
  getAllMessages,
  addMessage,
  updateMessage,
};
