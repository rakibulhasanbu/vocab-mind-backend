import type { Context } from "hono";
import { getValidated } from "../../middleware/validate.js";
import type { InitializeWordInput, SubmitReviewInput } from "./session.schema.js";
import { sessionService } from "./session.service.js";

export const sessionController = {
  async getQueue(c: Context) {
    const { userId } = c.get("user");
    return c.json(await sessionService.getQueue(userId));
  },

  async submitReview(c: Context) {
    const { userId } = c.get("user");
    const input = getValidated<SubmitReviewInput>(c, "json");
    return c.json(await sessionService.submitReview(userId, input));
  },

  async initializeWord(c: Context) {
    const { userId } = c.get("user");
    const input = getValidated<InitializeWordInput>(c, "json");
    return c.json(await sessionService.initializeWord(userId, input));
  },
};
