import { prisma } from "../../db/prisma.js";

export const bookmarksRepository = {
  findProgress(userId: string, wordId: number) {
    return prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });
  },

  updateBookmark(id: number, isBookmarked: boolean) {
    return prisma.wordProgress.update({ where: { id }, data: { isBookmarked } });
  },

  createBookmarked(userId: string, wordId: number) {
    return prisma.wordProgress.create({
      data: { userId, wordId, isBookmarked: true, introducedAt: new Date() },
    });
  },

  async listBookmarked(userId: string) {
    const rows = await prisma.wordProgress.findMany({
      where: { userId, isBookmarked: true },
      include: { word: true },
      orderBy: { missCount: "desc" },
    });
    return rows.map(({ word, ...progress }) => ({ word, progress }));
  },
};
