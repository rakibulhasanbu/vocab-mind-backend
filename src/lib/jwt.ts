import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";
import type { Role } from "@prisma/client";

const SECRET = new TextEncoder().encode(env.AUTH_SECRET);

export const SESSION_COOKIE = "vm_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  userId: string;
  email: string;
  role: Role;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET);
}

const VALID_ROLES: Role[] = ["user", "moderator", "super_admin"];

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string" &&
      (VALID_ROLES as string[]).includes(payload.role)
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as Role,
      };
    }
    return null;
  } catch {
    return null;
  }
}
