# Conduit: local development

A governed MCP gateway: cited retrieval, scoped tools, approvals and an audit log.

| Dir | What |
| --- | --- |
| `web/` | Next.js 16 app: landing page, sign-in for humans (Better Auth), onboarding, protected `/app` |
| `api/` | FastAPI service. Today: `/me`, which verifies the web app's JWTs via JWKS. **Being replaced** by the Go gateway (`gateway/`) and a Python ingest worker (`ingest/`): see [ADR-002](adr/002-go-gateway-python-ingestion.md) and [GO-GATEWAY-PLAN.md](GO-GATEWAY-PLAN.md) |
| `docs/adr/` | Architecture decisions |

Auth code in `web/` and `api/` comes from the shared kit (`../kit`); see its README before editing it. This auth is for humans only. Agents will use client-credentials tokens, which are built separately.

## Run locally

Needs Docker, Node 22+, pnpm 10, uv.

```bash
docker compose up -d --wait                 # Postgres + pgvector on 127.0.0.1:15433

cd web
cp .env.example .env.local                  # then set BETTER_AUTH_SECRET
pnpm install
pnpm auth:migrate                           # creates the auth tables
pnpm dev                                    # http://localhost:3001

cd ../api
uv sync
uv run uvicorn app.main:app --port 8001     # http://localhost:8001/me
```

## Sign-in setup

Email + password and "Continue as demo" work with no extra setup. Confirmation and reset links are printed to the `pnpm dev` log until an email provider is set.

| Method | What to set in `web/.env.local` |
| --- | --- |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Redirect URI `http://localhost:3001/api/auth/callback/google`, scopes `openid email profile` |
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. Callback `http://localhost:3001/api/auth/callback/github`, one OAuth app per environment |
| Email delivery | `RESEND_API_KEY`, `EMAIL_FROM` (a domain verified in Resend). Required in production |

Buttons for a provider appear once both of its values are set. Restart `pnpm dev` after editing the file.

Auth code lives in the shared kit (`../kit`). Edit it there, then run `node ../kit/sync.mjs .` from the repo root.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Sign-in returns `INVALID_ORIGIN` | `BETTER_AUTH_URL` doesn't match the origin the app is served from (port included) | Set it to the exact URL in the browser bar, restart `pnpm dev` |
| Google shows `redirect_uri_mismatch` | The OAuth client's redirect URI differs from `<BETTER_AUTH_URL>/api/auth/callback/google` | Add the exact URI in the Google Cloud console |
| Sign-up fails in production with "Email is not configured" | `RESEND_API_KEY` or `EMAIL_FROM` missing. This is deliberate: dropping confirmation links silently would lock every new user out | Set both; `EMAIL_FROM` must use a domain verified in Resend |
| A page shows "Something went wrong", console says `ECONNREFUSED 127.0.0.1:15433` | The Postgres container stopped (it happens when Docker's VM is shut down under memory pressure) | `docker compose up -d --wait`. Data lives in a volume, nothing is lost |
| Every page 500s, `pnpm dev` prints a Turbopack `FATAL` with `exit code 0xc0000142` | Windows couldn't start Turbopack's helper process, usually when the machine is short on memory or process resources. Not a code error | Stop the dev server, free memory, start it again. If it persists, delete `web/.next` (build cache only) and restart |
| Dev servers started from Claude Code stop by themselves | Claude Code stops idle background shells when the system is critically low on memory | Restart them; run long-lived servers in your own terminal instead |

## Checks

```bash
cd web && pnpm lint && npx tsc --noEmit && pnpm test && pnpm build
cd api && uv run ruff check . && uv run pytest
```
