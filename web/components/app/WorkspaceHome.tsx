import { Suspense } from "react";

import { apiGet } from "@/lib/api";
import { product } from "@/lib/product";
import type { CurrentUser } from "@/lib/session";

/**
 * Conduit's /app body (kit contract: each product exports WorkspaceHome).
 * Empty state until the gateway ships, plus the JWT-bridge check against /me.
 */
export function WorkspaceHome({ user, sampleRequested }: { user: CurrentUser; sampleRequested: boolean }) {
  const sample = sampleRequested ? "requested" : undefined;
  return (
    <>
      <section
        aria-labelledby="empty-title"
        className="rounded-md border border-dashed border-line px-6 py-12 text-center"
      >
        <h2 id="empty-title" className="text-lg font-semibold text-fg">
          {product.emptyState.title}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{product.emptyState.description}</p>
        <button
          type="button"
          disabled
          aria-describedby="sample-note"
          className="mt-6 inline-flex h-11 cursor-not-allowed items-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent opacity-60"
        >
          {product.emptyState.action}
        </button>
        <p id="sample-note" className="mt-3 text-xs text-muted">
          {sample === "requested" ? "Noted. " : null}
          Loading sample data needs the API runtime, which ships next. Nothing is faked here.
        </p>
      </section>

      <Suspense fallback={<IdentityFrame>Checking the API…</IdentityFrame>}>
        <ApiIdentity user={user} />
      </Suspense>
    </>
  );
}

type MeResponse = { sub: string; role: string } & Record<string, string | null>;

/** Proves the JWT bridge: the API verifies our token via JWKS and echoes the claims. */
async function ApiIdentity({ user }: { user: CurrentUser }) {
  const result = await apiGet<MeResponse>("/me");
  return (
    <IdentityFrame>
      {result.ok ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-mono text-xs">
          <dt className="text-muted">sub</dt>
          <dd className="truncate text-fg">{result.data.sub}</dd>
          <dt className="text-muted">{product.workspaceClaim}</dt>
          <dd className="text-fg">{result.data[product.workspaceClaim] ?? "none"}</dd>
          <dt className="text-muted">role</dt>
          <dd className="text-fg">{result.data.role}</dd>
          <dt className="text-muted">match</dt>
          <dd className="text-fg">{result.data.sub === user.id ? "token sub = session user" : "MISMATCH"}</dd>
        </dl>
      ) : (
        <p className="text-sm text-muted">
          API not connected ({result.error}
          {result.status ? `, ${result.status}` : ""}). Start it with{" "}
          <code className="font-mono text-xs text-fg">uv run uvicorn app.main:app --port 8000</code> in <code className="font-mono text-xs text-fg">api/</code>.
        </p>
      )}
    </IdentityFrame>
  );
}

function IdentityFrame({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby="api-title" className="rounded-md border border-line p-4">
      <h2 id="api-title" className="mb-3 text-sm font-medium text-fg">
        API session
      </h2>
      {children}
    </section>
  );
}
