import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { wordsController } from "./words.controller.js";
import { randomWordsQuerySchema, wordIdParamSchema, wordsQuerySchema, } from "./words.schema.js";
export const wordsRoutes = new Hono();
wordsRoutes.use("*", authMiddleware);
// Specific routes before /:id to avoid collisions.
wordsRoutes.get("/categories", wordsController.categories);
wordsRoutes.get("/random", validate(randomWordsQuerySchema, "query"), wordsController.random);
wordsRoutes.get("/", validate(wordsQuerySchema, "query"), wordsController.list);
wordsRoutes.get("/:id", validate(wordIdParamSchema, "param"), wordsController.byId);
