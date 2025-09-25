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

1. Open Cloudflare Dashboard → My Profile → API Tokens → Create Token → Custom Token.
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

## 2. Workflow highlights

### 2.1 `dev-deploy.yml`

- Triggers on push/PR to `develop`, or can be run manually.
- Steps:
  1. Install dependencies and build shared packages.
  2. Build web (`pnpm build:web`) and API (`pnpm build:api`).
  3. Upload/download the deployment artifact.
  4. Deploy the Next.js app through Vercel (`--prod`).
  5. Deploy the Cloudflare Worker via `pnpm --filter api exec wrangler deploy --env development`.
  6. Post Slack summary if `SLACK_WEBHOOK_URL_DEV` is configured.
- To redeploy without rebuilding, manually run the workflow and enable the `force_deploy` input.

### 2.2 `production-deploy.yml`

- Triggers on push to `main`, or manual `workflow_dispatch`.
- Steps:
  1. Full workspace build and packaging into `deployment/`.
  2. Deploy the web app to Vercel (`--prod`).
  3. Deploy the Worker with `pnpm --filter api exec wrangler deploy --env production`.
  4. Post Slack summary if `SLACK_WEBHOOK_URL_PROD` is configured.

## 3. Troubleshooting

| Symptom                              | Fix                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `Authentication error [code: 10000]` | Recreate the Cloudflare token with the scopes above and verify the account id.           |
| `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`  | Run `pnpm install --no-frozen-lockfile` locally and commit the updated `pnpm-lock.yaml`. |
| Vercel step fails                    | Re-check `VERCEL_*` secrets and create a new token with `vercel login` if needed.        |

---

Last updated: 2025-09-25
