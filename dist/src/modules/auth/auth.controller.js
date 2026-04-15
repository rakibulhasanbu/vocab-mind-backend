import { clearSessionCookie, setSessionCookie } from "../../utils/cookie.js";
import { getValidated } from "../../middleware/validate.js";
import { authService } from "./auth.service.js";
export const authController = {
    async register(c) {
        const input = getValidated(c, "json");
        const user = await authService.register(input);
        await setSessionCookie(c, { userId: user.id, email: user.email, role: user.role });
        return c.json({ user }, 201);
    },
    async login(c) {
        const input = getValidated(c, "json");
        const user = await authService.login(input);
        await setSessionCookie(c, { userId: user.id, email: user.email, role: user.role });
        return c.json({ user });
    },
    async logout(c) {
        clearSessionCookie(c);
        return c.json({ ok: true });
    },
    async me(c) {
        const session = c.get("user");
        const user = await authService.me(session.userId);
        return c.json({ user });
    },
};
