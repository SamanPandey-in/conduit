/**
 * Product-specific values for the shared auth kit. This is the only kit file that
 * differs between Tracebase and Conduit; everything else is copied verbatim.
 *
 * This auth is for humans (admin and chat UI). Machine clients (agents) use
 * client-credentials JWTs, built separately (Day 5).
 */
export const product = {
  name: "Conduit",
  /** What a user's workspace is called in this product. */
  workspaceNoun: "workspace",
  /** JWT claim carrying the tenant id (the API reads the same claim). */
  workspaceClaim: "tenant",
  /** `aud` on JWTs minted for this product's FastAPI service. */
  apiAudience: "conduit-api",
  /** Tenant every demo user lands in (seeded with the demo corpus, reset nightly). */
  demoWorkspace: "acme",
  onboarding: {
    nameStep: {
      title: "Name your workspace",
      description: "A workspace is one tenant: its documents, tool grants, approvals and audit log.",
      placeholder: "Acme support",
    },
    sampleStep: {
      title: "Load the demo corpus",
      description:
        "The acme corpus: policy PDFs, a runbook set and three documents with planted injections. Ask it questions, then watch the risk gate hold a bad call.",
      action: "Load demo corpus",
    },
  },
  emptyState: {
    title: "No documents yet",
    description: "Load the acme demo corpus to try cited answers, the retrieval debugger and tool grants.",
    action: "Load demo corpus",
  },
} as const;
