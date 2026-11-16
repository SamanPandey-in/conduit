import { stages, stageIndex } from "@/lib/pipeline";

const gate = stageIndex("risk-gate");

/** Text wordmark with a mark drawn from the 8-stage pipeline; the risk gate tick is the accent. */
export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-ink">
      <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true" className="shrink-0">
        <line x1="1" y1="6" x2="29" y2="6" className="stroke-ink" strokeWidth="1" />
        {stages.map((stage, i) => (
          <line
            key={stage.id}
            x1={1 + i * 4}
            x2={1 + i * 4}
            y1={i === gate ? 0 : 3}
            y2={i === gate ? 12 : 9}
            strokeWidth={i === gate ? 2 : 1}
            className={i === gate ? "stroke-accent" : "stroke-ink"}
          />
        ))}
      </svg>
      Conduit
    </span>
  );
}
