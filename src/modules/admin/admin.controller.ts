import type { Context } from "hono";
import { getValidated } from "../../middleware/validate.js";
import type {
  ChangeRoleInput,
  CreateUserInput,
  UploadWordsInput,
  UserIdParam,
} from "./admin.schema.js";
import { adminService } from "./admin.service.js";

export const adminController = {
  async uploadWords(c: Context) {
    const { userId } = c.get("user");
    const input = getValidated<UploadWordsInput>(c, "json");
    return c.json(await adminService.uploadWords(userId, input));
  },

  async validateUpload(c: Context) {
    const input = getValidated<UploadWordsInput>(c, "json");
    return c.json(await adminService.validateUpload(input));
  },

  async listUsers(c: Context) {
    return c.json(await adminService.listUsers());
  },

  async createUser(c: Context) {
    const input = getValidated<CreateUserInput>(c, "json");
    return c.json(await adminService.createUser(input), 201);
  },

  async changeRole(c: Context) {
    const actor = c.get("user");
    const { id } = getValidated<UserIdParam>(c, "param");
    const input = getValidated<ChangeRoleInput>(c, "json");
    return c.json(await adminService.changeRole(actor.userId, id, input));
  },
};
