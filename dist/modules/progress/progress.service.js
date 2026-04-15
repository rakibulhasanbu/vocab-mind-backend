import { progressRepository } from "./progress.repository.js";
export const progressService = {
    async get(userId) {
        const [mastery, totalWords, mostMissed, weeklyStats, monthlyActivity, settings] = await Promise.all([
            progressRepository.masteryBreakdown(userId),
            progressRepository.totalWords(),
            progressRepository.mostMissed(userId),
            progressRepository.weeklyStats(userId),
            progressRepository.monthlyActivity(userId),
            progressRepository.settings(userId),
        ]);
        return {
            masteryBreakdown: mastery.map((m) => ({ status: m.status, count: m._count._all })),
            totalWords,
            mostMissed,
            weeklyStats,
            monthlyActivity,
            settings: settings ?? null,
        };
    },
};
