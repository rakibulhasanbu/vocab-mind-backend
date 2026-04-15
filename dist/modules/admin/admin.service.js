import { hashPassword } from "../../lib/password.js";
import { badRequest, conflict, notFound } from "../../utils/http-errors.js";
import { adminRepository } from "./admin.repository.js";
function normalize(w) {
    return w.toLowerCase().trim();
}
export const adminService = {
    async uploadWords(createdById, payload) {
        const errors = [];
        const skipped = [];
        let inserted = 0;
        for (let i = 0; i < payload.words.length; i++) {
            const w = payload.words[i];
            const slug = normalize(w.word);
            const existing = await adminRepository.findWordBySlug(slug);
            if (existing) {
                skipped.push(w.word);
                continue;
            }
            try {
                await adminRepository.createWord({
                    word: slug,
                    bangla: w.bangla,
                    definition: w.definition,
                    partOfSpeech: w.part_of_speech,
                    pronunciation: w.pronunciation ?? null,
                    category: w.category,
                    sentences: w.sentences,
                    collocations: w.collocations ?? [],
                    usageTip: w.usage_tip ?? null,
                    difficulty: w.difficulty ?? 5,
                    createdById,
                });
                inserted++;
            }
            catch (err) {
                errors.push(`Item ${i} (${w.word}): ${err instanceof Error ? err.message : "insert failed"}`);
            }
        }
        return { inserted, skipped, errors };
    },
    async validateUpload(payload) {
        const duplicates = [];
        const newWords = [];
        for (const w of payload.words) {
            const slug = normalize(w.word);
            const existing = await adminRepository.findWordBySlug(slug);
            if (existing)
                duplicates.push(w.word);
            else
                newWords.push(w.word);
        }
        return {
            valid: true,
            totalWords: payload.words.length,
            duplicates,
            newWords,
            errors: [],
        };
    },
    listUsers() {
        return adminRepository.listUsers();
    },
    async createUser(input) {
        const existing = await adminRepository.findUserByEmail(input.email);
        if (existing)
            conflict("An account with that email already exists", "EMAIL_TAKEN");
        const passwordHash = await hashPassword(input.password);
        const user = await adminRepository.createUser({
            name: input.name ?? null,
            email: input.email,
            passwordHash,
            role: input.role,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    },
    async changeRole(actorId, targetId, input) {
        const target = await adminRepository.findUserById(targetId);
        if (!target)
            notFound("User not found");
        // Protect the last super_admin from being demoted.
        if (target.role === "super_admin" && input.role !== "super_admin") {
            const count = await adminRepository.countSuperAdmins();
            if (count <= 1)
                badRequest("Cannot demote the last super_admin", "LAST_SUPER_ADMIN");
        }
        // Disallow acting on self if it would lock you out — rare edge, skip for now.
        if (actorId === targetId && target.role === "super_admin" && input.role !== "super_admin") {
            badRequest("Super admins cannot demote themselves", "SELF_DEMOTION");
        }
        const updated = await adminRepository.updateRole(targetId, input.role);
        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
        };
    },
};
