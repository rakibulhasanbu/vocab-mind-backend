import { z } from "zod";
export const wordsQuerySchema = z.object({
    category: z.string().optional(),
    status: z.enum(["new", "learning", "familiar", "mastered"]).optional(),
    search: z.string().optional(),
    bookmarked: z
        .union([z.literal("true"), z.literal("false"), z.boolean()])
        .optional()
        .transform((v) => v === true || v === "true"),
    limit: z.coerce.number().int().min(1).max(200).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});
export const wordIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export const randomWordsQuerySchema = z.object({
    excludeId: z.coerce.number().int().positive(),
    count: z.coerce.number().int().min(1).max(20).default(3),
});
