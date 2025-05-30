import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { deleteFile, isCloudinaryUrl, uploadFile } from "./CloudinaryService.js";
import { eq, asc } from "drizzle-orm";

const getAllTopics = async () => {
  const topics = await db.query.topics.findMany({
    orderBy: [asc(schema.topics.id)],
  });
  return topics;
};

const createTopic = async (topic) => {
  const newTopic = await db.insert(schema.topics).values(topic).returning();
  return newTopic[0];
};

const patchTopicTitle = async (id, title) => {
  if (!title || title.trim() === "") {
    throw new Error("Title cannot be empty");
  }
  const updatedTopic = await db
    .update(schema.topics)
    .set({ title })
    .where(eq(schema.topics.id, id))
    .returning();
  return updatedTopic[0];
};

const patchTopicIcon = async (id, icon) => {
  const existingTopic = await db.query.topics.findFirst({
    where: eq(schema.topics.id, id),
  });
  if (!existingTopic) {
    throw new Error("Topic not found");
  }
  // Check if the icon is already the same
  if (existingTopic.icon && isCloudinaryUrl(existingTopic.icon)) {
    await deleteFile(existingTopic.icon);
  }
  const url = await uploadFile(icon.buffer);
  const updatedTopic = await db
    .update(schema.topics)
    .set({ icon: url })
    .where(eq(schema.topics.id, id))
    .returning();
  return updatedTopic[0];
};

const deleteTopic = async (id) => {
  const existingTopic = await db.query.topics.findFirst({
    where: eq(schema.topics.id, id),
  });
  if (!existingTopic) {
    throw new Error("Topic not found");
  }
  if (existingTopic.icon && isCloudinaryUrl(existingTopic.icon)) {
    await deleteFile(existingTopic.icon);
  }

  const deletedTopic = await db
    .delete(schema.topics)
    .where(eq(schema.topics.id, id))
    .returning();
  return deletedTopic[0];
};

export {
  getAllTopics,
  createTopic,
  patchTopicTitle,
  patchTopicIcon,
  deleteTopic,
};
