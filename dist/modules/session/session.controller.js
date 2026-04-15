import { getValidated } from "../../middleware/validate.js";
import { sessionService } from "./session.service.js";
export const sessionController = {
    async getQueue(c) {
        const { userId } = c.get("user");
        return c.json(await sessionService.getQueue(userId));
    },
    async submitReview(c) {
        const { userId } = c.get("user");
        const input = getValidated(c, "json");
        return c.json(await sessionService.submitReview(userId, input));
    },
    async initializeWord(c) {
        const { userId } = c.get("user");
        const input = getValidated(c, "json");
        return c.json(await sessionService.initializeWord(userId, input));
    },
};
