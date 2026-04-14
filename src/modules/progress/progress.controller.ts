import type { Context } from "hono";
import { progressService } from "./progress.service.js";

export const progressController = {
  async get(c: Context) {
    const { userId } = c.get("user");
    return c.json(await progressService.get(userId));
  },
};
