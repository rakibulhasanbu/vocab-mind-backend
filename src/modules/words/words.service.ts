import { notFound } from "../../utils/http-errors.js";
import { wordsRepository } from "./words.repository.js";
import type { RandomWordsQuery, WordsQuery } from "./words.schema.js";

export const wordsService = {
  list(userId: string, q: WordsQuery) {
    return wordsRepository.list(userId, q);
  },

  async byId(userId: string, id: number) {
    const row = await wordsRepository.byId(userId, id);
    if (!row) notFound("Word not found");
    return row!;
  },

  async categories() {
    const rows = await wordsRepository.categories();
    return rows.map((r) => ({ category: r.category, count: r._count._all }));
  },

  random(q: RandomWordsQuery) {
    return wordsRepository.random(q.excludeId, q.count);
  },
};
