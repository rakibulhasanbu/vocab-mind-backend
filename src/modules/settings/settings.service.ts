import { settingsRepository } from "./settings.repository.js";
import type { UpdateSettingsInput } from "./settings.schema.js";

export const settingsService = {
  get(userId: string) {
    return settingsRepository.findOrCreate(userId);
  },

  update(userId: string, input: UpdateSettingsInput) {
    return settingsRepository.update(userId, input);
  },
};
