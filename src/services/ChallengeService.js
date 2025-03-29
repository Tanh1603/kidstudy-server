import BaseService from "./BaseService.js";
import ChallengeRepository from "../repositories/ChallengeRepository.js";

class ChallengeService extends BaseService {
  constructor() {
    super(new ChallengeRepository());
  }

  async getChallengesByLessonId(lessonId) {
    return await this.repository.getChallengesByLessonId(lessonId);
  }

  async getChallengeWithOptions(id) {
    const challenge = await this.repository.getChallengeWithOptions(id);
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    return challenge;
  }
}

export default ChallengeService;
