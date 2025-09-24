# Repository Guidelines

## Project Structure & Module Organization

- Apps: `apps/web` (Next.js), `apps/api` (Cloudflare Workers), `apps/data-pipeline` (FastAPI).
- Packages: `packages/ui` (React components), `packages/types` (shared TS types).
- Tests live beside code under `__tests__` (e.g., `packages/ui/src/.../__tests__`).
- Config: root scripts in `scripts/`, env template `env.example`, dev config in `config/environments/`.

## Build, Test, and Development Commands

- Install: `pnpm install` (Node >= 18, pnpm >= 8).
- Dev (web/api): `pnpm dev`, or `pnpm dev:web`, `pnpm dev:api`.
- Build all: `pnpm build` (types → ui → web → api).
- Lint/Format: `pnpm lint:check`, `pnpm lint:fix`, `pnpm format:check`, `pnpm format:fix`.
- Tests: `pnpm test`, `pnpm test:watch`, coverage `pnpm test:coverage`.
- Data pipeline (Python): `pip install -r apps/data-pipeline/requirements.txt` then `uvicorn main:app --reload --app-dir apps/data-pipeline/src`.

## Coding Style & Naming Conventions

- TypeScript/React with 2-space indent; prefer ES modules.
- Components: PascalCase (e.g., `Button.tsx`); hooks `useX.ts`.
- Utilities/types: lowerCamelCase files; exported names are camelCase/PascalCase appropriately.
- Use ESLint (`.ts,.tsx,.js,.jsx`) and Prettier via scripts above.

## Testing Guidelines

- Framework: Jest + Testing Library (jsdom for React).
- Test files: `*.test.ts(x)` inside `__tests__` next to source.
- Run unit tests locally with `pnpm test:unit`; full suite with `pnpm test`.
- Aim for meaningful coverage; check with `pnpm test:coverage`.

## Commit & Pull Request Guidelines

- Commits: clear, imperative subject; optional scope (e.g., `ui:`). Example: `fix(ui): prevent table overflow on mobile`.
- PRs: include purpose, linked issues, screenshots for UI, and test notes. Ensure `pnpm run quality:gate` passes (lint, types, coverage).

## Security & Configuration Tips

- Copy `env.example` to `.env` (do not commit secrets). Verify `config/environments/development.json` as needed.
- API uses Wrangler; ensure Cloudflare creds are configured locally before `pnpm --filter api deploy`.

## Agent-Specific Notes

- Respect this guide for any edits. Keep changes scoped, minimal, and consistent. Prefer existing scripts and directory patterns.
