import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { progressController } from "./progress.controller.js";

export const progressRoutes = new Hono();
progressRoutes.use("*", authMiddleware);
progressRoutes.get("/", progressController.get);
