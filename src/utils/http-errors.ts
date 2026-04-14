import { HTTPException } from "hono/http-exception";

export function badRequest(message: string, code = "BAD_REQUEST"): never {
  throw new HTTPException(400, { message, cause: { code } });
}

export function unauthorized(message = "Unauthorized", code = "UNAUTHORIZED"): never {
  throw new HTTPException(401, { message, cause: { code } });
}

export function forbidden(message = "Forbidden", code = "FORBIDDEN"): never {
  throw new HTTPException(403, { message, cause: { code } });
}

export function notFound(message = "Not found", code = "NOT_FOUND"): never {
  throw new HTTPException(404, { message, cause: { code } });
}

export function conflict(message: string, code = "CONFLICT"): never {
  throw new HTTPException(409, { message, cause: { code } });
}
