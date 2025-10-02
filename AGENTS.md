# Repository Guidelines

## Project Structure & Module Organization

- `apps/web` – Next.js front-end served via Vercel; primary entry `src/app`.
- `apps/api` – Cloudflare Workers API, request handlers under `src/handlers`.
- `apps/data-pipeline` – FastAPI ingestion service (`src/main.py`, `requirements.txt`).
- `packages/ui` – Shared React components and hooks; `packages/types` – reusable TypeScript types; `packages/mcp-tools` – MCP integration helpers.
- `config/` stores runtime presets; `docs/` holds architecture notes; `scripts/` centralizes deployment and QA utilities; seed data lives in `data/`.
- Jest specs sit beside source in `__tests__` folders (e.g., `packages/ui/src/components/__tests__`).

## Build, Test, and Development Commands

- `pnpm install` – install Node dependencies (Node 18+, pnpm 8+).
- `pnpm dev` – boot web app; run `pnpm dev:api` for Workers emulator or `pnpm dev:all` to launch both.
- `pnpm build` – orchestrated build of types → UI → web → API for CI and Vercel.
- `pnpm lint:check`, `pnpm format:check`, `pnpm type-check` – static analysis gate.
- `pnpm test`, `pnpm test:unit`, `pnpm test:integration`, `pnpm test:e2e`, `pnpm test:coverage` – layered Jest suites (unit targets UI/components, integration/e2e search for matching directories via `--testPathPatterns`).
- Data pipeline: `python -m venv .venv && pip install -r apps/data-pipeline/requirements.txt`, then `uvicorn main:app --app-dir apps/data-pipeline/src --reload`.

## Coding Style & Naming Conventions

- TypeScript, React, and Worker code use 2-space indentation with ES modules and strict typing.
- Components and pages use PascalCase (`SearchBox.tsx`); hooks `useX.ts`; utility modules camelCase.
- Share enums and contracts through `packages/types`; keep UI tokens in `packages/ui/src/theme`.
- Enforce linting with ESLint (React, JSX a11y, hooks) and formatting with Prettier; apply fixes via `pnpm lint:fix` / `pnpm format:fix`.

## Testing Guidelines

- Jest + Testing Library (`jest.setup.js`) cover UI hooks/components; API handlers tested under `apps/api/src/handlers/__tests__`.
- Place new specs as `*.test.ts` or `*.test.tsx` adjacent to implementation; group broader flows in folders named `integration` or `e2e` for the dedicated suites.
- Maintain meaningful coverage; review HTML reports after `pnpm test:coverage`.

## Commit & Pull Request Guidelines

- Follow conventional commits (`type(scope): summary`); recent history uses `ci:` and `docs(ci):` scopes.
- Keep subjects imperative and scoped to a single change; squash fix-ups locally before pushing.
- Run `pnpm run quality:gate` pre-PR and note outcomes (lint, type-check, coverage) in the description.
- PRs should link issues, explain context, attach UI screenshots when relevant, and confirm deployment steps.
- Never commit `.env` or secrets; seed credentials from `env.example` and `config/environments`.

## Development Workflow Notes

- Close each task with a concise summary paragraph in the PR or issue to capture context before moving on.
- Run the relevant test suites (`pnpm test`, targeted `pnpm test:*`, or data-pipeline checks) right after finishing the task to ensure no regressions.
- Commit promptly once tests pass, keeping commits focused and referencing the completed task.
- Review `docs/` for affected topics and update any architecture or runbooks so they stay in sync with code changes.
- Refresh the shared TODO or ticket backlog (e.g., issue tracker, `docs/todo.md`) to mark completed work and note follow-ups.
- Surface new risks or follow-on ideas during the wrap-up so they can be scheduled before momentum is lost.
- Keep all developer-facing replies and documentation updates in Traditional Chinese to stay consistent with team communication.
- Double-check file encodings (prefer UTF-8 without BOM) whenever editing config or localization assets to avoid unexpected character issues.
