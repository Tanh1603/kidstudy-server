import * as UserProgressService from "../services/UserProgressService.js";

// User Progress
const createUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgressService.createUserProgress(req.body);
    res.status(201).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgressService.updateUserProgress(req.body);
    res.status(200).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createUserProgress, updateUserProgress };
