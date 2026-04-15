import { hashPassword, verifyPassword } from "../../lib/password.js";
import { badRequest, conflict, unauthorized } from "../../utils/http-errors.js";
import { authRepository } from "./auth.repository.js";
function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
}
export const authService = {
    async register(input) {
        const existing = await authRepository.findByEmail(input.email);
        if (existing)
            conflict("An account with that email already exists", "EMAIL_TAKEN");
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
    async login(input) {
        const user = await authRepository.findByEmail(input.email);
        if (!user || !user.passwordHash)
            unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok)
            unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
        await authRepository.ensureSetting(user.id);
        return toPublicUser(user);
    },
    async me(userId) {
        const user = await authRepository.findById(userId);
        if (!user)
            badRequest("User not found", "USER_NOT_FOUND");
        return toPublicUser(user);
    },
};
