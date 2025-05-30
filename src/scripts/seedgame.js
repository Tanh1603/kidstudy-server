import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";

dotenv.config({ path: ".env.development" });
const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Seed topics
    console.log("Inserting topics...");
    const topics = await db
      .insert(schema.topics)
      .values([
        {
          title: "Động vật",
          icon: "🐾",
        },
        {
          title: "Trái cây",
          icon: "🍎",
        },
        {
          title: "Phương tiện giao thông",
          icon: "🚗",
        },
        {
          title: "Âm nhạc",
          icon: "🎵",
        },
        {
          title: "Đồ vật",
          icon: "📱",
        },
      ])
      .returning();

    console.log(`✅ Inserted ${topics.length} topics`);

    // Seed game questions
    console.log("Inserting game questions...");
    const gameQuestions = await db
      .insert(schema.gameQuestions)
      .values([
        // ANAGRAM - Sắp xếp chữ cái (có word và image)
        {
          gameType: "ANAGRAM",
          topicId: topics[0].id, // Động vật
          difficulty: "EASY",
          word: "CAT",
          imageSrc: "/images/animals/cat.jpg",
        },
        {
          gameType: "ANAGRAM",
          topicId: topics[0].id, // Động vật
          difficulty: "MEDIUM",
          word: "ELEPHANT",
          imageSrc: "/images/animals/elephant.jpg",
        },
        {
          gameType: "ANAGRAM",
          topicId: topics[1].id, // Trái cây
          difficulty: "EASY",
          word: "APPLE",
          imageSrc: "/images/fruits/apple.jpg",
        },
        {
          gameType: "ANAGRAM",
          topicId: topics[2].id, // Phương tiện
          difficulty: "HARD",
          word: "MOTORCYCLE",
          imageSrc: "/images/transport/motorcycle.jpg",
        },

        // MATCH_UP - Ghép đôi (có word và image)
        {
          gameType: "MATCH_UP",
          topicId: topics[0].id, // Động vật
          difficulty: "EASY",
          word: "DOG",
          imageSrc: "/images/animals/dog.jpg",
        },
        {
          gameType: "MATCH_UP",
          topicId: topics[1].id, // Trái cây
          difficulty: "EASY",
          word: "BANANA",
          imageSrc: "/images/fruits/banana.jpg",
        },
        {
          gameType: "MATCH_UP",
          topicId: topics[2].id, // Phương tiện
          difficulty: "MEDIUM",
          word: "AIRPLANE",
          imageSrc: "/images/transport/airplane.jpg",
        },
        {
          gameType: "MATCH_UP",
          topicId: topics[1].id, // Trái cây
          difficulty: "HARD",
          word: "DRAGONFRUIT",
          imageSrc: "/images/fruits/dragonfruit.jpg",
        },

        // MEMORY - WORD_IMAGE (word + image + matchText)
        {
          gameType: "MEMORY",
          topicId: topics[0].id, // Động vật
          difficulty: "EASY",
          memoryType: "WORD_IMAGE",
          word: "LION",
          imageSrc: "/images/animals/lion.jpg",
          matchText: "Sư tử - vua của các loài động vật",
        },
        {
          gameType: "MEMORY",
          topicId: topics[1].id, // Trái cây
          difficulty: "MEDIUM",
          memoryType: "WORD_IMAGE",
          word: "ORANGE",
          imageSrc: "/images/fruits/orange.jpg",
          matchText: "Cam - trái cây giàu vitamin C",
        },

        // MEMORY - WORD_AUDIO (word + audio + matchText)
        {
          gameType: "MEMORY",
          topicId: topics[3].id, // Âm nhạc
          difficulty: "MEDIUM",
          memoryType: "WORD_AUDIO",
          word: "PIANO",
          audioSrc: "/audio/instruments/piano.mp3",
          matchText: "Đàn piano - nhạc cụ có phím đen trắng",
        },
        {
          gameType: "MEMORY",
          topicId: topics[0].id, // Động vật
          difficulty: "EASY",
          memoryType: "WORD_AUDIO",
          word: "BIRD",
          audioSrc: "/audio/animals/bird_chirp.mp3",
          matchText: "Chim - động vật có thể bay và hót",
        },

        // MEMORY - IMAGE_AUDIO (word + image + audio + matchText)
        {
          gameType: "MEMORY",
          topicId: topics[3].id, // Âm nhạc
          difficulty: "HARD",
          memoryType: "IMAGE_AUDIO",
          word: "GUITAR",
          imageSrc: "/images/instruments/guitar.jpg",
          audioSrc: "/audio/instruments/guitar.mp3",
          matchText: "Đàn ghi-ta - nhạc cụ có dây",
        },
        {
          gameType: "MEMORY",
          topicId: topics[2].id, // Phương tiện
          difficulty: "HARD",
          memoryType: "IMAGE_AUDIO",
          word: "HELICOPTER",
          imageSrc: "/images/transport/helicopter.jpg",
          audioSrc: "/audio/transport/helicopter.mp3",
          matchText: "Trực thăng - máy bay có cánh quạt",
        },

        // MEMORY - WORD_WORD (word + matchText)
        {
          gameType: "MEMORY",
          topicId: topics[0].id, // Động vật
          difficulty: "MEDIUM",
          memoryType: "WORD_WORD",
          word: "WHALE",
          matchText:
            "Cá voi - động vật có vú lớn nhất thế giới, sống ở đại dương",
        },
        {
          gameType: "MEMORY",
          topicId: topics[4].id, // Đồ vật
          difficulty: "EASY",
          memoryType: "WORD_WORD",
          word: "PHONE",
          matchText: "Điện thoại - thiết bị dùng để liên lạc từ xa",
        },

        // SPELLING_BEE - Thi đánh vần (word + image + audio)
        {
          gameType: "SPELLING_BEE",
          topicId: topics[0].id, // Động vật
          difficulty: "EASY",
          word: "RABBIT",
          imageSrc: "/images/animals/rabbit.jpg",
          audioSrc: "/audio/pronunciation/rabbit.mp3",
        },
        {
          gameType: "SPELLING_BEE",
          topicId: topics[1].id, // Trái cây
          difficulty: "MEDIUM",
          word: "STRAWBERRY",
          imageSrc: "/images/fruits/strawberry.jpg",
          audioSrc: "/audio/pronunciation/strawberry.mp3",
        },
        {
          gameType: "SPELLING_BEE",
          topicId: topics[2].id, // Phương tiện
          difficulty: "HARD",
          word: "AMBULANCE",
          imageSrc: "/images/transport/ambulance.jpg",
          audioSrc: "/audio/pronunciation/ambulance.mp3",
        },
        {
          gameType: "SPELLING_BEE",
          topicId: topics[3].id, // Âm nhạc
          difficulty: "HARD",
          word: "SAXOPHONE",
          imageSrc: "/images/instruments/saxophone.jpg",
          audioSrc: "/audio/pronunciation/saxophone.mp3",
        },
        {
          gameType: "SPELLING_BEE",
          topicId: topics[4].id, // Đồ vật
          difficulty: "MEDIUM",
          word: "COMPUTER",
          imageSrc: "/images/objects/computer.jpg",
          audioSrc: "/audio/pronunciation/computer.mp3",
        },
      ])
      .returning();

    console.log(`✅ Inserted ${gameQuestions.length} game questions`);

    // Log summary
    console.log("\n📊 Seeding Summary:");
    console.log(`Topics: ${topics.length}`);
    console.log(`Game Questions: ${gameQuestions.length}`);

    // Count by game type
    const gameTypeCounts = gameQuestions.reduce((acc, q) => {
      acc[q.gameType] = (acc[q.gameType] || 0) + 1;
      return acc;
    }, {});

    console.log("\nGame Questions by Type:");
    Object.entries(gameTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Count memory types
    const memoryQuestions = gameQuestions.filter(
      (q) => q.gameType === "MEMORY"
    );
    const memoryTypeCounts = memoryQuestions.reduce((acc, q) => {
      acc[q.memoryType] = (acc[q.memoryType] || 0) + 1;
      return acc;
    }, {});

    console.log("\nMemory Questions by Type:");
    Object.entries(memoryTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await sql.end();
  }
};

main().catch((err) => {
  console.error("❌ Seed script failed:", err);
  process.exit(1);
});
