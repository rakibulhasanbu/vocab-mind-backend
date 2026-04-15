import { getValidated } from "../../middleware/validate.js";
import { wordsService } from "./words.service.js";
export const wordsController = {
    async list(c) {
        const { userId } = c.get("user");
        const q = getValidated(c, "query");
        return c.json(await wordsService.list(userId, q));
    },
    async categories(c) {
        return c.json(await wordsService.categories());
    },
    async random(c) {
        const q = getValidated(c, "query");
        return c.json(await wordsService.random(q));
    },
    async byId(c) {
        const { userId } = c.get("user");
        const { id } = getValidated(c, "param");
        return c.json(await wordsService.byId(userId, id));
    },
};
