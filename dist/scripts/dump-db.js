/**
 * Phase 0 — raw JSON dump of the live database.
 *
 * Dynamically introspects all tables in the `public` schema and writes each
 * one to ../data-dump/<table>.json. The live DB has diverged from the repo's
 * Drizzle schema (user-scoped tables are missing user_id, and there is no
 * `users` table — only a shared `User` table from another app). We dump
 * everything as-is so nothing is lost; the restore script decides what is
 * importable into the new Prisma schema.
 *
 * Usage: npm run db:dump
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
async function main() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const outDir = resolve(__dirname, "..", "..", "data-dump");
    mkdirSync(outDir, { recursive: true });
    const sql = neon(url);
    const tablesResult = (await sql.query(`SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`));
    const tables = tablesResult.map((t) => t.table_name);
    console.log(`Found ${tables.length} tables in public schema`);
    const rowCounts = {};
    const schemas = {};
    for (const table of tables) {
        const quoted = `"${table.replace(/"/g, '""')}"`;
        const cols = (await sql.query(`SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`, [table]));
        schemas[table] = cols.map((c) => ({
            column: c.column_name,
            type: c.data_type,
        }));
        const rows = (await sql.query(`SELECT * FROM ${quoted}`));
        const file = resolve(outDir, `${table}.json`);
        writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
        rowCounts[table] = rows.length;
        console.log(`  ${table.padEnd(20)} → ${String(rows.length).padStart(5)} rows`);
    }
    const meta = {
        dumpedAt: new Date().toISOString(),
        source: "neon-http",
        schemaVersion: "pre-hono-prisma-migration",
        note: "Live DB diverges from repo drizzle schema; user-scoped tables lack user_id columns. Restore script only imports the `words` table into the new Prisma schema. All other tables are preserved in JSON only as a historical record.",
        rowCounts,
        schemas,
    };
    writeFileSync(resolve(outDir, "_meta.json"), JSON.stringify(meta, null, 2), "utf8");
    console.log("\n✅ Dump complete");
    console.log(`   → ${outDir}`);
    console.log("   row counts:", rowCounts);
}
main().catch((err) => {
    console.error("Dump failed:", err);
    process.exit(1);
});
