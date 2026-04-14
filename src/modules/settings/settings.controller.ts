import type { Context } from "hono";
import { getValidated } from "../../middleware/validate.js";
import type { UpdateSettingsInput } from "./settings.schema.js";
import { settingsService } from "./settings.service.js";

export const settingsController = {
  async get(c: Context) {
    const { userId } = c.get("user");
    return c.json(await settingsService.get(userId));
  },

  async update(c: Context) {
    const { userId } = c.get("user");
    const input = getValidated<UpdateSettingsInput>(c, "json");
    return c.json(await settingsService.update(userId, input));
  },
};
