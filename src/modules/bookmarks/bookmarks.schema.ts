import { z } from "zod";

export const toggleBookmarkSchema = z.object({
  wordId: z.number().int().positive(),
});
export type ToggleBookmarkInput = z.infer<typeof toggleBookmarkSchema>;
