import * as UserProgressService from "../services/UserProgressService.js";

// User Progress
const upsertUserProgress = async (req, res) => {
  try {
    console.log(req.body);
    const response = await UserProgressService.upsertUserProgress(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgressService.getAllUserProgress();
    res.status(200).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProgressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userProgress = await UserProgressService.getUserProgressByUserId(
      userId
    );
    res.status(200).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserProgressByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const userProgress = await UserProgressService.getUserProgressByUserEmail(
      email
    );
    res.status(200).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getLeaderboard = async (req, res) => {
  try {
    const size = parseInt(req.query.size) || 10;
    const leaderboard = await UserProgressService.getLeaderboard(size);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reduceHearts = async (req, res) => {
  try {
    const { challengeId, userId } = req.query;
    console.log(challengeId, userId);

    const result = await UserProgressService.reduceHearts(challengeId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refillHearts = async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await UserProgressService.refillHearts(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  upsertUserProgress,
  getAllUserProgress,
  getUserProgressByUserId,
  getUserProgressByUserEmail,
  getLeaderboard,
  reduceHearts,
  refillHearts,
};
