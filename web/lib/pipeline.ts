// The 8 stages every MCP tool call passes through in Conduit.
// This list is also the brand shape (hero pipeline, nav mark).
// TODO(user): confirm stage names against the gateway implementation.

export type StageId =
  | "authenticate"
  | "tenant-scope"
  | "grant-check"
  | "validate-args"
  | "rate-limit"
  | "risk-gate"
  | "execute"
  | "audit";

export type Stage = {
  id: StageId;
  name: string;
  detail: string;
};

export const stages: readonly Stage[] = [
  { id: "authenticate", name: "Authenticate", detail: "Verify the agent's client-credentials token." },
  { id: "tenant-scope", name: "Tenant scope", detail: "Pin every query to the token's tenant." },
  { id: "grant-check", name: "Grant check", detail: "Is this tool granted to this agent?" },
  { id: "validate-args", name: "Validate args", detail: "Check arguments against the tool's JSON Schema." },
  { id: "rate-limit", name: "Rate limit", detail: "Token bucket per agent and tool." },
  { id: "risk-gate", name: "Risk gate", detail: "High-risk tools wait for a human." },
  { id: "execute", name: "Execute", detail: "Run on a read-only role or the target service." },
  { id: "audit", name: "Audit", detail: "Record the decision, args hash and trace id." },
];

export type PipelineCall = {
  id: "pass" | "held";
  tool: string;
  args: string;
  stopsAt: StageId;
  outcome: string;
};

export const pipelineCalls: readonly PipelineCall[] = [
  {
    id: "pass",
    tool: "search_documents",
    args: '{"query": "refund window for annual plans"}',
    stopsAt: "audit",
    outcome: "Passes all 8 stages. Returns cited passages and writes an audit row.",
  },
  {
    id: "held",
    tool: "reset_password",
    args: '{"user": "cfo@acme.test"}',
    stopsAt: "risk-gate",
    outcome: "Triggered by an instruction planted in a document. Stops at the risk gate: HELD FOR APPROVAL.",
  },
];

export const HELD_LABEL = "HELD FOR APPROVAL";

export function stageIndex(id: StageId): number {
  return stages.findIndex((stage) => stage.id === id);
}
