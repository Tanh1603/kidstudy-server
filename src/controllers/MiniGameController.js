import {
  getRandomGameQuestions,
  createGameQuestion,
  deleteGameQuestion,
  getGameQuestions,
  updateGameQuestion,
} from "../services/MiniGameService.js";

const getRandomGameQuestionsController = async (req, res) => {
  const { gameType, difficulty, topicId, limit } = req.query;
  const gameQuestions = await getRandomGameQuestions(
    gameType,
    difficulty,
    topicId,
    limit ? parseInt(limit, 10) : 20
  );
  res.status(200).json(gameQuestions);
};

const getGameQuestionsController = async (req, res) => {
  try {
    const { gameType } = req.query;
    console.log(gameType);

    const response = await getGameQuestions(gameType);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching game questions:", error);
    res
      .status(500)
      .json({ error: `Failed to fetch game questions: ${error.message}` });
  }
};

const createGameQuestionController = async (req, res) => {
  try {
    const newGameQuestion = await createGameQuestion(req);
    res.status(201).json(newGameQuestion);
  } catch (error) {
    console.error("Error creating game question:", error);
    res.status(500).json({ error: "Failed to create game question" });
  }
};

const updateGameQuestionController = async (req, res) => {
  try {
    const response = await updateGameQuestion(req);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating game question:", error);
    res
      .status(500)
      .json({ error: `Failed to update game question: ${error.message}` });
  }
};

const deleteGameQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGameQuestion(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting game question:", error);
    res
      .status(500)
      .json({ error: `Failed to delete game question: ${error.message}` });
  }
};

export {
  getRandomGameQuestionsController,
  getGameQuestionsController,
  createGameQuestionController,
  updateGameQuestionController,
  deleteGameQuestionController,
};
