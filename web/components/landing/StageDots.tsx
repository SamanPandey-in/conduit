import type { CallDecision } from "@/lib/call-stream";
import { stageIndex, stages, type StageId } from "@/lib/pipeline";

const stopColor: Record<CallDecision, string> = {
  allowed: "bg-ink/75",
  held: "bg-accent",
  denied: "bg-danger",
};

/** Compact 8-segment pipeline indicator for one call. Decorative; pair it with a text decision. */
export function StageDots({ stopsAt, decision }: { stopsAt: StageId; decision: CallDecision }) {
  const stop = stageIndex(stopsAt);
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {stages.map((stage, i) => {
        let color = "bg-line-strong/70";
        if (i < stop) color = "bg-ink/75";
        if (i === stop) color = stopColor[decision];
        return <span key={stage.id} className={`h-[5px] w-[11px] rounded-full ${color}`} />;
      })}
    </span>
  );
}
