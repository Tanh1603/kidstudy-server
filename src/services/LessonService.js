import BaseService from "./BaseService.js";
import LessonRepository from "../repositories/LessonRepository.js";

class LessonService extends BaseService {
  constructor() {
    super(new LessonRepository());
  }

  async getLessonsByUnitId(unitId) {
    return await this.repository.getLessonsByUnitId(unitId);
  }

  async getLessonWithChallenges(id) {
    const lesson = await this.repository.getLessonWithChallenges(id);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    return lesson;
  }
}

export default LessonService;
