import { prisma } from "../../db/prisma.js";
function daysAgo(n) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
}
export const progressRepository = {
    masteryBreakdown(userId) {
        return prisma.wordProgress.groupBy({
            by: ["status"],
            where: { userId },
            _count: { _all: true },
        });
    },
    totalWords() {
        return prisma.word.count();
    },
    async mostMissed(userId, limit = 10) {
        const rows = await prisma.wordProgress.findMany({
            where: { userId, missCount: { gt: 0 } },
            include: { word: true },
            orderBy: { missCount: "desc" },
            take: limit,
        });
        return rows.map(({ word, ...progress }) => ({ word, progress }));
    },
    weeklyStats(userId) {
        return prisma.dailyStat.findMany({
            where: { userId, date: { gte: daysAgo(7) } },
            orderBy: { date: "asc" },
        });
    },
    monthlyActivity(userId) {
        return prisma.dailyStat.findMany({
            where: { userId, date: { gte: daysAgo(30) } },
            orderBy: { date: "asc" },
        });
    },
    settings(userId) {
        return prisma.setting.findUnique({ where: { userId } });
    },
};
