import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { settingsController } from "./settings.controller.js";
import { updateSettingsSchema } from "./settings.schema.js";
export const settingsRoutes = new Hono();
settingsRoutes.use("*", authMiddleware);
settingsRoutes.get("/", settingsController.get);
settingsRoutes.patch("/", validate(updateSettingsSchema), settingsController.update);
