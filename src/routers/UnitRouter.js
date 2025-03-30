import express from "express";
import {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
  isUnitCompleted,
  getAllUnitsForUser,
} from "../controllers/UnitController.js";
const adminUnitRouter = express.Router();
const userUnitRouter = express.Router();

adminUnitRouter.get("/", getUnits);
adminUnitRouter.get("/:id", getUnitById);
adminUnitRouter.post("/", createUnit);
adminUnitRouter.put("/:id", updateUnit);
adminUnitRouter.delete("/:id", deleteUnit);
adminUnitRouter.get("/:id/is-completed", isUnitCompleted);

userUnitRouter.get("/", getAllUnitsForUser);

export { adminUnitRouter, userUnitRouter };
