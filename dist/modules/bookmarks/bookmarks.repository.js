import { prisma } from "../../db/prisma.js";
export const bookmarksRepository = {
    findProgress(userId, wordId) {
        return prisma.wordProgress.findUnique({
            where: { userId_wordId: { userId, wordId } },
        });
    },
    updateBookmark(id, isBookmarked) {
        return prisma.wordProgress.update({ where: { id }, data: { isBookmarked } });
    },
    createBookmarked(userId, wordId) {
        return prisma.wordProgress.create({
            data: { userId, wordId, isBookmarked: true, introducedAt: new Date() },
        });
    },
    async listBookmarked(userId) {
        const rows = await prisma.wordProgress.findMany({
            where: { userId, isBookmarked: true },
            include: { word: true },
            orderBy: { missCount: "desc" },
        });
        return rows.map(({ word, ...progress }) => ({ word, progress }));
    },
};
