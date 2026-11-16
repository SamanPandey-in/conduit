// What Conduit is built on, and the job each piece does (PRODUCT.md). These
// are dependencies, not customers or partners.
export type StackItem = { name: string; role: string };

export const stack: StackItem[] = [
  { name: "Postgres + pgvector", role: "documents + retrieval" },
  { name: "Vertex AI", role: "embeddings + model" },
  { name: "Redis", role: "rate limits" },
  { name: "FastAPI", role: "API" },
  { name: "MCP", role: "tools" },
];
