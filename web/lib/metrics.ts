// Evaluation metrics for the landing page. Every value stays null until the eval
// scripts have produced it. Never put an estimate here.

export type MetricRow = { label: string; value: string | null };

export type Metric = {
  id: string;
  title: string;
  method: string;
  rows: readonly MetricRow[];
};

export const metrics: readonly Metric[] = [
  {
    id: "recall-at-5",
    title: "recall@5",
    method: "Vector baseline vs hybrid retrieval",
    rows: [
      { label: "Vector baseline", value: null },
      { label: "Hybrid", value: null },
    ],
  },
  {
    id: "mrr",
    title: "MRR",
    method: "Vector baseline vs hybrid retrieval",
    rows: [
      { label: "Vector baseline", value: null },
      { label: "Hybrid", value: null },
    ],
  },
  {
    id: "cross-tenant-leaks",
    title: "Cross-tenant leaks",
    method: "Adversarial queries as acme for GLOBEX-CANARY",
    rows: [{ label: "Leaked passages", value: null }],
  },
  {
    id: "attack-success-rate",
    title: "Attack success rate",
    method: "Planted-injection documents",
    rows: [{ label: "Injected calls executed", value: null }],
  },
];
