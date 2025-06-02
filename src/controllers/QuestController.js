import * as QuestService from "../services/QuestService.js";

// admin
const getQuest = async (req, res) => {
  try {
    const response = await QuestService.getQuest();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuest = async (req, res) => {
  try {
    const response = await QuestService.createQuest(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuest = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await QuestService.updateQuest(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuest = async (req, res) => {
  try {
    const { id } = req.params;
    await QuestService.deleteQuest(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
const getUserQuest = async (req, res) => {
  try {
    const { userId } = req.query;
    const response = await QuestService.getUserQuest(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addDailyPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;
    const response = await QuestService.addDailyPoints(userId, points);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDailyQuestsForUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await QuestService.createDailyQuestsForUser(userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getQuest,
  getUserQuest,
  createQuest,
  updateQuest,
  deleteQuest,
  addDailyPoints,
  createDailyQuestsForUser,
};
