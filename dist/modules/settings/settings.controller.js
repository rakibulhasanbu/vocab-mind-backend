import { getValidated } from "../../middleware/validate.js";
import { settingsService } from "./settings.service.js";
export const settingsController = {
    async get(c) {
        const { userId } = c.get("user");
        return c.json(await settingsService.get(userId));
    },
    async update(c) {
        const { userId } = c.get("user");
        const input = getValidated(c, "json");
        return c.json(await settingsService.update(userId, input));
    },
};
