import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { sessionRoutes } from "./modules/session/session.routes.js";
import { wordsRoutes } from "./modules/words/words.routes.js";
import { bookmarksRoutes } from "./modules/bookmarks/bookmarks.routes.js";
import { progressRoutes } from "./modules/progress/progress.routes.js";
import { settingsRoutes } from "./modules/settings/settings.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";

export const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (c) => c.json({ ok: true, service: "vocab-mind-backend" }));

app.route("/auth", authRoutes);
app.route("/session", sessionRoutes);
app.route("/words", wordsRoutes);
app.route("/bookmarks", bookmarksRoutes);
app.route("/progress", progressRoutes);
app.route("/settings", settingsRoutes);
app.route("/admin", adminRoutes);

app.onError(errorHandler);
app.notFound((c) => c.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, 404));
