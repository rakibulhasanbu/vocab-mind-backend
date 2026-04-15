import { prisma } from "../../db/prisma.js";
export const authRepository = {
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    findById(id) {
        return prisma.user.findUnique({ where: { id } });
    },
    async create(data) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data });
            await tx.setting.create({ data: { userId: user.id } });
            return user;
        });
    },
    ensureSetting(userId) {
        return prisma.setting.upsert({
            where: { userId },
            create: { userId },
            update: {},
        });
    },
};
