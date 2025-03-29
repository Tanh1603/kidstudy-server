import BaseService from "./BaseService.js";
import UnitRepository from "../repositories/UnitRepository.js";

class UnitService extends BaseService {
  constructor() {
    super(new UnitRepository());
  }

  async getAllUnitsWithLessons() {
    return await this.repository.getUnitsWithLessons();
  }

  async getUnitWithLessons(id) {
    const unit = await this.repository.getUnitWithLessons(id);
    if (!unit) {
      throw new Error("Unit not found");
    }
    return unit;
  }
}

export default UnitService;
