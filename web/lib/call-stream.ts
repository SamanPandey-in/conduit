// Illustrative data for the hero product mock (the admin approvals view).
// Sample values for the demo tenant `acme`, not measurements or real traffic.

import type { StageId } from "@/lib/pipeline";

export type CallDecision = "allowed" | "held" | "denied";

export type StreamCall = {
  id: string;
  time: string;
  tool: string;
  principal: string;
  decision: CallDecision;
  /** Last stage the call reached. `audit` means it passed all 8. */
  stopsAt: StageId;
  latency: string | null;
};

export const heldCall: StreamCall = {
  id: "tr_7c1e0a92",
  time: "14:07:31",
  tool: "reset_password",
  principal: "agent:it-triage",
  decision: "held",
  stopsAt: "risk-gate",
  latency: null,
};

export const callStream: readonly StreamCall[] = [
  heldCall,
  { id: "tr_7c1e0a91", time: "14:07:29", tool: "search_documents", principal: "agent:it-triage", decision: "allowed", stopsAt: "audit", latency: "212 ms" },
  { id: "tr_7c1e0a8f", time: "14:07:12", tool: "get_passage", principal: "agent:it-triage", decision: "allowed", stopsAt: "audit", latency: "38 ms" },
  { id: "tr_7c1e0a8c", time: "14:06:58", tool: "lookup_user", principal: "agent:it-triage", decision: "allowed", stopsAt: "audit", latency: "91 ms" },
  { id: "tr_7c1e0a88", time: "14:06:40", tool: "reset_password", principal: "agent:billing-bot", decision: "denied", stopsAt: "grant-check", latency: null },
  { id: "tr_7c1e0a87", time: "14:06:37", tool: "search_documents", principal: "agent:billing-bot", decision: "allowed", stopsAt: "audit", latency: "187 ms" },
];

export type AdminNavIcon = "ask" | "documents" | "retrieval" | "grants" | "approvals" | "audit" | "agents";

export const adminNav: readonly { label: string; icon: AdminNavIcon; badge?: number; active?: boolean }[] = [
  { label: "Ask", icon: "ask" },
  { label: "Documents", icon: "documents" },
  { label: "Retrieval", icon: "retrieval" },
  { label: "Tools & grants", icon: "grants" },
  { label: "Approvals", icon: "approvals", badge: 1, active: true },
  { label: "Audit log", icon: "audit" },
  { label: "Agents", icon: "agents" },
];
