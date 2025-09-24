# Development Task Tracker

_Last updated: 2025-09-24_
_Project_: Concept Stock Screener\_
_Owner_: Development Team\_

> Keep this tracker aligned with the PRD, Feature & Flow spec, and the CI/CD documentation set. (See the reference list at the end for exact paths.)

## 1. Recently completed

- [x] Monorepo bootstrap, cross-platform tooling, and testing harness baseline (2024-09-03).
- [x] ESLint / TypeScript debt burn-down (57 -> 0 issues) with lint-staged guardrails (2024-12-19).
- [x] CI/CD workflows (`ci.yml`, `dev-deploy.yml`, `production-deploy.yml`) plus documentation refresh (2024-12-19).
- [x] MCP tooling package (`packages/mcp-tools`) verified via stdio startup smoke.

## 2. Active focus items (current sprint)

| ID      | Task                                                                                          | Owner         | Status      | Target     | References                           |
| ------- | --------------------------------------------------------------------------------------------- | ------------- | ----------- | ---------- | ------------------------------------ |
| P-01    | Theme-to-stock search flow: search bar UX, query handling, results list, tri-pane integration | Web + API     | In progress | 2025-10-02 | PRD 1.3, 7; Feature&Flow 3.1         |
| P-02    | Stock-to-theme reverse lookup: mode toggle, API handler, explanations panel                   | Web + API     | In progress | 2025-10-02 | PRD 1.3; Feature&Flow 3.2            |
| P-03    | Trending concepts module with heat bar visualization and quick filter                         | Web           | Planned     | 2025-10-09 | PRD 7; Feature&Flow 3.1.3            |
| API-01  | `/search` Worker handler wired to Gemini service, structured errors, rate limiting            | API           | In progress | 2025-10-02 | PRD 6.3; RAG 3                       |
| API-02  | Concept detail endpoint (description, heat, top stocks, citations) for detail panel           | API           | Planned     | 2025-10-09 | Feature&Flow 3.1.2                   |
| DATA-01 | Ingest TWSE filings/news into Pinecone namespace (chunking + metadata)                        | Data          | In progress | 2025-10-15 | PRD 6.5; RAG 2                       |
| DATA-02 | Persist RAG source trails for the citation drawer                                             | Data          | Planned     | 2025-10-15 | Feature&Flow 3.1.2                   |
| OPS-01  | Cloudflare token rotation SOP + dashboard                                                     | DevOps        | In progress | 2025-09-30 | Progress tracker; CI docs            |
| OPS-02  | Deployment notifications (Slack / email) wired into Actions workflows                         | DevOps + PM   | In progress | 2025-10-07 | CI docs                              |
| T-01    | Restore deterministic `pnpm type-check` runs by fixing React workspace linker configuration   | Platform + UI | Complete    | 2025-09-24 | Progress tracker; packages/ui README |
| QA-02   | Add tests for apps/api/src/handlers and apps/web/src/app/page.tsx to lift coverage above 70%  | QA + Web      | In progress | 2025-10-09 | Progress tracker; testing strategy   |
| OPS-03  | Finalize deployment notifications and monitoring hooks for dev/prod workflows                 | DevOps + PM   | Planned     | 2025-10-15 | CI docs; Progress tracker            |
| QA-01   | Dev deploy smoke tests embedded in `dev-deploy.yml`                                           | QA            | Planned     | 2025-10-15 | CI docs                              |

## 3. Near-term backlog (next 4 weeks)

### Web app (Next.js)

- W-01 Responsive tri-pane layout with collapsible sidebar and detail panels (PRD 7; Feature&Flow 3.1.1).
- W-02 Persist last successful query/mode in `localStorage` and restore on load (PRD 7; Feature&Flow 3.1.5).
- W-03 Loading / empty / timeout / error / retry states with skeleton UI and toast feedback (Feature&Flow 3.1.6).
- W-04 Heat-score bar component integrated into trending panel (PRD 6.5 data model; Feature&Flow 3.1.3).
- W-05 Analytics hooks for query latency, Gemini usage, and UI interactions (PRD 1.4; Feature&Flow 5).
- W-06 Concept detail panel (summary, heat, stock list) with deep-link support (`mode`, `q`) (Feature&Flow 3.1.2, 3.1.5).
- W-07 Source drawer component exposing RAG citations with tooltips and outbound links (Feature&Flow 3.1.2).
- W-08 Persona onboarding banners and watchlist CTA placeholders (Feature&Flow 4).

### API (Cloudflare Workers)

- A-01 `/trending` endpoint returning top 15 concepts with heat scores (PRD 6.3 milestones).
- A-02 Request/response validation via zod schemas and consistent envelope (PRD 6.3; RAG 3.2).
- A-03 KV caching with TTL and retry policy for repeated queries (RAG 2.2 management layer).
- A-04 Health probe endpoint for deployment smoke tests (CI docs).
- A-05 Structured logging of latency, model usage, and errors (Feature&Flow 5.3).

### Data pipeline (FastAPI)

- D-01 ETL for TWSE/TPEx filings, news, analyst notes into normalized stores (PRD 6.5).
- D-02 Document chunking and embedding, push to Pinecone with namespace/version tags (RAG 2).
- D-03 Scheduler for ingestion cron + backfill with monitoring metrics (RAG 2.2).
- D-04 Admin API for ingestion status, replay, freshness reporting (Feature&Flow 5.2).
- D-05 Citation payload storage (source title, URL, publishedAt, excerpt) for Gemini responses (Feature&Flow 3.1.2).

### AI / RAG layer

- AI-01 Finalize prompt templates for theme/stock/trend scenarios in `packages/types` (RAG 3.3; Feature&Flow 3).
- AI-02 Safety settings, abuse filters, fallback messaging (RAG 3.1; Feature&Flow 3.1.6).
- AI-03 Response cache and usage accounting to control Gemini quota (RAG 2.2).
- AI-04 Evaluate embedding model options and document trade-offs (RAG 2.1).
- AI-05 JSON schema validation and graceful degradation for partial outputs (Feature&Flow 3.1.6).

### UI component library (`packages/ui`)

- U-01 Codify pnpm hoisted linker usage (docs + scripts) to keep React typings resolvable.
- U-02 Strongly typed table sorting utilities/tests (remove `unknown`).
- U-03 Storybook or equivalent visual regression coverage for core components.
- U-04 Reusable primitives: `Toast`, `Skeleton`, `HeatBar` per Feature&Flow guidance.

### Platform and operations

- T-01 Document and enforce pnpm hoisted linker usage so React typings stay resolvable across environments.
- T-02 Validate Husky and lint-staged on fresh Windows/macOS environments with troubleshooting notes (PRD 6.4 scaling plan).
- T-03 MCP watchdog GitHub Action for Pinecone / Cloudflare / Vercel servers.
- T-04 Staging environment configuration and secrets inventory ahead of production rollout.
- T-05 Observability stack (Workers Logpush + dashboards) covering API and data pipeline (Feature&Flow 5.3).
- T-06 Optimize CI pnpm caching to reduce install/build time (from CI_CD_TODO T-01).
- T-07 Persist deployment manifests/logs to shared storage (S3/GCS) for audit trail (from CI_CD_TODO T-04).

## 4. Longer-term backlog (post-MVP)

- L-01 Personalized watchlists, alerting, saved screens (PRD 6.4 future iterations).
- L-02 Multi-language UI and localization tooling (PRD 6.4; Feature&Flow 4.4).
- L-03 Performance budgets (bundle size, TTFB) enforced in CI.
- L-04 Advanced analytics: concept trend forecasting, risk scoring, reporting exports (PRD 6.4; RAG roadmap).
- L-05 Enterprise readiness: SSO, audit logs, role-based access control.
- L-06 User data export, compliance preferences center (Feature&Flow 5.4).
- L-07 Disaster-recovery drill playbook for staging and production rollback (from CI_CD_TODO T-05).

## 5. Dependencies and references

- `docs/%5BPRD%5D%E6%A6%82%E5%BF%B5%E8%82%A1%E8%87%AA%E5%8B%95%E5%8C%96%E7%AF%A9%E9%81%B8%E7%B3%BB%E7%B5%B1.md` (PRD)
- `docs/%5B%E5%8A%9F%E8%83%BD%26%E6%B5%81%E7%A8%8B%5D%E6%A6%82%E5%BF%B5%E8%82%A1%E8%87%AA%E5%8B%95%E5%8C%96%E7%AF%A9%E9%81%B8%E7%B3%BB%E7%B5%B1%20-%20%E5%8A%9F%E8%83%BD%E7%B4%B0%E7%AF%80%E8%88%87%E6%B5%81%E7%A8%8B%E8%A6%8F%E6%A0%BC%E6%9B%B8.md` (Feature & Flow spec)
- `docs/development/features/CORE_FEATURES_DEVELOPMENT.md`
- `docs/development/features/RAG_SYSTEM_INTEGRATION.md`
- `docs/development/ci-cd/CI_CD_PROGRESS_SUMMARY.md`
- `docs/development/ci-cd/archive/CI_CD_TODO_20250922.md`
- `docs/development/testing/TESTING_STRATEGY.md`
- `.github/workflows/*.yml`
