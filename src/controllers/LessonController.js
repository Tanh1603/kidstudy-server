import * as LessonService from "../services/LessonService.js";

const getLessons = async (req, res) => {
  try {
    const lessons = await LessonService.getAllLessons();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonById = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await LessonService.getLessonById(id);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const lesson = await LessonService.createLesson(req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await LessonService.updateLesson(id, req.body);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await LessonService.deleteLesson(id);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isLessonCompleted = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  try {
    const isCompleted = await LessonService.isLessonCompleted(userId, id);
    res.status(200).json(isCompleted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// user
const getFirstIncompleteLesson = async (req, res) => {
  try {
    const { userId } = req.query;
    const firstIncompleteLesson = await LessonService.getFirstIncompleteLesson(
      userId
    );
    res.status(200).json(firstIncompleteLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonPercentage = async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    const lessonPercentage = await LessonService.getLessonPercentage(
      id,
      userId
    );
    res.status(200).json(lessonPercentage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  isLessonCompleted,
  getFirstIncompleteLesson,
  getLessonPercentage,
};
