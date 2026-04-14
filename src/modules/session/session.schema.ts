import { z } from "zod";

export const submitReviewSchema = z.object({
  wordId: z.number().int().positive(),
  exerciseType: z.string().min(1).max(64),
  isCorrect: z.boolean(),
  rating: z.enum(["wrong", "hard", "good", "easy"]),
  responseTimeMs: z.number().int().nonnegative().optional(),
});
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export const initializeWordSchema = z.object({
  wordId: z.number().int().positive(),
});
export type InitializeWordInput = z.infer<typeof initializeWordSchema>;
