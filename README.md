# Conduit

A governed MCP gateway: cited retrieval, scoped tools, approvals and an audit log.

| Dir | What |
| --- | --- |
| `web/` | Next.js 16 app: landing page, sign-in for humans (Better Auth), onboarding, protected `/app` |
| `api/` | FastAPI service. Today: `/me`, which verifies the web app's JWTs via JWKS |
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

"Continue as demo" works with no OAuth setup. Google and GitHub buttons appear once their client id and secret are in `.env.local`.

## Checks

```bash
cd web && pnpm lint && npx tsc --noEmit && pnpm test && pnpm build
cd api && uv run ruff check . && uv run pytest
```
