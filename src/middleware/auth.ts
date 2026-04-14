import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { SESSION_COOKIE, verifySession } from "../lib/jwt.js";
import { unauthorized } from "../utils/http-errors.js";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) unauthorized();
  const session = await verifySession(token);
  if (!session) unauthorized("Invalid session");
  c.set("user", session);
  await next();
};
