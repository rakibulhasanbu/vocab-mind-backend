import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { sessionController } from "./session.controller.js";
import { initializeWordSchema, submitReviewSchema } from "./session.schema.js";

export const sessionRoutes = new Hono();

sessionRoutes.use("*", authMiddleware);
sessionRoutes.get("/", sessionController.getQueue);
sessionRoutes.post("/review", validate(submitReviewSchema), sessionController.submitReview);
sessionRoutes.post("/initialize", validate(initializeWordSchema), sessionController.initializeWord);
