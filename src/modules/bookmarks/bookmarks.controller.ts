import type { Context } from "hono";
import { getValidated } from "../../middleware/validate.js";
import type { ToggleBookmarkInput } from "./bookmarks.schema.js";
import { bookmarksService } from "./bookmarks.service.js";

export const bookmarksController = {
  async list(c: Context) {
    const { userId } = c.get("user");
    return c.json(await bookmarksService.list(userId));
  },

  async toggle(c: Context) {
    const { userId } = c.get("user");
    const { wordId } = getValidated<ToggleBookmarkInput>(c, "json");
    return c.json(await bookmarksService.toggle(userId, wordId));
  },
};
