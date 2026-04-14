import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma.js";

export const sessionRepository = {
  getSettings(userId: string) {
    return prisma.setting.findUnique({ where: { userId } });
  },

  getDueWords(userId: string) {
    return prisma.wordProgress.findMany({
      where: {
        userId,
        nextReviewAt: { lte: new Date() },
        intervalDays: { gt: 0 },
      },
      include: { word: true },
      orderBy: [
        { isBookmarked: "desc" },
        { missCount: "desc" },
        { nextReviewAt: "asc" },
      ],
    });
  },

  async getNewWords(userId: string, limit: number) {
    // Words the user has never touched, OR have status=new.
    return prisma.word.findMany({
      where: {
        OR: [
          { wordProgress: { none: { userId } } },
          { wordProgress: { some: { userId, status: "new" } } },
        ],
      },
      take: limit,
      include: {
        wordProgress: { where: { userId }, take: 1 },
      },
    });
  },

  findProgress(userId: string, wordId: number) {
    return prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });
  },

  createProgress(data: Prisma.WordProgressUncheckedCreateInput) {
    return prisma.wordProgress.create({ data });
  },

  updateProgress(id: number, data: Prisma.WordProgressUpdateInput) {
    return prisma.wordProgress.update({ where: { id }, data });
  },

  insertReview(data: Prisma.ReviewUncheckedCreateInput) {
    return prisma.review.create({ data });
  },

  getTodayStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prisma.dailyStat.findUnique({
      where: { userId_date: { userId, date: today } },
    });
  },

  upsertDailyStat(userId: string, isCorrect: boolean) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prisma.dailyStat.upsert({
      where: { userId_date: { userId, date: today } },
      create: {
        userId,
        date: today,
        reviewsCompleted: 1,
        correctReviews: isCorrect ? 1 : 0,
        streakDay: true,
      },
      update: {
        reviewsCompleted: { increment: 1 },
        correctReviews: { increment: isCorrect ? 1 : 0 },
        streakDay: true,
      },
    });
  },
};
