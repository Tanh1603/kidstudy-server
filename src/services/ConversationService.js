import BaseService from "./BaseService.js";
import ConversationRepository from "../repositories/ConversationRepository.js";

class ConversationService extends BaseService {
  constructor() {
    super(new ConversationRepository());
  }

  async getUserConversations(userId) {
    return await this.repository.getConversationsByUserId(userId);
  }

  async getConversationWithMessages(id) {
    const conversation = await this.repository.getConversationWithMessages(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation;
  }

  async createConversation(userId) {
    return await this.repository.create({
      userId,
      createdAt: new Date(),
    });
  }

  async addMessage(conversationId, sender, text, audioUrl = null) {
    // Validate sender
    if (sender !== "user" && sender !== "bot") {
      throw new Error("Invalid sender value");
    }

    return await this.repository.addMessage(
      conversationId,
      sender,
      text,
      audioUrl
    );
  }
}

export default ConversationService;
