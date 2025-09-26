# CI/CD Notes

This note summarizes the configuration required by the GitHub Actions workflows and how to troubleshoot common deployment issues.

## 1. Required secrets and variables

| Name                     | Type              | Purpose                                                                  |
| ------------------------ | ----------------- | ------------------------------------------------------------------------ |
| `VERCEL_TOKEN`           | Secret            | Vercel token for the development deployment                              |
| `VERCEL_TOKEN_PROD`      | Secret            | Vercel token for the production deployment                               |
| `VERCEL_ORG_ID`          | Secret / Variable | Shared Vercel organisation id                                            |
| `VERCEL_PROJECT_ID`      | Secret / Variable | Development Vercel project id                                            |
| `VERCEL_PROJECT_ID_PROD` | Secret / Variable | Production Vercel project id                                             |
| `CLOUDFLARE_API_TOKEN`   | Secret            | Custom Cloudflare API token with Workers scopes                          |
| `CLOUDFLARE_ACCOUNT_ID`  | Secret / Variable | Cloudflare account id (for example `99cf07b95d45a17d7518ef8d87a9e831`)   |
| `SLACK_WEBHOOK_URL_DEV`  | Secret            | Slack webhook for dev CI/deploy notifications (optional but recommended) |
| `SLACK_WEBHOOK_URL_PROD` | Secret            | Slack webhook for production deploy notifications                        |

> The workflows first read the repository variable `CLOUDFLARE_ACCOUNT_ID`. If it is not present, the secret with the same name is used instead.

### 1.1 Creating the Cloudflare API token

1. Open Cloudflare Dashboard -> My Profile -> API Tokens -> Create Token -> Custom Token.
2. Grant at least the following scopes:
   - Account / Account Details / Read
   - Account / Members / Read
   - Account / Workers Scripts / Edit
   - Account / Workers KV Storage / Edit
   - Add any additional resources used by the Worker (Queues, D1, Secrets Store, etc.).
3. Restrict the token to the required account.
4. Store the token in `CLOUDFLARE_API_TOKEN` and the account id in `CLOUDFLARE_ACCOUNT_ID`.

#### Verification command

```bash
CLOUDFLARE_API_TOKEN=<token>
CLOUDFLARE_ACCOUNT_ID=99cf07b95d45a17d7518ef8d87a9e831
pnpm --filter api exec wrangler whoami
```

If Wrangler prints `Authentication error [code: 10000]`, the token scopes are incomplete and the token must be recreated.

## 2. Vercel deployment pipeline

- The repository tracks `apps/web/.vercel/project.json`. Keep this file under version control so deploys always target the same Vercel project (`concept-stock-screener`).
- The development workflow (`.github/workflows/dev-deploy.yml`) installs dependencies in two stages: pnpm at the monorepo root and a plain `npm install --no-save` inside `apps/web`. The second install guarantees `node_modules/styled-jsx` exists before packaging server functions.
- We run `npx vercel build --prod --cwd ./apps/web --token $VERCEL_TOKEN` to produce `.vercel/output/**` locally. The workflow verifies both `.vercel/output` and `apps/web/node_modules/styled-jsx` before deploying.
- Deployment uses `npx vercel deploy --prebuilt --prod --yes --cwd ./apps/web --token $VERCEL_TOKEN`, so the CLI uploads the prebuilt bundle instead of rebuilding in Vercel's environment.
- If you ever relink the project locally, execute `npx vercel link --cwd apps/web --org <org> --project concept-stock-screener --yes --token <token>` and commit the refreshed `apps/web/.vercel/project.json`.
- When debugging `ENOENT: ... styled-jsx` errors, rerun the workflow and inspect the "Verify prebuilt output" step. A failure there means the local install step inside `apps/web` must be fixed (run `npm install` manually, ensure lockfiles are up to date).

> **Local dry-run:** `pnpm install` -> `(cd apps/web && npm install --no-save)` -> `npx vercel build --prod --cwd apps/web`. Confirm `.vercel/output/**` and `node_modules/styled-jsx` exist; the CI deploy will behave identically.

## 2. Workflow highlights

### 2.1 `dev-deploy.yml`

- Triggers on push/PR to `develop`, or via the manual dispatch form.
- High level flow:
  1. Install dependencies and build shared packages (`pnpm build:types`, `pnpm build:ui`).
  2. Build the web and API packages (`pnpm build:web`, `pnpm build:api`) and upload the bundle as an artifact.
  3. In the deploy job, download the bundle, run `pnpm install --frozen-lockfile --config.node-linker=hoisted`, then run `npm install --no-save` inside `apps/web` so `node_modules/styled-jsx` exists locally.
  4. Execute `npx vercel build --prod --cwd ./apps/web --token $VERCEL_TOKEN`, verify `.vercel/output` and `node_modules/styled-jsx`, and finally run `npx vercel deploy --prebuilt --prod --yes --cwd ./apps/web --token $VERCEL_TOKEN`.
  5. Deploy the Cloudflare Worker with `pnpm --filter api exec wrangler deploy --env development`.
- To redeploy without rebuilding, manually run the workflow and enable the `force_deploy` input.

### 2.2 `production-deploy.yml`

- Triggers on push to `main`, or manual `workflow_dispatch`.
- Steps:
  1. Build every package and assemble the `deployment/` directory (guards fail fast if any build output is missing).
  2. Deploy the web app to Vercel with the production token (`--prod`).
  3. Deploy the Worker with `pnpm --filter api exec wrangler deploy --env production`.
  4. Print a deployment summary to the logs (Slack integration was removed; add it manually if required).

## 3. Troubleshooting

| Symptom                              | Fix                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `Authentication error [code: 10000]` | Recreate the Cloudflare token with the scopes above and verify the account id.           |
| `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`  | Run `pnpm install --no-frozen-lockfile` locally and commit the updated `pnpm-lock.yaml`. |
| Vercel step fails                    | Re-check `VERCEL_*` secrets and create a new token with `vercel login` if needed.        |

---

Last updated: 2025-09-25
