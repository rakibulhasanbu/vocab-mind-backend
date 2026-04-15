import { prisma } from "../../db/prisma.js";
export const wordsRepository = {
    async list(userId, q) {
        const wordWhere = {};
        if (q.category)
            wordWhere.category = q.category;
        if (q.search) {
            wordWhere.OR = [
                { word: { contains: q.search, mode: "insensitive" } },
                { bangla: { contains: q.search, mode: "insensitive" } },
            ];
        }
        if (q.bookmarked) {
            wordWhere.wordProgress = { some: { userId, isBookmarked: true } };
        }
        if (q.status && q.status !== "new") {
            wordWhere.wordProgress = {
                some: { userId, status: q.status, ...(q.bookmarked ? { isBookmarked: true } : {}) },
            };
        }
        else if (q.status === "new") {
            // "new" means: no progress row, or status=new
            wordWhere.OR = [
                ...(wordWhere.OR ?? []),
                { wordProgress: { none: { userId } } },
                { wordProgress: { some: { userId, status: "new" } } },
            ];
        }
        const rows = await prisma.word.findMany({
            where: wordWhere,
            include: { wordProgress: { where: { userId }, take: 1 } },
            orderBy: { word: "asc" },
            take: q.limit,
            skip: q.offset,
        });
        return rows.map((w) => ({
            word: { ...w, wordProgress: undefined },
            progress: w.wordProgress[0] ?? null,
        }));
    },
    async byId(userId, id) {
        const w = await prisma.word.findUnique({
            where: { id },
            include: { wordProgress: { where: { userId }, take: 1 } },
        });
        if (!w)
            return null;
        return { word: { ...w, wordProgress: undefined }, progress: w.wordProgress[0] ?? null };
    },
    categories() {
        return prisma.word.groupBy({
            by: ["category"],
            _count: { _all: true },
            orderBy: { category: "asc" },
        });
    },
    random(excludeId, count) {
        // Postgres-specific: ORDER BY random() via raw query for true randomness.
        return prisma.$queryRaw `SELECT id, word, bangla, definition, part_of_speech
       FROM words
       WHERE id <> ${excludeId}
       ORDER BY random()
       LIMIT ${count}`;
    },
};
