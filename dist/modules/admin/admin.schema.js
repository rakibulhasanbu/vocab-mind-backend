import { z } from "zod";
export const sentenceSchema = z.object({ en: z.string().min(1), bn: z.string().min(1) });
export const wordInputSchema = z.object({
    word: z.string().min(1),
    bangla: z.string().min(1),
    definition: z.string().min(1),
    part_of_speech: z.string().min(1),
    category: z.string().min(1),
    pronunciation: z.string().optional(),
    sentences: z.array(sentenceSchema).min(2, "At least 2 sentences required"),
    collocations: z.array(z.string()).optional(),
    usage_tip: z.string().optional(),
    difficulty: z.number().int().min(1).max(10).optional(),
});
export const uploadWordsSchema = z.object({
    words: z.array(wordInputSchema).min(1).max(200),
});
export const createUserSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(200),
    role: z.enum(["user", "moderator"]).default("moderator"),
});
export const changeRoleSchema = z.object({
    role: z.enum(["user", "moderator", "super_admin"]),
});
export const userIdParamSchema = z.object({
    id: z.string().uuid(),
});
