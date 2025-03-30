import express from "express";
import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, asc, exists, not } from "drizzle-orm";

const fixRouter = express.Router();
// get user progress
fixRouter.get("/user-progress", async (req, res) => {
  const userId = req.query.userId;
  const userProgress = await getUserProgess(userId);
  res.send(userProgress);
});

const getUserProgess = async (userId) => {
  if (!userId) return null;

  const data = await db.query.userProgress.findFirst({
    where: eq(schema.userProgress.userId, userId),
  });

  return data;
};

// get course progress
fixRouter.get("/unit-progress", async (req, res) => {
  try {
    const userId = req.query.userId;
    // const unitProgress = await getUnitProgress(userId);
    const unitProgress = await getFirstIncompleteLesson(userId);
    res.send(unitProgress);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// export const getFirstIncompleteLesson = async (userId) => {
//   const unitsInActiveCourse = await db.query.units.findMany({
//     orderBy: [asc(schema.units.order)],
//     with: {
//       lessons: {
//         orderBy: [asc(schema.lessons.order)],
//         with: {
//           unit: true,
//           challenges: {
//             with: {
//               challengeProgress: {
//                 where: eq(schema.challengeProgress.userId, userId),
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const firstUncompletedLesson = unitsInActiveCourse
//     .flatMap((unit) => unit.lessons)
//     .find((lesson) => {
//       return lesson.challenges.some((challenge) => {
//         return (
//           !challenge.challengeProgress ||
//           challenge.challengeProgress.length === 0 ||
//           challenge.challengeProgress.some((progress) => !progress.completed)
//         );
//       });
//     });

//   return {
//     activeLesson: firstUncompletedLesson,
//     activeLessonId: firstUncompletedLesson?.id,
//   };
// };

export const getFirstIncompleteLesson = async (userId) => {
  // Lấy lessons với điều kiện where ngay từ đầu để hiệu quả hơn
  const lessons = await db.query.lessons.findMany({
    orderBy: [asc(schema.lessons.order)],
    with: {
      unit: true,
      challenges: {
        orderBy: [asc(schema.challenges.order)],
        with: {
          challengeProgress: {
            where: eq(schema.challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  // Kiểm tra challenge chưa hoàn thành với logic rõ ràng hơn
  const firstIncompleteLesson = lessons.find((lesson) => {
    // Đảm bảo lesson có challenges
    if (!lesson.challenges || lesson.challenges.length === 0) {
      return {
        activeLesson: null,
        activeLessonId: null,
      };
    }

    // Log thông tin để debug
    console.log(
      `Checking lesson ${lesson.id} with ${lesson.challenges.length} challenges`
    );

    return lesson.challenges.some((challenge) => {
      // Kiểm tra chi tiết từng challenge
      const hasNoProgress =
        !challenge.challengeProgress ||
        challenge.challengeProgress.length === 0;
      const hasIncompleteProgress =
        challenge.challengeProgress &&
        challenge.challengeProgress.some((p) => p && p.completed === false);

      return hasNoProgress || hasIncompleteProgress;
    });
  });

  return {
    activeLesson: firstIncompleteLesson || null,
    activeLessonId: firstIncompleteLesson?.id || null,
  };
};

// get unit
fixRouter.get("/units", async (req, res) => {
  const userId = req.query.userId;
  const units = await getUnits(userId);
  res.send(units);
});

export const getUnits = async (userId) => {
  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    with: {
      lessons: {
        orderBy: [asc(schema.lessons.order)],
        with: {
          challenges: {
            orderBy: [asc(schema.challenges.order)],
            with: {
              challengeProgress: {
                where: eq(schema.challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0)
        return { ...lesson, completed: false };

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
};

// get lesson
fixRouter.get("/lesson/:id", async (req, res) => {
  const lessonId = req.params.id;
  const userId = req.query.userId;
  const lesson = await getLesson(lessonId, userId);
  res.send(lesson);
});

export const getLesson = async (lessonId, userId) => {
  const data = await db.query.lessons.findFirst({
    where: eq(schema.lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: [asc(schema.challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(schema.challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
};

// get lesson percentage
fixRouter.get("/lesson-percentage", async (req, res) => {
  const userId = req.query.userId;
  const lessonPercentage = await getLessonPercentage(userId);
  res.json({ percentage: lessonPercentage });
});

export const getLessonPercentage = async (userId) => {
  const courseProgress = await getFirstIncompleteLesson(userId);

  if (!courseProgress?.activeLessonId) return 0;

  const lesson = await getLesson(courseProgress?.activeLessonId, userId);

  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  console.log("percentage", percentage);

  return percentage;
};//


export default fixRouter;
