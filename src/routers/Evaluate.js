import express from "express";
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const evaluateText = express.Router();

// ✅ API đánh giá phát âm tiếng Anh bằng Cohere
evaluateText.post("/evaluate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Thiếu văn bản để đánh giá." });
    }

    const response = await cohere.generate({
    model: "command", // Mô hình hợp lệ
    prompt: `Chấm điểm phát âm tiếng Anh từ 1 đến 10 và đưa ra nhận xét:\n\n"${text}"`,
    max_tokens: 100
    });

    res.json({ message: "Đánh giá phát âm thành công.", feedback: response.generations[0].text });
  } catch (error) {
    console.error("Lỗi xử lý AI:", error);
    res.status(500).json({ error: error.message });
  }
});

export default evaluateText;
