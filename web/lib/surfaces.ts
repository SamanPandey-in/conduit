// Illustrative data for the product surface mockups. Replaced by real
// screenshots on Day 3. Ranks and ids are sample values, not measurements.

export const askSample = {
  question: "What is the refund window for annual plans?",
  answer: [
    { text: "Annual plans are refunded in full within 30 days of purchase", cite: 1 },
    { text: "After that, refunds are prorated by unused months", cite: 2 },
    { text: "Plans bought through a reseller follow the reseller's terms", cite: 3 },
  ],
  sources: [
    { n: 1, doc: "billing-policy.pdf", loc: "p. 4", chunk: "c_0192" },
    { n: 2, doc: "billing-policy.pdf", loc: "p. 5", chunk: "c_0197" },
    { n: 3, doc: "partner-terms.md", loc: "section 2.1", chunk: "c_0841" },
  ],
};

export const retrievalSample = {
  query: "refund window annual plan",
  relevant: "c_0192",
  columns: [
    { label: "Vector", ranks: ["c_0311", "c_0197", "c_0045", "c_0192", "c_0730"] },
    { label: "Keyword", ranks: ["c_0192", "c_0841", "c_0197", "c_0612", "c_0311"] },
    { label: "Fused", ranks: ["c_0197", "c_0192", "c_0311", "c_0841", "c_0045"] },
    { label: "Reranked", ranks: ["c_0192", "c_0197", "c_0841", "c_0311", "c_0045"] },
  ],
};

export type Grant = {
  principal: string;
  tool: string;
  scope: string;
  risk: "low" | "medium" | "high" | null;
  decision: "allow" | "hold" | "not granted";
};

export const grantsSample: readonly Grant[] = [
  { principal: "agent:it-triage", tool: "search_documents", scope: "tenant acme, ACL support", risk: "low", decision: "allow" },
  { principal: "agent:it-triage", tool: "get_passage", scope: "tenant acme, ACL support", risk: "low", decision: "allow" },
  { principal: "agent:it-triage", tool: "lookup_user", scope: "read-only role, 30/min", risk: "medium", decision: "allow" },
  { principal: "agent:it-triage", tool: "reset_password", scope: "ticket service", risk: "high", decision: "hold" },
  { principal: "agent:billing-bot", tool: "reset_password", scope: "hidden from tools/list", risk: null, decision: "not granted" },
];
