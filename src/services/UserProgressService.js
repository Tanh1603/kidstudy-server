import BaseService from "./BaseService.js";
import UserProgressRepository from "../repositories/UserProgressRepository.js";

class UserProgressService extends BaseService {
  constructor() {
    super(new UserProgressRepository());
  }

  async getUserProfile(userId) {
    let userProfile = await this.repository.findByUserId(userId);

    if (!userProfile) {
      // Create new user profile if it doesn't exist
      userProfile = await this.repository.create({
        userId,
        userName: "User",
        userImageSrc: "/avatar.png",
        hearts: 5,
        points: 0,
      });
    }

    return userProfile;
  }

  async getUserChallengeProgress(userId) {
    return await this.repository.getUserChallengeProgress(userId);
  }

  async updateChallengeProgress(userId, challengeId, completed) {
    return await this.repository.updateChallengeProgress(
      userId,
      challengeId,
      completed
    );
  }

  async updateHearts(userId, hearts) {
    const userProfile = await this.getUserProfile(userId);
    return await this.repository.updateHearts(userId, hearts);
  }

  async updatePoints(userId, points) {
    const userProfile = await this.getUserProfile(userId);
    return await this.repository.updatePoints(userId, points);
  }

  async updateActiveUnit(userId, activeUnitId) {
    const userProfile = await this.getUserProfile(userId);
    return await this.repository.updateActiveUnit(userId, activeUnitId);
  }
}

export default UserProgressService;
