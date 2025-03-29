import * as UnitService from "../services/UnitService.js";

const getUnits = async (req, res) => {
    try {
        const units = await UnitService.getAllUnits();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnitById = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await UnitService.getUnitById(id);
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUnit = async (req, res) => {
  try {
    const unit = await UnitService.createUnit(req.body);
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUnit = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await UnitService.updateUnit(id, req.body);
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUnit = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await UnitService.deleteUnit(id);
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isUnitCompleted = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  try {
    const isCompleted = await UnitService.isUnitCompleted(userId, id);
    res.status(200).json(isCompleted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getUnits, getUnitById, createUnit, updateUnit, deleteUnit, isUnitCompleted };