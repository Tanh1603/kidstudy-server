import {
  createTopic,
  getAllTopics,
  patchTopicTitle,
  patchTopicIcon,
  deleteTopic,
} from "../services/TopicService.js";
import { uploadFile } from "../services/CloudinaryService.js";

const createTopicController = async (req, res) => {
  const { title } = req.body;
  const icon = req.file;
  if (!icon) {
    return res.status(400).json({ message: "Icon is required" });
  }
  const url = await uploadFile(icon.buffer);
  const topic = await createTopic({ title, icon: url });
  res.status(201).json(topic);
};

const getAllTopicsController = async (req, res) => {
  const topics = await getAllTopics();
  res.status(200).json(topics);
};

const patchTopicTitleController = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const topic = await patchTopicTitle(id, title);
  res.status(200).json(topic);
};

const patchTopicIconController = async (req, res) => {
  const { id } = req.params;
  const icon = req.file;
  if (!icon) {
    return res.status(400).json({ message: "Icon is required" });
  }
  const topic = await patchTopicIcon(id, icon);
  res.status(200).json(topic);
};

const deleteTopicController = async (req, res) => {
  const { id } = req.params;
  const topic = await deleteTopic(id);
  res.status(200).json(topic);
};
export {
  createTopicController,
  getAllTopicsController,
  patchTopicTitleController,
  patchTopicIconController,
  deleteTopicController,
};