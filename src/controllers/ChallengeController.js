import * as ChallengeService from "../services/ChallengeService.js";

// Challenges
const getChallenges = async (req, res) => {
  try {
    const challenges = await ChallengeService.getAllChallenges();
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChallengeById = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await ChallengeService.getChallengeById(id);
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    const challenge = await ChallengeService.createChallenge(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChallenge = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await ChallengeService.updateChallenge(id, req.body);
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChallenge = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await ChallengeService.deleteChallenge(id);
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Challenge Options
const addChallengeOption = async (req, res) => {
  const { id } = req.params;
  try {
    const challengeOption = await ChallengeService.addChallengeOption(
      id,
      req.body
    );
    res.status(201).json(challengeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChallengeOption = async (req, res) => {
  const { id } = req.params;
  try {
    const challengeOption = await ChallengeService.updateChallengeOption(
      id,
      req.body
    );
    res.status(200).json(challengeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChallengeOption = async (req, res) => {
  const { id } = req.params;
  try {
    const challengeOption = await ChallengeService.deleteChallengeOption(id);
    res.status(200).json(challengeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Challenge Progress
const updateChallengeProgress = async (req, res) => {
  const { id } = req.params;
  const { userId, completed } = req.query;

  try {
    const challengeProgress = await ChallengeService.updateChallengeProgress(
      userId,
      id,
      completed
    );
    res.status(200).json(challengeProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertChallengeProgress = async (req, res) => {
  const { id } = req.params;
  const { userId, completed } = req.query;

  try {
    const challengeProgress = await ChallengeService.upsertChallengeProgress(
      userId,
      id
    );
    res.status(200).json(challengeProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  addChallengeOption,
  updateChallengeOption,
  deleteChallengeOption,
  updateChallengeProgress,
  upsertChallengeProgress,
};
