import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { askSample, retrievalSample } from "@/lib/surfaces";

const channelNote = ["pgvector", "FTS", "RRF", "rerank"];

/**
 * The retrieval debugger: one query ranked four ways. Taken off the landing
 * page to keep the Surfaces section to two ideas (cited answers, tool grants);
 * kept here so it can go back, or into the demo or docs, unchanged.
 */
export function RetrievalDebugger() {
  const relevantSource = askSample.sources[0];
  return (
  <div className="mt-20 grid items-center gap-x-8 gap-y-10 md:mt-32 lg:grid-cols-12">
      <SectionHeader
        as="h3"
        id="retrieval-title"
        micro="vector · keyword · fused · reranked"
        className="lg:order-2 lg:col-span-5 lg:pl-10"
        title="Watch one query get ranked four ways."
        lede="The retrieval debugger puts vector, keyword, fused and reranked results side by side, so you can see which channel found the right chunk and which one buried it."
      />
      {/* Parallel channels: one query, ranked four ways. */}
      <Panel variant="channels" className="reveal lg:order-1 lg:col-span-7">
        <div className="p-4 sm:p-10">
          <div className="ui-card text-[13px] leading-5">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <span className="shrink-0 font-medium">Retrieval</span>
              <span className="min-w-0 truncate rounded-sm bg-sunken px-2 py-0.5 font-mono text-xs">
                {retrievalSample.query}
              </span>
              <span className="ml-auto hidden shrink-0 rounded-full border px-2 py-0.5 text-2xs text-muted sm:inline">
                Sample data
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {retrievalSample.columns.map((column, c) => (
                <div
                  key={column.label}
                  className="border-b px-3 py-3 odd:border-r sm:border-r sm:border-b-0 sm:px-3.5 sm:last:border-r-0 max-sm:nth-[n+3]:border-b-0"
                >
                  <p className="flex items-baseline justify-between gap-2 pb-2">
                    <span className="font-medium">{column.label}</span>
                    <span className="font-mono text-2xs whitespace-nowrap text-muted">{channelNote[c]}</span>
                  </p>
                  <ol className="space-y-1">
                    {column.ranks.map((chunk, r) => {
                      const hit = chunk === retrievalSample.relevant;
                      return (
                        <li
                          key={chunk}
                          className={`flex h-7 items-center gap-2 rounded-sm px-2 font-mono text-xs ${
                            hit ? "bg-accent-soft text-accent outline-1 outline-accent-line" : ""
                          }`}
                        >
                          <span className={hit ? "" : "text-muted"}>{r + 1}</span>
                          <span className={hit ? "font-medium" : ""}>{chunk}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
            <p className="rounded-b-lg border-t bg-sunken/70 px-4 py-2.5 text-xs text-muted">
              <span className="font-mono text-accent">{retrievalSample.relevant}</span> is the relevant chunk (
              {relevantSource.doc}, {relevantSource.loc}).{" "}
              <span className="whitespace-nowrap">
                Rank per channel: <span className="font-mono text-ink">
                {retrievalSample.columns
                  .map((column) => column.ranks.indexOf(retrievalSample.relevant) + 1)
                  .join(" → ")}
                </span>
              </span>
            </p>
          </div>
        </div>
      </Panel>
    </div>

  );
}
