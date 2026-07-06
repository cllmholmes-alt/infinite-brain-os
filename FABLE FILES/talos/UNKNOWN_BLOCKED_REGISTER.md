# Unknown / Blocked Register

B1 BLOCKED docker/postgres/redis absent in build container -> prisma migrate, BullMQ,
docker compose UNPROVEN here. Safe next action: run docker compose up -d locally,
then pnpm db:migrate.
B2 BLOCKED Next.js command-center not installed/built (heavy dep tree; token/env
budget). Scaffold + tokens present. Next: pnpm i && pnpm --filter command-center dev.
B3 UNKNOWN model API keys -> model router stubbed; brain runs simulated deterministic.
B4 UNPROVEN Playwright E2E (no browser). Vitest governance suite is the proof layer here.
