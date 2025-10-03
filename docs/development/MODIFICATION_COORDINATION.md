# Modification Coordination Guide

_Last updated: 2025-09-22_
_Project_: Concept Stock Screener
_Owner_: Core maintainers

> For CI/CD-specific secret lists and troubleshooting, see `docs/deployment/CI_CD_NOTES.md`.

## 1. Purpose

The goal of this guide is to prevent regressions when late-stage fixes or hot patches are requested. Any change that lands outside the normal sprint cadence must follow the coordination steps below so the system remains stable.

## 2. When the process is required

Trigger this checklist when at least one of the following is true:

| Category           | Examples                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| Quality guardrails | Re-introducing ESLint or TypeScript errors, Prettier deviations, unit test regressions          |
| Consistency        | Breaking shared component contracts, type definitions, workspace dependency versions            |
| Stability          | Re-opening fixed bugs, re-introducing security vulnerabilities, behaviour changes without tests |
| Compliance         | User documentation or API contracts becoming outdated                                           |

## 3. Pre-merge checklist

Run every item locally before opening a PR:

```bash
pnpm lint:check
pnpm type-check
pnpm test:coverage
pnpm build
```

Additional context:

- If a temporary downgrade or `as any` cast is required, document follow-up work in `docs/development/DEVELOPMENT_TASKS.md` so the backlog captures the cleanup.
- Capture before/after screenshots for UI-impacting changes.

## 4. Coordination workflow

1. **Prepare change notes** – describe the root cause, the fix, and affected modules.
2. **Notify owners** – ping the Slack `#cicd` channel (or the on-call engineer) and link the PR.
3. **Request review** – minimum two approvals; at least one must be from the platform/CI maintainers when workflow files are touched.
4. **Run full CI** – ensure `ci.yml` passes, including coverage thresholds.
5. **Manual smoke test** – deploy to the dev environment (`dev-deploy.yml`) and verify key user flows.
6. **Production promotion** – once validated, run `production-deploy.yml` manually with a clear summary.
7. **Post-mortem log** – update the “Recently completed” section in `CI_CD_PROGRESS_SUMMARY.md` and file any follow-up tasks.

## 5. Communication template

```
Title: Hot fix – <summary>
Impact: <features/modules>
Risk: <low/medium/high>
Tests: lint ✔︎ | type ✔︎ | unit ✔︎ | build ✔︎ | deploy (dev/prod) ✔︎
Follow-ups: <link to TODO/backlog items>
```

Use this structure for stand-up notes, Slack announcements, and PR descriptions.

## 6. Audit log

| Date       | Change                                                                        | Owner            | Notes                                  |
| ---------- | ----------------------------------------------------------------------------- | ---------------- | -------------------------------------- |
| 2024-12-19 | ESLint/TypeScript cleanup completed                                           | Dev team         | Removed `as any`, lint baseline locked |
| 2025-09-22 | CI/CD documentation refreshed (`CI_CD_PROGRESS_SUMMARY.md`, `CI_CD_NOTES.md`) | CI working group | Added token verification guidance      |

## 7. Related documents

- `docs/deployment/CI_CD_NOTES.md` - secrets & troubleshooting
- `docs/development/DEVELOPMENT_TASKS.md` - backlog tracker
- `docs/development/ci-cd/CI_CD_PROGRESS_SUMMARY.md` - status overview
- `docs/deployment/DEPLOYMENT_GUIDE.md` - production runbook
- `docs/deployment/DEVELOPMENT_DEPLOYMENT.md` - dev/local deployment guide

---

_Maintainer: CI/CD working group_
