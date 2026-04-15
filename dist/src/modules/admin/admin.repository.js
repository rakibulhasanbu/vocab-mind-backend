import { prisma } from "../../db/prisma.js";
export const adminRepository = {
    findWordBySlug(word) {
        return prisma.word.findUnique({ where: { word } });
    },
    createWord(data) {
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
    findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    findUserById(id) {
        return prisma.user.findUnique({ where: { id } });
    },
    createUser(data) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data });
            await tx.setting.create({ data: { userId: user.id } });
            return user;
        });
    },
    updateRole(id, role) {
        return prisma.user.update({ where: { id }, data: { role } });
    },
    countSuperAdmins() {
        return prisma.user.count({ where: { role: "super_admin" } });
    },
};
