import * as ConservationService from "../services/ConversationService.js";
// Conservation
const getConservation = async (req, res) => {
  try {
    const conservation = await ConservationService.getConservation();
    res.status(200).json(conservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const conservation = await ConservationService.getConservationById(id);
    res.status(200).json(conservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConservation = async (req, res) => {
  try {
    const conservation = await ConservationService.createConservation(req.body);
    res.status(201).json(conservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateConservation = async (req, res) => {
  const { id } = req.params;
  try {
    const conservation = await ConservationService.updateConservation(
      id,
      req.body
    );
    res.status(200).json(conservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteConservation = async (req, res) => {
  const { id } = req.params;
  try {
    const conservation = await ConservationService.deleteConservation(id);
    res.status(200).json(conservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await ConservationService.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const message = await ConservationService.addMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await ConservationService.updateMessage(id, req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getConservation,
  getConservationById,
  createConservation,
  updateConservation,
  deleteConservation,
  getAllMessages,
  addMessage,
  updateMessage,
};
