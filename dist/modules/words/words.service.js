import { notFound } from "../../utils/http-errors.js";
import { wordsRepository } from "./words.repository.js";
export const wordsService = {
    list(userId, q) {
        return wordsRepository.list(userId, q);
    },
    async byId(userId, id) {
        const row = await wordsRepository.byId(userId, id);
        if (!row)
            notFound("Word not found");
        return row;
    },
    async categories() {
        const rows = await wordsRepository.categories();
        return rows.map((r) => ({ category: r.category, count: r._count._all }));
    },
    random(q) {
        return wordsRepository.random(q.excludeId, q.count);
    },
};
