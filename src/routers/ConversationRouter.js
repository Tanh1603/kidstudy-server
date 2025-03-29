import express from "express";
import {
  getConservation,
  getConservationById,
  createConservation,
  updateConservation,
  deleteConservation,
  getAllMessages,
  addMessage,
  updateMessage,
} from "../controllers/ConversationController.js";


const conservationRouter = express.Router();

conservationRouter.get("/", getConservation);
conservationRouter.get("/:id", getConservationById);
conservationRouter.post("/", createConservation);
conservationRouter.put("/:id", updateConservation);
conservationRouter.delete("/:id", deleteConservation);

// Messages
conservationRouter.get("/:id/messages", getAllMessages);
conservationRouter.post("/:id/messages", addMessage);
conservationRouter.put("/:id/messages/:messageId", updateMessage);

export default conservationRouter;
