# Scripts Directory

This folder groups operational helpers used across the monorepo.

- `deployment/` – primary deployment entry points (shell + PowerShell).
- `development/` – local dev helpers (bootstrapping, environment checks).
- `maintenance/` – ad-hoc upkeep utilities.
- `testing/` / `tests/` – automation harnesses and coverage utilities.
- `archive/` – legacy scripts kept for reference; not invoked by current workflows.

New scripts should live in the closest matching subfolder. Retire outdated helpers by moving them into `archive/` so the active surface stays small.
