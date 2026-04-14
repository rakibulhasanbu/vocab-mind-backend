import type { Context } from "hono";
import { clearSessionCookie, setSessionCookie } from "../../utils/cookie.js";
import { getValidated } from "../../middleware/validate.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { authService } from "./auth.service.js";

export const authController = {
  async register(c: Context) {
    const input = getValidated<RegisterInput>(c, "json");
    const user = await authService.register(input);
    await setSessionCookie(c, { userId: user.id, email: user.email, role: user.role });
    return c.json({ user }, 201);
  },

  async login(c: Context) {
    const input = getValidated<LoginInput>(c, "json");
    const user = await authService.login(input);
    await setSessionCookie(c, { userId: user.id, email: user.email, role: user.role });
    return c.json({ user });
  },

  async logout(c: Context) {
    clearSessionCookie(c);
    return c.json({ ok: true });
  },

  async me(c: Context) {
    const session = c.get("user");
    const user = await authService.me(session.userId);
    return c.json({ user });
  },
};
