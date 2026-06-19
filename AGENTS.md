# CreditView

## Quick start

```sh
pnpm install
pnpm dev              # turbo run dev (all packages)
pnpm build            # turbo run build
pnpm lint             # turbo run lint
pnpm typecheck        # turbo run typecheck
pnpm test             # turbo run test
```

Single package: `pnpm --filter web dev`, `pnpm --filter @creditview/core test`, etc.

## Architecture

Monorepo (Turborepo + pnpm workspaces):

| directory | role |
|---|---|
| `apps/web/` | Next.js 16 App Router, all pages & components |
| `packages/core/` | Entities (Card, Transaction, Money) + services + repository interfaces |
| `packages/infra/` | Prisma repository implementations |
| `packages/database/` | Prisma schema, client singleton, migrations |
| `packages/shared/` | Shared types (AlertType, BudgetPeriod, etc.) |

Data flow: Server Actions (`apps/web/src/actions/`) → Core services → Infra repos → Prisma → PostgreSQL

## Key patterns

- **Auth**: NextAuth v5 beta, credentials provider, JWT sessions. `lib/auth.ts` configures it, `lib/dal.ts` exports `verifySession()` for protected actions.
- **Server Actions**: all in `apps/web/src/actions/`, each file is a `"use server"` module. They call `verifySession()` then delegate to core services or repos.
- **Validation**: Zod schemas in `lib/validation.ts` (`createCardSchema`, `createTransactionSchema`, etc.)
- **Styling**: Tailwind CSS v4 + inline styles for Figma-specific values (Typography: Literata headings, DM Sans body. Palette: navy `#002434`, cream `#FCF9F8`, white, `#72787C` secondary text, `#C2C7CC` borders)
- **Layout**: `(dashboard)/layout.tsx` has fixed sidebar (256px navy) + fixed header (64px frosted) + main content

## CI (GitHub Actions)

Runs in order: install → prisma generate → prisma migrate deploy → **typecheck** → **lint** → test → build

Requires PostgreSQL service. Env vars: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_APP_URL`.

## Prisma gotchas

- Prisma v6.19.3 locally. `npx prisma` fetches v7 which breaks the schema — always use `pnpm --filter @creditview/database exec prisma` instead.
- `pnpm install` runs `postinstall` that auto-generates Prisma client.
- Binary targets include `windows`, `debian-openssl-3.0.x`, `rhel-openssl-3.0.x` (Vercel).

## Repos & services

- `CardRepository`: `findById`, `findByUserId`, `save`, `delete`
- `TransactionRepository`: `findById`, `findByCardId`, `save`, `delete`
- `CardService`: `createCard`, `getUserCards`, `updateCard`, add/remove transaction
- **All actions verify ownership** (`card.userId !== userId`) — multi-tenant safe.

## Testing

- Vitest configs at `apps/web/vitest.config.ts` and `packages/core/vitest.config.ts`
- Unit tests colocated as `*.test.ts` in `src/`
- No integration tests that require DB locally.
- E2E: Playwright (config at root), requires running dev server.

## Pages

| route | description |
|---|---|
| `/dashboard` | Hero, 3 metric cards, recent transactions, spending breakdown |
| `/cards` | Card grid, activity chart, quick actions, offers |
| `/cards/[id]` | Card detail, transaction history, add transaction form |
| `/cards/new` | Create card form |
| `/cards/[id]/edit` | Edit card form |
| `/transactions` | 6-column table, filters (card/date/search), pagination, export CSV |
| `/statements` | Monthly sections with per-card financial summaries, utilization bars |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth pages |

## Figma integration

- File key `26eQyTgvIGyQhOKqf0tNGh`, extracted via REST API (token in opencode.jsonc)
- MCP: community `figma-developer-mcp` via npx
- Design tokens verified from Figma node extraction
