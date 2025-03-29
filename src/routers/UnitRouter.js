import express from "express";
import {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
  isUnitCompleted,
} from "../controllers/UnitController.js";
const unitRouter = express.Router();

unitRouter.get("/", getUnits);
unitRouter.get("/:id", getUnitById);
unitRouter.post("/", createUnit);
unitRouter.put("/:id", updateUnit);
unitRouter.delete("/:id", deleteUnit);
unitRouter.get("/:id/is-completed", isUnitCompleted);

export default unitRouter;
