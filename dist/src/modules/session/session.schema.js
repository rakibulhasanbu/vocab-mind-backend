import { z } from "zod";
export const submitReviewSchema = z.object({
    wordId: z.number().int().positive(),
    exerciseType: z.string().min(1).max(64),
    isCorrect: z.boolean(),
    rating: z.enum(["wrong", "hard", "good", "easy"]),
    responseTimeMs: z.number().int().nonnegative().optional(),
});
export const initializeWordSchema = z.object({
    wordId: z.number().int().positive(),
});
