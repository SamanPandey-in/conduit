# Conduit web

Marketing landing page for **Conduit**, a governed MCP gateway: cited retrieval, scoped tools, approvals and an audit log.

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4. The page is fully static.

## Run

```bash
pnpm install
pnpm dev     # http://localhost:3001
pnpm lint
pnpm build
pnpm start   # production server on :3001
```

## Layout

- `app/` – layout, page, design tokens (`globals.css` `@theme`) and the pipeline animation CSS
- `components/landing/` – one file per page section; `RunOnView` and `CopyButton` are the only client components
- `components/ui/` – primitives shared by several sections
- `lib/` – site config (all external and placeholder URLs), pipeline stages and sample data

Placeholder URLs and stage names are marked `TODO(user)`. Metrics in `lib/metrics.ts` stay `null` until measured.
