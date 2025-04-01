import * as ChallengeOptionsService from "../services/ChallengeOptionsService.js";

const getAllChallengeOptions = async (req, res) => {
  try {
    const challengeOptions =
      await ChallengeOptionsService.getAllChallengeOptions();
    res.status(200).json(challengeOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getChallengeOptions = async (req, res) => {
  try {
    const challengeOptions = await ChallengeOptionsService.getChallengeOptions(
      Number(req.params.id)
    );
    res.status(200).json(challengeOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createChallengeOption = async (req, res) => {
  try {
    const challengeOption = await ChallengeOptionsService.createChallengeOption(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(challengeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChallengeOption = async (req, res) => {
  try {
    const challengeOption = await ChallengeOptionsService.updateChallengeOption(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(challengeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChallengeOption = async (req, res) => {
  try {
    const challengeOption = await ChallengeOptionsService.deleteChallengeOption(
      Number(req.params.id)
    );
    res.status(200).json(challengeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllChallengeOptions,
  getChallengeOptions,
  createChallengeOption,
  updateChallengeOption,
  deleteChallengeOption,
};
