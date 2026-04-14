import { z } from "zod";

export const updateSettingsSchema = z.object({
  dailyNewWords: z.number().int().min(1).max(20).optional(),
});
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
