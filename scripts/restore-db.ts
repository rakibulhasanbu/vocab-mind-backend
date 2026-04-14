/**
 * Phase 4 — restore words from the JSON dump into the new Prisma DB.
 *
 * The live DB the dump came from had diverged from the repo schema: user-scoped
 * tables lacked user_id columns and there was no `users` table. So we only
 * restore the `words` table, which is the portion with real content (354 rows)
 * and the portion the repo schema can actually accept unchanged. All other
 * user-scoped data (word_progress, reviews, daily_stats, settings) is
 * intentionally NOT restored — it was test data tied to nothing.
 *
 * Usage:
 *   npm run db:restore              # insert missing words, keep existing
 *   npm run db:restore -- --truncate  # truncate words first, then re-insert
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient, type Prisma } from "@prisma/client";

type DumpedWord = {
  id: number;
  word: string;
  bangla: string;
  definition: string;
  part_of_speech: string;
  pronunciation: string | null;
  category: string;
  sentences: unknown;
  collocations: string[] | null;
  usage_tip: string | null;
  difficulty: number;
};

async function main() {
  const args = new Set(process.argv.slice(2));
  const truncate = args.has("--truncate");

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dumpDir = resolve(__dirname, "..", "..", "data-dump");
  const wordsFile = resolve(dumpDir, "words.json");

  console.log(`Reading ${wordsFile}`);
  const raw = readFileSync(wordsFile, "utf8");
  const words: DumpedWord[] = JSON.parse(raw);
  console.log(`Found ${words.length} words in dump`);

  const prisma = new PrismaClient();

  try {
    if (truncate) {
      console.log("⚠️  --truncate: removing all existing words + dependent rows");
      await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE "words", "word_progress", "reviews" RESTART IDENTITY CASCADE'
      );
    }

    let inserted = 0;
    let skipped = 0;

    for (const w of words) {
      const exists = await prisma.word.findUnique({ where: { word: w.word } });
      if (exists) {
        skipped++;
        continue;
      }

      const data: Prisma.WordUncheckedCreateInput = {
        word: w.word,
        bangla: w.bangla,
        definition: w.definition,
        partOfSpeech: w.part_of_speech,
        pronunciation: w.pronunciation,
        category: w.category,
        sentences: (w.sentences as Prisma.InputJsonValue) ?? [],
        collocations: w.collocations ?? [],
        usageTip: w.usage_tip,
        difficulty: w.difficulty ?? 5,
      };
      await prisma.word.create({ data });
      inserted++;
    }

    const total = await prisma.word.count();
    console.log(`\n✅ Restore complete`);
    console.log(`   inserted: ${inserted}`);
    console.log(`   skipped (duplicates): ${skipped}`);
    console.log(`   total words in DB: ${total}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Restore failed:", err);
  process.exit(1);
});
