import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { gameTypeEnum, memoryTypeEnum } from "../db/schema.js";
import {
  deleteFile,
  isCloudinaryUrl,
  uploadFile,
} from "../services/CloudinaryService.js";
import { asc, sql } from "drizzle-orm/sql";

const getRandomGameQuestions = async (gameType, difficulty, topicId, limit) => {
  const gameQuestions = await db.query.gameQuestions.findMany({
    where: and(
      eq(schema.gameQuestions.gameType, gameType),
      eq(schema.gameQuestions.difficulty, difficulty),
      eq(schema.gameQuestions.topicId, topicId)
    ),
    orderBy: sql`random()`,
    limit: limit,
  });
  return gameQuestions;
};

const getGameQuestions = async (gameType) => {
  if (!gameType) {
    throw new Error("Game type is required to fetch game questions.");
  }
  if (!gameTypeEnum.enumValues.includes(gameType)) {
    throw new Error("Invalid game type provided.");
  }
  const gameQuestions = await db.query.gameQuestions.findMany({
    where: and(eq(schema.gameQuestions.gameType, gameType)),
    orderBy: [asc(schema.gameQuestions.id)],
  });
  return gameQuestions;
};

const createGameQuestion = async (request) => {
  return await db.transaction(async (tx) => {
    const { body, files } = request;

    const imageFile = files?.imageSrc?.[0];
    const audioFile = files?.audioSrc?.[0];

    const [imageUrl, audioUrl] = await Promise.all([
      imageFile ? uploadFile(imageFile.buffer) : null,
      audioFile ? uploadFile(audioFile.buffer) : null,
    ]);

    const newQuestion = {
      ...body,
      memoryType: body?.memoryType || null,
      matchText: body?.matchText || null,
      word: body?.word || null,
      imageSrc: imageUrl,
      audioSrc: audioUrl,
    };

    const newGameQuestion = await db
      .insert(schema.gameQuestions)
      .values(newQuestion)
      .returning();

    return newGameQuestion[0];
  });
};

const updateGameQuestion = async (request) => {
  return await db.transaction(async (tx) => {
    const { id } = request.params;
    const { body, files } = request;

    if (!id) throw new Error("Game question ID is required for update.");

    const existingGameQuestion = await tx.query.gameQuestions.findFirst({
      where: eq(schema.gameQuestions.id, id),
    });

    if (!existingGameQuestion) throw new Error("Game question not found.");

    const memoryType = body.memoryType;
    const imageFile = files?.imageSrc?.[0];
    const audioFile = files?.audioSrc?.[0];
    const task = [];

    let newImageSrc = existingGameQuestion.imageSrc;
    let newAudioSrc = existingGameQuestion.audioSrc;

    const shouldDeleteImage =
      !!existingGameQuestion.imageSrc &&
      isCloudinaryUrl(existingGameQuestion.imageSrc);
    const shouldDeleteAudio =
      !!existingGameQuestion.audioSrc &&
      isCloudinaryUrl(existingGameQuestion.audioSrc);

    switch (existingGameQuestion.gameType) {
      case "MEMORY":
        if (body.memoryType !== existingGameQuestion.memoryType) {
          throw new Error("Cannot change memory type of an existing question.");
        }

        if (memoryType === memoryTypeEnum.enumValues[0]) {
          // image only
          if (!imageFile)
            throw new Error("Image is required for MEMORY (image) type.");
          if (shouldDeleteImage)
            task.push(deleteFile(existingGameQuestion.imageSrc));
          newAudioSrc = null;
          if (shouldDeleteAudio)
            task.push(deleteFile(existingGameQuestion.audioSrc));
          task.push(
            uploadFile(imageFile.buffer).then((res) => (newImageSrc = res))
          );
        } else if (memoryType === memoryTypeEnum.enumValues[1]) {
          // audio only
          if (!audioFile)
            throw new Error("Audio is required for MEMORY (audio) type.");
          if (shouldDeleteAudio)
            task.push(deleteFile(existingGameQuestion.audioSrc));
          newImageSrc = null;
          if (shouldDeleteImage)
            task.push(deleteFile(existingGameQuestion.imageSrc));
          task.push(
            uploadFile(audioFile.buffer).then((res) => (newAudioSrc = res))
          );
        } else if (memoryType === memoryTypeEnum.enumValues[2]) {
          // both
          if (imageFile) {
            if (shouldDeleteImage)
              task.push(deleteFile(existingGameQuestion.imageSrc));
            task.push(
              uploadFile(imageFile.buffer).then((res) => (newImageSrc = res))
            );
          }
          if (audioFile) {
            if (shouldDeleteAudio)
              task.push(deleteFile(existingGameQuestion.audioSrc));
            task.push(
              uploadFile(audioFile.buffer).then((res) => (newAudioSrc = res))
            );
          }
        }
        break;

      case "ANAGRAM":
      case "MATCH_UP":
        if (imageFile) {
          if (shouldDeleteImage)
            task.push(deleteFile(existingGameQuestion.imageSrc));
          task.push(
            uploadFile(imageFile.buffer).then((res) => (newImageSrc = res))
          );
        }
        break;

      case "SPELLING_BEE":
        if (imageFile) {
          if (shouldDeleteImage)
            task.push(deleteFile(existingGameQuestion.imageSrc));
          task.push(
            uploadFile(imageFile.buffer).then((res) => (newImageSrc = res))
          );
        }

        if (audioFile) {
          if (shouldDeleteAudio)
            task.push(deleteFile(existingGameQuestion.audioSrc));
          task.push(
            uploadFile(audioFile.buffer).then((res) => (newAudioSrc = res))
          );
        }
        break;

      default:
        throw new Error("Unsupported game type.");
    }

    await Promise.all(task);

    const updatedBody = {
      ...body,
      memoryType: body?.memoryType || existingGameQuestion.memoryType || null,
      matchText: body?.matchText || null,
      word: body?.word || null,
      imageSrc: newImageSrc,
      audioSrc: newAudioSrc,
    };

    const updatedGameQuestion = await tx
      .update(schema.gameQuestions)
      .set(updatedBody)
      .where(eq(schema.gameQuestions.id, id))
      .returning();

    return updatedGameQuestion[0];
  });
};

const deleteGameQuestion = async (id) => {
  return await db.transaction(async (tx) => {
    if (!id) {
      throw new Error("Game question ID is required for deletion.");
    }
    const existingGameQuestion = await tx.query.gameQuestions.findFirst({
      where: eq(schema.gameQuestions.id, id),
    });
    if (!existingGameQuestion) {
      throw new Error("Game question not found.");
    }

    const fileDeletionPromises = [];

    if (existingGameQuestion.imageSrc) {
      fileDeletionPromises.push(deleteFile(existingGameQuestion.imageSrc));
    }
    if (existingGameQuestion.audioSrc) {
      fileDeletionPromises.push(deleteFile(existingGameQuestion.audioSrc));
    }
    await Promise.all(fileDeletionPromises);

    await tx
      .delete(schema.gameQuestions)
      .where(eq(schema.gameQuestions.id, id))
      .returning();
  });
};

export {
  getRandomGameQuestions,
  createGameQuestion,
  updateGameQuestion,
  getGameQuestions,
  deleteGameQuestion,
};
