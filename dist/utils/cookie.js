import { setCookie, deleteCookie } from "hono/cookie";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "../lib/jwt.js";
import { env } from "../config/env.js";
export async function setSessionCookie(c, payload) {
    const token = await signSession(payload);
    setCookie(c, SESSION_COOKIE, token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });
}
export function clearSessionCookie(c) {
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
}
