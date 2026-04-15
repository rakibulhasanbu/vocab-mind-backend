import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";
const SECRET = new TextEncoder().encode(env.AUTH_SECRET);
export const SESSION_COOKIE = "vm_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export async function signSession(payload) {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(SECRET);
}
const VALID_ROLES = ["user", "moderator", "super_admin"];
export async function verifySession(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        if (typeof payload.userId === "string" &&
            typeof payload.email === "string" &&
            typeof payload.role === "string" &&
            VALID_ROLES.includes(payload.role)) {
            return {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };
        }
        return null;
    }
    catch {
        return null;
    }
}
