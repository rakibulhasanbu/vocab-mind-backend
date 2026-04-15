import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { bookmarksController } from "./bookmarks.controller.js";
import { toggleBookmarkSchema } from "./bookmarks.schema.js";
export const bookmarksRoutes = new Hono();
bookmarksRoutes.use("*", authMiddleware);
bookmarksRoutes.get("/", bookmarksController.list);
bookmarksRoutes.post("/", validate(toggleBookmarkSchema), bookmarksController.toggle);
