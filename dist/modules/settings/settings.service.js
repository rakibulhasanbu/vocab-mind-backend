import { settingsRepository } from "./settings.repository.js";
export const settingsService = {
    get(userId) {
        return settingsRepository.findOrCreate(userId);
    },
    update(userId, input) {
        return settingsRepository.update(userId, input);
    },
};
