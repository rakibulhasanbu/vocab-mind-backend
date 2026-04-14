import { prisma } from "../../db/prisma.js";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export const progressRepository = {
  masteryBreakdown(userId: string) {
    return prisma.wordProgress.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    });
  },

  totalWords() {
    return prisma.word.count();
  },

  async mostMissed(userId: string, limit = 10) {
    const rows = await prisma.wordProgress.findMany({
      where: { userId, missCount: { gt: 0 } },
      include: { word: true },
      orderBy: { missCount: "desc" },
      take: limit,
    });
    return rows.map(({ word, ...progress }) => ({ word, progress }));
  },

  weeklyStats(userId: string) {
    return prisma.dailyStat.findMany({
      where: { userId, date: { gte: daysAgo(7) } },
      orderBy: { date: "asc" },
    });
  },

  monthlyActivity(userId: string) {
    return prisma.dailyStat.findMany({
      where: { userId, date: { gte: daysAgo(30) } },
      orderBy: { date: "asc" },
    });
  },

  settings(userId: string) {
    return prisma.setting.findUnique({ where: { userId } });
  },
};
