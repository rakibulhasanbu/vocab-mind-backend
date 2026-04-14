import type { User } from "@prisma/client";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { badRequest, conflict, unauthorized } from "../../utils/http-errors.js";
import { authRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) conflict("An account with that email already exists", "EMAIL_TAKEN");

    const passwordHash = await hashPassword(input.password);
    // Role is ALWAYS 'user' on self-register — defense in depth, never trust request.
    const user = await authRepository.create({
      name: input.name ?? null,
      email: input.email,
      passwordHash,
      role: "user",
    });

    return toPublicUser(user);
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user || !user.passwordHash) unauthorized("Invalid email or password", "INVALID_CREDENTIALS");

    const ok = await verifyPassword(input.password, user!.passwordHash!);
    if (!ok) unauthorized("Invalid email or password", "INVALID_CREDENTIALS");

    await authRepository.ensureSetting(user!.id);
    return toPublicUser(user!);
  },

  async me(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) badRequest("User not found", "USER_NOT_FOUND");
    return toPublicUser(user!);
  },
};
