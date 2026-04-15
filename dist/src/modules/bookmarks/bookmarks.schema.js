import { z } from "zod";
export const toggleBookmarkSchema = z.object({
    wordId: z.number().int().positive(),
});
