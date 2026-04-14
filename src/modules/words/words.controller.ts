import type { Context } from "hono";
import { getValidated } from "../../middleware/validate.js";
import type { RandomWordsQuery, WordIdParam, WordsQuery } from "./words.schema.js";
import { wordsService } from "./words.service.js";

export const wordsController = {
  async list(c: Context) {
    const { userId } = c.get("user");
    const q = getValidated<WordsQuery>(c, "query");
    return c.json(await wordsService.list(userId, q));
  },

  async categories(c: Context) {
    return c.json(await wordsService.categories());
  },

  async random(c: Context) {
    const q = getValidated<RandomWordsQuery>(c, "query");
    return c.json(await wordsService.random(q));
  },

  async byId(c: Context) {
    const { userId } = c.get("user");
    const { id } = getValidated<WordIdParam>(c, "param");
    return c.json(await wordsService.byId(userId, id));
  },
};
