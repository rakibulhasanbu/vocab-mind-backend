import { calculateNextReview } from "../../lib/srs.js";
import { sessionRepository } from "./session.repository.js";
export const sessionService = {
    async getQueue(userId) {
        const [settings, dueWords, todayStats] = await Promise.all([
            sessionRepository.getSettings(userId),
            sessionRepository.getDueWords(userId),
            sessionRepository.getTodayStats(userId),
        ]);
        const dailyLimit = settings?.dailyNewWords ?? 7;
        const newWordsRaw = await sessionRepository.getNewWords(userId, dailyLimit);
        const newWords = newWordsRaw.map((w) => ({
            word: { ...w, wordProgress: undefined },
            progress: w.wordProgress[0] ?? null,
        }));
        return {
            dueWords: dueWords.map(({ word, ...progress }) => ({ word, progress })),
            newWords,
            todayStats: todayStats ?? null,
            settings: settings ?? null,
            reviewCount: dueWords.length,
            newCount: newWords.length,
        };
    },
    async submitReview(userId, input) {
        const existing = await sessionRepository.findProgress(userId, input.wordId);
        if (!existing) {
            const srs = calculateNextReview({
                easeFactor: 2.5,
                intervalDays: 0,
                streak: 0,
                missCount: 0,
                status: "new",
                isBookmarked: false,
            }, input.rating);
            await sessionRepository.createProgress({
                userId,
                wordId: input.wordId,
                status: srs.status,
                easeFactor: srs.easeFactor,
                intervalDays: srs.intervalDays,
                nextReviewAt: srs.nextReviewAt,
                streak: srs.streak,
                missCount: srs.missCount,
                reviewCount: 1,
                correctCount: input.isCorrect ? 1 : 0,
                lastReviewAt: new Date(),
                introducedAt: new Date(),
            });
        }
        else {
            const srs = calculateNextReview({
                easeFactor: existing.easeFactor,
                intervalDays: existing.intervalDays,
                streak: existing.streak,
                missCount: existing.missCount,
                status: existing.status,
                isBookmarked: existing.isBookmarked,
            }, input.rating);
            const shouldAutoBookmark = srs.missCount >= 3 && !existing.isBookmarked;
            const shouldRemoveBookmark = existing.isBookmarked && srs.streak >= 5;
            await sessionRepository.updateProgress(existing.id, {
                status: srs.status,
                easeFactor: srs.easeFactor,
                intervalDays: srs.intervalDays,
                nextReviewAt: srs.nextReviewAt,
                streak: srs.streak,
                missCount: srs.missCount,
                reviewCount: { increment: 1 },
                correctCount: { increment: input.isCorrect ? 1 : 0 },
                lastReviewAt: new Date(),
                isBookmarked: shouldAutoBookmark
                    ? true
                    : shouldRemoveBookmark
                        ? false
                        : existing.isBookmarked,
            });
        }
        await sessionRepository.insertReview({
            userId,
            wordId: input.wordId,
            exerciseType: input.exerciseType,
            isCorrect: input.isCorrect,
            rating: input.rating,
            responseTimeMs: input.responseTimeMs,
        });
        await sessionRepository.upsertDailyStat(userId, input.isCorrect);
        return { ok: true };
    },
    async initializeWord(userId, input) {
        const existing = await sessionRepository.findProgress(userId, input.wordId);
        if (existing)
            return { ok: true, created: false };
        await sessionRepository.createProgress({
            userId,
            wordId: input.wordId,
            status: "new",
            introducedAt: new Date(),
        });
        return { ok: true, created: true };
    },
};
