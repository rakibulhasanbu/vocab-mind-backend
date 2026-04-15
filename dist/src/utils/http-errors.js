import { HTTPException } from "hono/http-exception";
export function badRequest(message, code = "BAD_REQUEST") {
    throw new HTTPException(400, { message, cause: { code } });
}
export function unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    throw new HTTPException(401, { message, cause: { code } });
}
export function forbidden(message = "Forbidden", code = "FORBIDDEN") {
    throw new HTTPException(403, { message, cause: { code } });
}
export function notFound(message = "Not found", code = "NOT_FOUND") {
    throw new HTTPException(404, { message, cause: { code } });
}
export function conflict(message, code = "CONFLICT") {
    throw new HTTPException(409, { message, cause: { code } });
}
