# Repository Guidelines

## Project Structure & Module Organization

- Monorepo managed by pnpm workspace; Next.js front end lives in `apps/web`, Cloudflare Worker API in `apps/api`, FastAPI pipeline in `apps/data-pipeline`.
- Shared React components sit in `packages/ui`, cross-cutting types in `packages/types`, and MCP integrations under `packages/mcp-tools`.
- Tests are colocated beside source under `__tests__`; long-form documentation stays in `docs/`, automation in `scripts/`, and sample data in `data/`.

## Build, Test, and Development Commands

- `pnpm install` installs workspace dependencies (Node >= 18, pnpm >= 8).
- `pnpm dev`, `pnpm dev:web`, `pnpm dev:api`, and `pnpm dev:all` start the front end, Worker emulator, or both.
- `pnpm build` executes the types -> ui -> web -> api pipeline for CI and Vercel deploys.
- Quality guardrails: `pnpm lint:check`, `pnpm format:check`, `pnpm type-check`, `pnpm test`, `pnpm test:coverage`. Data pipeline: `pip install -r apps/data-pipeline/requirements.txt` then `uvicorn main:app --reload --app-dir apps/data-pipeline/src`.

## Coding Style & Naming Conventions

- TypeScript/React code uses 2-space indentation, ES modules, and strict compiler options; Worker scripts follow the same lint setup.
- Components/pages are PascalCase, hooks follow `useX.ts`, utilities are lowerCamelCase; shared DTOs and enums belong in `packages/types`.
- Run `pnpm lint:fix` and `pnpm format:fix` before committing so ESLint and Prettier resolve drift.

## Testing Guidelines

- Jest + Testing Library configured via `jest.config.js` and `jest.setup.js`.
- Unit specs live next to code as `*.test.ts(x)` inside `__tests__`; integration and e2e suites rely on `--testPathPatterns` directories.
- Target meaningful coverage; review `pnpm test:coverage` output for regressions.

## Commit & Pull Request Guidelines

- Follow conventional commits (`type(scope): action`), e.g. `fix(ui): adjust watchlist card width`.
- Run `pnpm run quality:gate` before pushing; include results, linked issues, and screenshots when UI changes in PRs.
- Summarize behaviour changes, note deployment impacts, and update relevant docs in `docs/` when workflows evolve.

## Security & Configuration Tips

- Copy `env.example` to `.env`, populate Pinecone, Cloudflare, Vercel, and GitHub credentials locally - never commit secrets.
- Configure Wrangler (`pnpm --filter api deploy`) and keep the Python pipeline in a dedicated virtualenv to isolate dependencies.
