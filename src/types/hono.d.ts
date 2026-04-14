import type { SessionPayload } from "../lib/jwt.js";

declare module "hono" {
  interface ContextVariableMap {
    user: SessionPayload;
  }
}

export {};
