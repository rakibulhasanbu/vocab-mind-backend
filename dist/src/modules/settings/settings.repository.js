import { prisma } from "../../db/prisma.js";
export const settingsRepository = {
    findOrCreate(userId) {
        return prisma.setting.upsert({
            where: { userId },
            create: { userId },
            update: {},
        });
    },
    update(userId, data) {
        return prisma.setting.upsert({
            where: { userId },
            create: { userId, ...data },
            update: data,
        });
    },
};
