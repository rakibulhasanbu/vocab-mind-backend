import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/require-role.js";
import { validate } from "../../middleware/validate.js";
import { adminController } from "./admin.controller.js";
import { changeRoleSchema, createUserSchema, uploadWordsSchema, userIdParamSchema, } from "./admin.schema.js";
export const adminRoutes = new Hono();
// Everything under /admin requires authentication.
adminRoutes.use("*", authMiddleware);
// Words: moderator OR super_admin
adminRoutes.post("/words/upload", requireRole("moderator", "super_admin"), validate(uploadWordsSchema), adminController.uploadWords);
adminRoutes.post("/words/upload/validate", requireRole("moderator", "super_admin"), validate(uploadWordsSchema), adminController.validateUpload);
// Users: super_admin only
adminRoutes.get("/users", requireRole("super_admin"), adminController.listUsers);
adminRoutes.post("/users", requireRole("super_admin"), validate(createUserSchema), adminController.createUser);
adminRoutes.patch("/users/:id/role", requireRole("super_admin"), validate(userIdParamSchema, "param"), validate(changeRoleSchema), adminController.changeRole);
