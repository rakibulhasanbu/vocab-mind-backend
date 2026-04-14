/**
 * Bootstrap the first super admin.
 *
 * Usage:
 *   npm run seed:super-admin                               # interactive prompts
 *   npm run seed:super-admin -- --email a@b.c --name X --password ... [--force]
 *
 * Safety: refuses to run if any super_admin already exists, unless --force.
 */
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(1).max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

function parseFlags(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i++;
    } else {
      out[key] = true;
    }
  }
  return out;
}

async function prompt(rl: Awaited<ReturnType<typeof createInterface>>, label: string): Promise<string> {
  const v = await rl.question(label);
  return v.trim();
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const force = flags.force === true;

  const prisma = new PrismaClient();

  try {
    const existing = await prisma.user.count({ where: { role: "super_admin" } });
    if (existing > 0 && !force) {
      console.error(
        `❌ A super_admin already exists (${existing} total). Re-run with --force to create another.`
      );
      process.exit(1);
    }

    let email = typeof flags.email === "string" ? flags.email : "";
    let name = typeof flags.name === "string" ? flags.name : "";
    let password = typeof flags.password === "string" ? flags.password : "";

    if (!email || !name || !password) {
      const rl = createInterface({ input, output });
      if (!email) email = await prompt(rl, "Email: ");
      if (!name) name = await prompt(rl, "Name: ");
      if (!password) password = await prompt(rl, "Password (min 8 chars): ");
      rl.close();
    }

    const parsed = schema.safeParse({ email, name, password });
    if (!parsed.success) {
      console.error("❌ Validation failed:", parsed.error.flatten().fieldErrors);
      process.exit(1);
    }

    const duplicate = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (duplicate) {
      console.error(`❌ A user with email ${parsed.data.email} already exists (role: ${duplicate.role}).`);
      console.error("   If you want to promote them, use: PATCH /admin/users/:id/role");
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          role: "super_admin",
        },
      });
      await tx.setting.create({ data: { userId: u.id } });
      return u;
    });

    console.log(`\n✅ Super admin created`);
    console.log(`   id:    ${user.id}`);
    console.log(`   email: ${user.email}`);
    console.log(`   name:  ${user.name}`);
    console.log(`   role:  ${user.role}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
