import { getValidated } from "../../middleware/validate.js";
import { adminService } from "./admin.service.js";
export const adminController = {
    async uploadWords(c) {
        const { userId } = c.get("user");
        const input = getValidated(c, "json");
        return c.json(await adminService.uploadWords(userId, input));
    },
    async validateUpload(c) {
        const input = getValidated(c, "json");
        return c.json(await adminService.validateUpload(input));
    },
    async listUsers(c) {
        return c.json(await adminService.listUsers());
    },
    async createUser(c) {
        const input = getValidated(c, "json");
        return c.json(await adminService.createUser(input), 201);
    },
    async changeRole(c) {
        const actor = c.get("user");
        const { id } = getValidated(c, "param");
        const input = getValidated(c, "json");
        return c.json(await adminService.changeRole(actor.userId, id, input));
    },
};
