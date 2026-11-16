import type { CSSProperties } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HELD_LABEL, pipelineCalls, stageIndex, stages } from "@/lib/pipeline";
import { RunOnView } from "./RunOnView";

const gateIndex = stageIndex("risk-gate");

export function Pipeline() {
  return (
    <section id="pipeline" aria-labelledby="pipeline-title" className="section-t mx-auto max-w-6xl px-4 md:px-8">
      <SectionHeader
        id="pipeline-title"
        micro="tools/call"
        title={
          <>
            One gateway. <br className="hidden sm:block" />
            The same eight stages for every call.
          </>
        }
        lede="Retrieval and tools go through one pipeline. A call that fails a stage stops there, and the audit log says where and why."
      />

      <RunOnView>
        <div className="pipe mt-12 border-y md:mt-16">
          <ol className="pipe-stages">
            {stages.map((stage, i) => (
              <li
                key={stage.id}
                className="flex min-w-0 flex-col justify-center border-b px-4 last:border-b-0 lg:justify-start lg:border-b-0 lg:border-l lg:px-5 lg:pt-6 lg:pb-7 lg:first:border-l-0"
              >
                <span className={`font-mono text-2xs ${i === gateIndex ? "text-accent" : "text-muted"}`}>
                  {i + 1}
                  <span className="sr-only">. </span>
                </span>
                <span className="mt-0.5 text-[0.9375rem] font-medium tracking-tight lg:mt-3">{stage.name}</span>
                <span className="truncate text-[0.8125rem] leading-5 text-muted lg:mt-1.5 lg:whitespace-normal">
                  {stage.detail}
                </span>
              </li>
            ))}
          </ol>

          {/* Decorative: the two outcomes are stated in text right below. */}
          <div className="pipe-lanes lg:border-t" aria-hidden="true">
            {pipelineCalls.map((call) => {
              const stop = stageIndex(call.stopsAt);
              const held = call.id === "held";
              return (
                <div
                  key={call.id}
                  className="pipe-lane lg:border-t lg:first:border-t-0"
                  data-lane={call.id}
                  style={{ "--stop": stop } as CSSProperties}
                >
                  <p className="pipe-call font-mono text-xs text-ink">
                    <span className="font-medium">{call.tool}</span> <span className="text-muted">{call.args}</span>
                  </p>
                  <div className="pipe-track">
                    <span className="pipe-rail" />
                    <span className="pipe-fill" />
                    {stages.map((stage, i) => (
                      <span
                        key={stage.id}
                        className="pipe-node"
                        data-on={i <= stop ? "" : undefined}
                        style={{ "--i": i } as CSSProperties}
                      />
                    ))}
                    <span className="pipe-mover">
                      <span className="pipe-packet" />
                    </span>
                    <span
                      className={`pipe-tag rounded-full px-2.5 py-1 font-mono text-2xs font-medium tracking-wide ${
                        held ? "bg-accent text-white" : "bg-ok-soft text-ok"
                      }`}
                    >
                      {held ? HELD_LABEL : "ALLOWED"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RunOnView>

      <dl className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
        {pipelineCalls.map((call) => (
          <div key={call.id} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[3px] ${call.id === "held" ? "bg-accent" : "bg-ink"}`}
            />
            <div>
              <dt className="font-mono text-[0.8125rem] font-medium">{call.tool}</dt>
              <dd className="mt-1 max-w-[30rem] text-[0.9375rem] leading-6 text-muted">{call.outcome}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
