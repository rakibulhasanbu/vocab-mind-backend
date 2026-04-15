import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./config/env.js";
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`🚀 vocab-mind-backend listening on http://localhost:${info.port}`);
    console.log(`   CORS origin: ${env.FRONTEND_URL}`);
    console.log(`   NODE_ENV:    ${env.NODE_ENV}`);
});
