# Conduit: Go gateway, Python ingestion

How the decision in [ADR-002](adr/002-go-gateway-python-ingestion.md) changes the build. Read this before starting any Conduit backend work.

## What Conduit is (and isn't)

| | Tracebase | Conduit |
| --- | --- | --- |
| **What it is** | An **agent harness** (durable loop, tool execution, step and budget limits, checkpoints) with an **eval harness** and release gate built in | A **governed tool gateway**: the controlled layer a harness calls for tools and data |
| **Runs a model loop?** | Yes | No. It answers tool calls |
| **Hot path** | The model call (seconds) | Pipeline overhead on every tool call (should be milliseconds) |
| **Backend language** | Python | Go for the gateway, Python for ingestion |

Calling Conduit a harness is wrong and easy for an interviewer to pick apart. It contains eval suites (retrieval, leakage, injection), but those test it; they are not what it is.

## Why the split

| Work | Shape | Language | Why |
| --- | --- | --- | --- |
| MCP server, eight-stage pipeline, admin API, machine auth, query-time retrieval | Many concurrent short requests; latency matters on every agent call | **Go** | Goroutine per request, no event loop to block, low memory per connection, one static binary, fast cold starts when Cloud Run scales to zero. The gateway category is Go's home ground |
| Extract, chunk, embed, quality report | Batch, CPU-heavy parsing, rarely latency-sensitive | **Python** | PyMuPDF and Python's text tooling have no Go equal; embedding calls are API calls either way |
| Retrieval evals, leakage and injection suites | Scripts that score the running service | **Python** | They call the gateway over HTTP as a black box, so they test the real thing; pandas-style tables for results |

"Go makes AI apps faster" is only true for this kind of work. The model call dominates latency in a harness, so Tracebase gains little from Go and loses Python's eval and structured-output ecosystem.

## Services

```
  web (Next.js)  ──human JWT (EdDSA, aud=conduit-api)──▶  gateway (Go)  ◀──agent JWT (aud=conduit)──  MCP clients
                                                             │
                                     reads/writes            │  INSERT ingest_jobs
                                     chunks, grants,         │  then trigger the ingest job
                                     approvals, audit        ▼
                                                        Postgres 17 + pgvector  ◀── writes chunks ──  ingest (Python worker)
                                                             │                                         claims jobs with
                                                        Redis (rate limits)                            FOR UPDATE SKIP LOCKED
```

- **gateway** (Go, Cloud Run service): `/mcp` (Streamable HTTP), `/v1/*` admin REST for the web app, `/me`, `/oauth/token` (client credentials), `/.well-known/jwks.json` for agent tokens, `/healthz`.
- **ingest** (Python, Cloud Run **job**): drains `ingest_jobs` and exits. The gateway starts a job execution after committing a new row, so nothing idles and nothing is lost if the trigger fails (the next run drains it). Locally: `uv run python -m ingest.worker --drain`.
- **web** (Next.js): unchanged. `lib/api.ts` already sends a 15-minute EdDSA JWT; the gateway verifies it the same way FastAPI did.

## Repository layout

```
conduit/
├── web/                     # unchanged
├── gateway/                 # Go module
│   ├── cmd/gateway/         # main: config, wiring, graceful shutdown
│   ├── internal/auth/       # human JWT (web JWKS) + agent JWT (own keys), /me
│   ├── internal/pipeline/   # one file per stage, run in order, each returns a Decision
│   ├── internal/mcp/        # MCP server, tools/list filtered by grants, _meta trace_id
│   ├── internal/tools/      # search_documents, get_passage, lookup_user, reset_password
│   ├── internal/retrieval/  # vector + FTS + RRF + rerank; the ONE tenant/ACL repository fn
│   ├── internal/approvals/  # held calls, exactly-once approve
│   ├── internal/audit/      # one row per call, every decision
│   └── internal/store/      # pgx pool, queries
├── ingest/                  # Python package (uv)
│   ├── ingest/worker.py     # claim job, process, mark done/failed
│   ├── ingest/extract.py    # PyMuPDF
│   ├── ingest/chunk.py      # structure-aware chunking
│   ├── ingest/embed.py      # Vertex AI embeddings
│   └── ingest/quality.py    # report per document
├── evals/                   # Python: retrieval, leakage canary, injection suites (black-box)
├── db/migrations/           # plain SQL, the single schema owner (goose)
└── docker-compose.yml       # Postgres + pgvector, Redis
```

## Libraries (verify current versions in the Day 2 spike)

| Need | Go choice | Note |
| --- | --- | --- |
| HTTP | `net/http` (method + path patterns), `log/slog` | No framework needed |
| MCP server | `github.com/modelcontextprotocol/go-sdk` | Official SDK. The spike proves Streamable HTTP + a real client |
| Postgres | `github.com/jackc/pgx/v5` + `pgxpool`, `github.com/pgvector/pgvector-go` | Native `vector` type |
| JWT / JWKS | `github.com/lestrrat-go/jwx/v3` | EdDSA, JWKS cache with refresh, strict claim validation |
| JSON Schema | `github.com/santhosh-tekuri/jsonschema/v6` | Stage 4, compile schemas once at startup |
| Rate limit | `github.com/redis/go-redis/v9` + `github.com/go-redis/redis_rate/v10` | GCRA in one Redis call, shared across instances |
| Embeddings, answers | `google.golang.org/genai` (Vertex backend) | Query-time embedding and cited answers |
| Rerank | `cloud.google.com/go/discoveryengine` ranking API | Optional, behind an interface |
| Migrations | `github.com/pressly/goose/v3` on plain SQL | Single binary in CI, Python never migrates |
| Tracing | OpenTelemetry Go | `trace_id` from MCP `_meta` becomes the span's parent |

Python side: `pymupdf`, `google-genai`, `psycopg[binary]`, `pydantic`. Ruff, pyright, pytest.

## Contracts that must not drift

These cross the language boundary. Each lives in one place and both sides read it.

1. **Schema:** `db/migrations/*.sql` only. Neither service creates or alters tables. (Better Auth's tables stay owned by `web`.)
2. **Embedding model and dimension:** a row in `settings` (`embedding_model`, `embedding_dim`), written by migration. The worker embeds with it; the gateway refuses to start if its configured model differs. A query embedded by a different model than the corpus silently returns nonsense.
3. **Text-search config:** `to_tsvector('english', …)` at ingest must match `websearch_to_tsquery('english', …)` at query time. Same `settings` row.
4. **Chunk ids and citations:** `c_<id>` format and the `(doc, location, chunk)` citation shape, defined in `db/migrations` comments and tested on both sides.
5. **Error codes:** `DENIED`, `INVALID_ARGS`, `RATE_LIMITED`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED` as Go constants; the Python eval suites assert on the same strings.

## Auth

- **Human tokens:** port `kit/api/app/auth.py` to `internal/auth`: fetch the web app's JWKS (`<BETTER_AUTH_URL>/api/auth/jwks`), accept EdDSA only, require `sub iss aud exp iat`, `aud = conduit-api`. Port the four kit tests: valid → 200, tampered / expired / wrong-aud / unsigned → 401.
- **Agent tokens:** the gateway issues them (client credentials, `sub = agent:<id>`, `aud = conduit`, tenant claim) from its own Ed25519 key, published at `/.well-known/jwks.json`. Secrets stored hashed. Revocation by agent id is checked in stage 1.
- **Never mixed:** human tokens can't call `/mcp`, agent tokens can't reach `/v1/approvals`. Enforced by audience, tested both ways.
- **Kit change:** `kit/sync.mjs` currently copies `api/` into both products. Add a `--web-only` flag and use it for Conduit, so the kit's Python API files stop landing in a repo that no longer has a Python API.

## Changes to the 7-day plan (Conduit only)

| Day | Was | Now |
| --- | --- | --- |
| 2 | FastAPI: upload, extract, chunk, embed, answer | **Go** gateway skeleton: `/healthz`, `/me` with ported token tests, pgx pool. **Python** ingest worker: extract, fixed chunks, embed, write `chunks`. `db/migrations` with goose. **Spikes:** MCP Go SDK (90 min, decides ADR-002's fallback) and pgvector HNSW from Go via pgx (60 min) |
| 3 | Debugger, tool registry stubs, one real tool | Same scope, in Go. CI gains `go vet`, `golangci-lint`, `go test -race` beside ruff / pyright / pytest |
| 4 | Hybrid retrieval in Python | Hybrid retrieval in Go (`internal/retrieval`): vector + FTS + RRF, the one tenant/ACL function. Chunking improvements stay in Python. Eval set runs against the gateway over HTTP |
| 5 | MCP server in Python | MCP server in Go: `tools/list` per agent, client-credentials issuance, JSON Schema validation, Redis rate limit, audit rows |
| 6 | Approvals, isolation | Same, in Go. Exactly-once approval is a conditional `UPDATE … WHERE status = 'pending'`; only the winner executes |
| 7 | Prove it | Add gateway overhead to the numbers: p50/p95 of the pipeline excluding tool execution, measured, not estimated |

Integration with Tracebase does not change: it is MCP over HTTP, so the gateway's language is invisible to the harness.

## Risks

- **Two toolchains in a seven-day plan.** Mitigation: the Python side is one worker with no HTTP surface; everything request-facing is Go.
- **MCP Go SDK maturity.** Mitigation: Day 2 spike with the fallback in ADR-002.
- **Embedding drift between languages.** Mitigation: the `settings` row and the startup check above.
- **Go learning curve.** Keep the code plain: standard library HTTP, explicit errors, table-driven tests. No framework, no generics-heavy abstractions.
