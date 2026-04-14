import type { Role, User } from "@prisma/client";
import { prisma } from "../../db/prisma.js";

export const authRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: {
    name: string | null;
    email: string;
    passwordHash: string;
    role: Role;
  }): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });
      await tx.setting.create({ data: { userId: user.id } });
      return user;
    });
  },

  ensureSetting(userId: string): Promise<unknown> {
    return prisma.setting.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  },
};
