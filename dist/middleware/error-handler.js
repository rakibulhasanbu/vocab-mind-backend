import { HTTPException } from "hono/http-exception";
import { env } from "../config/env.js";
export const errorHandler = (err, c) => {
    if (err instanceof HTTPException) {
        const cause = (err.cause ?? {});
        return c.json({
            error: {
                code: cause.code ?? "HTTP_ERROR",
                message: err.message,
                ...(cause.issues ? { issues: cause.issues } : {}),
            },
        }, err.status);
    }
    console.error("Unhandled error:", err);
    return c.json({
        error: {
            code: "INTERNAL_ERROR",
            message: env.NODE_ENV === "development"
                ? err instanceof Error
                    ? err.message
                    : String(err)
                : "Internal server error",
        },
    }, 500);
};
