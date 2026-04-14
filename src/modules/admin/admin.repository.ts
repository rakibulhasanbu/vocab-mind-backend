import type { Prisma, Role } from "@prisma/client";
import { prisma } from "../../db/prisma.js";

export const adminRepository = {
  findWordBySlug(word: string) {
    return prisma.word.findUnique({ where: { word } });
  },

  createWord(data: Prisma.WordUncheckedCreateInput) {
    return prisma.word.create({ data });
  },

  listUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(data: {
    name: string | null;
    email: string;
    passwordHash: string;
    role: Role;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });
      await tx.setting.create({ data: { userId: user.id } });
      return user;
    });
  },

  updateRole(id: string, role: Role) {
    return prisma.user.update({ where: { id }, data: { role } });
  },

  countSuperAdmins() {
    return prisma.user.count({ where: { role: "super_admin" } });
  },
};
