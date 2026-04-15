import { HTTPException } from "hono/http-exception";
export function validate(schema, source = "json") {
    return async (c, next) => {
        let raw;
        if (source === "json") {
            try {
                raw = await c.req.json();
            }
            catch {
                raw = {};
            }
        }
        else if (source === "query") {
            raw = c.req.query();
        }
        else {
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
        c.set(`validated_${source}`, result.data);
        await next();
    };
}
export function getValidated(c, source = "json") {
    return c.get(`validated_${source}`);
}
