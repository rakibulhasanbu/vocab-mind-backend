# Vocab Mind — Backend

REST API for **Vocab Mind**: vocabulary learning with spaced repetition (SRS), bookmarks, daily stats, and user settings. Pairs with the Vocab Mind frontend via CORS + credentials.

## Tech stack

| Layer | Technology |
|--------|------------|
| Runtime | **Node.js** (ES modules) |
| Framework | **Hono** + **@hono/node-server** |
| Language | **TypeScript** (strict, ES2022) |
| Database | **PostgreSQL** |
| ORM | **Prisma** |
| Validation | **Zod** |
| Auth | **jose** (JWT), **bcryptjs** (passwords) |
| Config | **dotenv** |
| Dev | **tsx**, **Prisma CLI** |
| Data tooling | **@neondatabase/serverless** (optional: `db:dump` / migration helpers) |

## API surface

| Prefix | Purpose |
|--------|---------|
| `GET /health` | Liveness check |
| `/auth` | Register, login, logout, current user (`me`) |
| `/session` | Study queue, submit review, introduce words (auth) |
| `/words` | List / filter / random / categories / by id (auth) |
| `/bookmarks` | Bookmarked words |
| `/progress` | Stats, history, SRS state |
| `/settings` | Daily goals, streaks, totals |
| `/admin` | Moderation & admin (roles: `user`, `moderator`, `super_admin`) |

## Prerequisites

- Node.js 20+ (recommended; matches `@types/node`)
- PostgreSQL database URL compatible with Prisma

## Environment

Create a `.env` (or set variables in your host):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `AUTH_SECRET` | Secret for signing tokens; **≥ 16 characters** |
| `FRONTEND_URL` | Allowed CORS origin (default `http://localhost:3000`) |
| `PORT` | Server port (default `8787`) |
| `NODE_ENV` | `development` \| `test` \| `production` |

## Quick start

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Production-style run: `npm run build` then `npm start`.

Bootstrap a **super admin** (see Prisma comments): `npm run seed:super-admin`.

## Useful scripts

| Script | What it does |
|--------|----------------|
| `dev` | Watch mode with **tsx** |
| `build` / `start` | Compile to `dist/` and run with Node |
| `typecheck` | `tsc --noEmit` |
| `db:generate` | Prisma client |
| `db:migrate` / `db:deploy` | Migrations (dev / deploy) |
| `db:studio` | Prisma Studio |
| `db:dump` / `db:restore` | JSON dump / restore helpers |
| `seed:super-admin` | Create super admin user |

## Project layout

- `src/` — Hono app, middleware, feature modules (`auth`, `words`, `progress`, etc.)
- `src/lib/srs.ts` — Spaced repetition logic
- `prisma/` — Schema & migrations
- `scripts/` — DB dump/restore and seed utilities

## License

Private project (`private: true` in `package.json`).
