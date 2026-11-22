# Product

<!-- impeccable:product-schema 1 -->

> Written from `Tracebase + Conduit 7-Day Parallel Build Plan.md` without a live interview (the owner asked to proceed directly). Lines marked _(inferred)_ are assumptions to confirm.

## Platform

web

## Users

- **Primary:** platform/security-minded engineers and admins who want to give AI agents access to company data and tools without handing over credentials or unbounded actions.
- **Machine clients:** agents (e.g. Tracebase) connecting over MCP with client-credentials JWTs. Human auth (admin and chat UI) is separate.
- **Secondary:** hiring managers and interviewers evaluating the author's engineering work _(inferred from the portfolio goal in the plan)_.

## Product Purpose

Conduit is a governed MCP gateway: cited retrieval, scoped tools, approvals and an audit log. Success: hybrid retrieval beats the vector baseline on recall@5/MRR, zero cross-tenant leaks across adversarial queries, and planted-injection tool calls are held for approval instead of executing.

## Positioning

Agents get data through one gateway where every call passes the same pipeline (authenticate, tenant scope, grant check, argument validation, rate limit, risk gate, execute, audit). High-risk calls stop at the risk gate as `PENDING_APPROVAL` and an admin sees the exact arguments.

Conduit is **not an agent harness**: it never runs a model loop. It is a **governed tool gateway**, the controlled layer that harnesses (Tracebase, Claude, Cursor) call for tools and data. Its eval suites test it; they are not what it is.

## Operating Context

- Demo tenant `acme` with a demo corpus; adversary tenant `globex` with a `GLOBEX-CANARY` string used in leakage tests.
- Stack: Go gateway (MCP over Streamable HTTP, eight-stage pipeline, admin API, machine auth, query-time retrieval), Python ingestion worker (PyMuPDF, chunking, Vertex AI embeddings), Postgres + pgvector + FTS (RRF fusion), Redis, Cloud Run. See ADR-002 and `docs/GO-GATEWAY-PLAN.md`.
- Tools: `search_documents`, `get_passage`, `lookup_user`, high-risk `reset_password` on a mock ticket service.
- Error codes: `DENIED`, `PENDING_APPROVAL`, `RATE_LIMITED`, `INVALID_ARGS`.

## Capabilities and Constraints

- Capabilities C1–C11 (upload/extract, chunk/embed, quality report, cited answers, retrieval debugger, tool registry, MCP server, grants, approvals, audit, evals).
- The 8 pipeline stage names are **undecided** (current proposal above).
- Human auth (this web app) and machine auth (client-credentials) must stay separate.

## Brand Commitments

- Name: Conduit. Light surface by default, 1px rules, one accent; the 8-stage pipeline is the brand shape.
- Copy rules: no generic CTA copy; primary CTA is "Run the demo". Line "Works with Tracebase".

## Evidence on Hand

- No measured numbers yet: recall@5 and MRR land Day 4; leakage and attack success rate land Day 6. Never publish an unmeasured number.
- No customers, logos or testimonials exist; none may be implied.
- Real screenshots land Day 3.

## Product Principles

1. Least privilege by default: agents see only the tools they are granted.
2. Every answer cites its sources; every action leaves an audit row.
3. Risky actions wait for a human; the human sees exact arguments.
4. Measure retrieval and isolation, publish only what was measured.

## Accessibility & Inclusion

WCAG 2.2 AA contrast and keyboard access; respect `prefers-reduced-motion` _(inferred standard)_.
