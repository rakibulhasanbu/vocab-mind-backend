import { getValidated } from "../../middleware/validate.js";
import { bookmarksService } from "./bookmarks.service.js";
export const bookmarksController = {
    async list(c) {
        const { userId } = c.get("user");
        return c.json(await bookmarksService.list(userId));
    },
    async toggle(c) {
        const { userId } = c.get("user");
        const { wordId } = getValidated(c, "json");
        return c.json(await bookmarksService.toggle(userId, wordId));
    },
};
