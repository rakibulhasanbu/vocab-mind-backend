import type { MiddlewareHandler } from "hono";
import type { Role } from "@prisma/client";
import { forbidden } from "../utils/http-errors.js";

export function requireRole(...allowed: Role[]): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get("user");
    if (!user || !allowed.includes(user.role)) {
      forbidden(`Requires role: ${allowed.join(" or ")}`);
    }
    await next();
  };
}
