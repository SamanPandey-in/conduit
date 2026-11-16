# Conduit design system

Landing page and tokens for `web/`. Kit pages (login, onboarding, `/app`, legal, 404) consume the same tokens through a small contract, listed at the end.

## Concept: governed light through glass

A gateway is glass. Data passes through it, gets filtered and redirected, and you can see inside. Every visual decision follows from that:

- The canvas is cool white, the text is ink, structure is hairline rules. Nothing on the page is decorative chrome.
- Colour arrives as light: soft gradients over grids, never photography. **Amber** is the brand accent and the `HELD FOR APPROVAL` state. **Cobalt** is secondary and mostly lives in imagery.
- The visuals are the product. Every section is illustrated with real Conduit UI drawn in code (approvals inbox, approval card, cited answer, retrieval debugger, grants table), floating on a code-drawn backdrop panel.

## Tokens (`web/app/globals.css`, Tailwind 4 `@theme`)

The default Tailwind palette, radii, type scale and shadows are cleared, so components can only use these.

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#fafbfc` | Page canvas (cool white, not beige) |
| `surface` | `#ffffff` | Cards, product UI |
| `sunken` | `#f4f6f8` | Code blocks, sidebars, card footers |
| `line` / `line-strong` | `#e4e7ec` / `#cbd1d9` | Hairlines / control borders, rails |
| `ink` (= `fg`) | `#0f1216` | Text, primary buttons |
| `muted` | `#5a6270` | Secondary text (5.9:1 on `bg`) |
| `accent` | `#a85507` | Deep amber. Held state, the risk gate, citations. White on it is 5.3:1; as text on `bg` 5.1:1 |
| `accent-soft` / `accent-line` | `#fdf4e4` / `#efcf9d` | Amber wash and its border |
| `honey` | `#e8a23a` | Decorative amber only (logo pane, the funnel line). Never text |
| `cobalt` / `cobalt-soft` | `#2343d9` / `#eef1fe` | Secondary, reserved. Currently image-borne only |
| `ok` / `ok-soft` | `#18794a` / `#e7f5ed` | Allowed. Nothing else |
| `danger` / `danger-soft` | `#b42318` / `#fdecea` | Denied / executed-without-approval. Nothing else |
| `night` | `#0b0c0f` | The Connect band |

Radii: `sm` 6, `md` 10, `lg` 14 (product cards), `xl` 20, `2xl` 28 (backdrop panels), `full` (pills).
Shadows: `card` (resting cards on the canvas), `float` (a product card on a backdrop panel).

## Type

Loaded with `next/font/google` in `app/layout.tsx`.

| Role | Family | Rules |
| --- | --- | --- |
| Display (`font-display`, `.display`) | Newsreader, `opsz` axis | Weight 400, upright (never italic), tracking -0.035em, line-height 1.02, `text-wrap: balance`. h1 `clamp(2.75rem, 7.2vw, 5.5rem)`, h2 `clamp(2.125rem, 4.6vw, 3.5rem)`, h3 `clamp(1.875rem, 3.4vw, 2.625rem)` |
| UI and body (`font-sans`) | Host Grotesk | Body 17px/28px muted. UI inside product cards 13px/20px |
| Data (`font-mono`) | Geist Mono | Tool names, agents, args, ids, error codes, micro-labels |

`.micro` is the mono 12px label above a section title. It must be a real identifier from the product (`tools/call`, `PENDING_APPROVAL`, `search_documents · get_passage`, `tools/list`), never a slogan or a number.

The kit scale `text-xs … text-3xl` is unchanged; `text-2xs` (11px) was added for dense product UI.

## Backgrounds and what they mean

No photographs. Backdrops are drawn in CSS (`components/ui/Panel.tsx` + `.panel-*` in globals.css) or as a dither field on canvas (`components/landing/Dither.tsx`).

| Backdrop | Drawing | Where |
| --- | --- | --- |
| urora | soft amber, rose and cobalt light over an 18px dot grid (Stripe-like) | Hero app |
| grid | 28px line grid with a cobalt glow: a boundary | Held-for-approval card |
| dots | 14px dot grid with a warm glow | Cited answer |
| channels | parallel vertical channels: one query, ranked four ways | Retrieval debugger |
| Dither funnel | loose streams converge through one gate and leave as one honey line: many agents, one governed path | Connect band |

Document- and code-like blocks are real chrome: a PDF viewer (toolbar, page counter, paper page, margin annotation), an agent log, and an `mcp.json` editor tab with line numbers.

## Components

- `components/ui/Logo.tsx`: `Logo` (kit contract) and `LogoMark`. A line of light enters an amber pane and leaves redirected.
- `components/ui/Panel.tsx`: rounded (`2xl`) code-drawn backdrop panel (`aurora`, `grid`, `dots`, `channels`).
- `components/ui/SectionHeader.tsx`: micro-label, serif title, optional lede. `as="h3"` for the split sections.
- `.ui-card` (globals.css): white product card with the `float` shadow. Only used on a `Panel`.
- `components/landing/AppWindow.tsx`: the hero admin app (sidebar, approvals inbox, call stream). Sample data in `lib/call-stream.ts`.
- `components/landing/StageDots.tsx`: 8-segment per-call pipeline indicator. Passed stages ink, the stop stage amber (held), red (denied) or ink (allowed).
- `components/landing/Pipeline.tsx` + `.pipe-*` (globals.css): the 8 stages and two call lanes. Data in `lib/pipeline.ts`.
- Buttons: pills. Primary is ink on white (white on the dark band); secondary is outlined. Amber is not a button colour on the landing page.
- Status labels: mono, uppercase, 11px. `ALLOWED` green, `HELD FOR APPROVAL` amber, `DENIED` / `EXECUTED` red.

Page order: Nav, Hero, Built on, Pipeline, Without / With, Surfaces (Ask, Tool grants), Evaluation, Connect, kit footer. The retrieval debugger (`components/landing/RetrievalDebugger.tsx`) is built but not on the page: two ideas per section, not three.

## Motion

CSS only, no dependencies.

1. **Signature: the pipeline run.** When the diagram scrolls into view (`RunOnView` sets `data-run`), a packet for `search_documents` travels all eight stages and is tagged `ALLOWED`; then the `reset_password` packet travels to stage 6, stops on the amber pane, pulses once and is tagged `HELD FOR APPROVAL`. Nodes light as the packet arrives.
2. **Scroll-driven reveals.** `.reveal` (fade and 28px rise) and `.panel-img` (image settles from 1.09 to 1) use `animation-timeline: view()` inside `@supports`. Browsers without it show the final state.
3. Hover transitions are 150ms colour changes only.

`prefers-reduced-motion: reduce`, or no JavaScript, shows the final state of everything: packets at their stop stage, tags visible.

## Honesty rules

- No customer logos, testimonials, user counts or invented metrics. "Built on" lists dependencies as plain text.
- Product mocks say "Sample workspace" or "Sample data". The "Without a gateway" sequence is labelled illustrative.
- No evaluation numbers on the page until they are measured; when they are, add them as a section with the measurement method next to each number.
- No build-plan language on the landing page (no days, no internal milestones).

## Do

- Use product UI as the illustration. Use real tool names, error codes and ids from `lib/`.
- Keep amber rare: the gate, the held state, citations, the relevant chunk.
- One product card per panel; the drawn backdrop stays visible around it.
- Check 360px for horizontal overflow whenever a card gains a column.

## Don't

- Italic serif headlines, gradient text, icon-tile grids, cards inside cards, numbered section labels, emoji, "Get started".
- Green or red for anything but allow / deny outcomes.
- Photographs or stock imagery anywhere on the page.
- A new background image without a meaning that fits the table above.

## Kit contract (do not break)

Kit pages use only: colours `bg, surface, line, muted, fg, accent, on-accent, danger`; `font-sans`, `font-mono`; `rounded-sm`, `rounded-md` (and `rounded-full`); `text-xs … text-3xl`. `components/ui/Logo.tsx` must export `Logo`. The landing page must keep `<SiteFooter note="…" />` and an element with id `surfaces-title` (`site.links.features` points at it).
