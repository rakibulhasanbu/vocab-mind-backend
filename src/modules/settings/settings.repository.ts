import { prisma } from "../../db/prisma.js";

export const settingsRepository = {
  findOrCreate(userId: string) {
    return prisma.setting.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  },

  update(userId: string, data: { dailyNewWords?: number }) {
    return prisma.setting.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },
};
