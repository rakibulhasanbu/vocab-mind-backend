import type { MiddlewareHandler } from "hono";
import type { ZodSchema } from "zod";
import { HTTPException } from "hono/http-exception";

type Source = "json" | "query" | "param";

export function validate<T>(schema: ZodSchema<T>, source: Source = "json"): MiddlewareHandler {
  return async (c, next) => {
    let raw: unknown;
    if (source === "json") {
      try {
        raw = await c.req.json();
      } catch {
        raw = {};
      }
    } else if (source === "query") {
      raw = c.req.query();
    } else {
      raw = c.req.param();
    }

    const result = schema.safeParse(raw);
    if (!result.success) {
      throw new HTTPException(400, {
        message: "Validation failed",
        cause: {
          code: "VALIDATION_ERROR",
          issues: result.error.flatten(),
        },
      });
    }
    c.set(`validated_${source}` as never, result.data as never);
    await next();
  };
}

export function getValidated<T>(
  c: { get: (key: string) => unknown },
  source: Source = "json"
): T {
  return c.get(`validated_${source}`) as T;
}
