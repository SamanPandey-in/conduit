import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { askSample, grantsSample, type Grant } from "@/lib/surfaces";

const decisionStyle: Record<Grant["decision"], string> = {
  allow: "bg-ok-soft text-ok",
  hold: "bg-accent-soft text-accent",
  "not granted": "bg-danger-soft text-danger",
};
const decisionText: Record<Grant["decision"], string> = {
  allow: "allow",
  hold: "hold for approval",
  "not granted": "not granted",
};

export function Surfaces() {
  return (
    <section id="surfaces" aria-labelledby="surfaces-title" className="section-t mx-auto max-w-6xl px-4 md:px-8">
      <SectionHeader
        id="surfaces-title"
        micro="Sample workspace · acme"
        className="max-w-[46rem]"
        title="See what the agent read, and what it may call."
      />

      {/* Ask */}
      <div className="mt-16 grid items-center gap-x-8 gap-y-10 md:mt-24 lg:grid-cols-12">
        <SectionHeader
          as="h3"
          id="ask-title"
          micro="search_documents · get_passage"
          className="lg:col-span-5 lg:pr-6"
          title="Answers that show their sources."
          lede="Every sentence in an answer carries a numbered citation to the document, location and chunk it came from. Agents fetch the same passages over MCP."
        />
        {/* Dot grid with a warm glow: every sentence points back to a source. */}
        <Panel variant="dots" className="reveal lg:col-span-7">
          <div className="p-4 sm:p-10">
            <div className="ui-card text-[13px] leading-5">
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <span className="font-medium">Ask</span>
                <span className="font-mono text-xs text-muted">acme</span>
                <span className="ml-auto rounded-full border px-2 py-0.5 text-2xs text-muted">Sample data</span>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <p className="text-muted">{askSample.question}</p>
                <p className="mt-3 text-[0.9375rem] leading-7">
                  {askSample.answer.map((part) => (
                    <span key={part.cite}>
                      {part.text}.
                      <Cite n={part.cite} />{" "}
                    </span>
                  ))}
                </p>
              </div>
              <ol className="border-t">
                {askSample.sources.map((source) => (
                  <li key={source.n} className="flex items-center gap-3 border-b px-4 py-2 last:border-b-0 sm:px-5">
                    <Cite n={source.n} inline />
                    <span className="min-w-0 truncate font-mono text-xs">{source.doc}</span>
                    <span className="shrink-0 text-xs text-muted">{source.loc}</span>
                    <span className="ml-auto shrink-0 font-mono text-xs text-muted">{source.chunk}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Panel>
      </div>

      {/* Tool grants */}
      <div className="mt-20 md:mt-32">
        <div className="grid items-end gap-x-8 gap-y-6 lg:grid-cols-12">
          <SectionHeader
            as="h3"
            id="grants-title"
            micro="tools/list"
            className="lg:col-span-6"
            title="Tools are granted, not discovered."
          />
          <p className="reveal text-[1.0625rem] leading-7 text-muted lg:col-span-6 lg:pb-1 lg:pl-8">
            An agent only lists the tools it has been granted. Each grant carries a scope and a risk level, and a
            high-risk tool is held at the gate even when it is granted.
          </p>
        </div>
        {/* Phones: one card per grant. */}
        <ul className="reveal mt-10 overflow-hidden rounded-lg border bg-surface shadow-card md:hidden">
          {grantsSample.map((grant) => (
            <li
              key={`${grant.principal}-${grant.tool}`}
              className="grid gap-y-1.5 border-b px-4 py-3.5 text-[0.8125rem] leading-5 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-medium">{grant.tool}</span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-2xs font-medium tracking-wide whitespace-nowrap ${decisionStyle[grant.decision]}`}
                >
                  {decisionText[grant.decision]}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-3 text-xs text-muted">
                <span className="font-mono">{grant.principal}</span>
                <span>{grant.scope}</span>
                {grant.risk ? (
                  <span className={grant.risk === "high" ? "font-medium text-accent" : ""}>risk {grant.risk}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div
          role="region"
          aria-labelledby="grants-title"
          tabIndex={0}
          className="reveal mt-10 overflow-x-auto rounded-lg border bg-surface shadow-card max-md:hidden"
        >
          <table className="w-full border-collapse text-left text-[0.8125rem] leading-5">
            <caption className="sr-only">Tool grants in the sample workspace</caption>
            <thead>
              <tr className="border-b text-xs text-muted">
                {["Agent", "Tool", "Scope", "Risk", "At the gate"].map((heading) => (
                  <th key={heading} scope="col" className="px-5 py-3 font-normal">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grantsSample.map((grant) => (
                <tr key={`${grant.principal}-${grant.tool}`} className="border-b last:border-b-0">
                  <td className="px-5 py-3.5 font-mono text-xs">{grant.principal}</td>
                  <td className="px-5 py-3.5 font-mono text-xs font-medium">{grant.tool}</td>
                  <td className="px-5 py-3.5 text-muted">{grant.scope}</td>
                  <td className="px-5 py-3.5">
                    {grant.risk ? (
                      <span className={grant.risk === "high" ? "font-medium text-accent" : ""}>{grant.risk}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-2xs font-medium tracking-wide whitespace-nowrap ${decisionStyle[grant.decision]}`}
                    >
                      {decisionText[grant.decision]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Cite({ n, inline = false }: { n: number; inline?: boolean }) {
  return (
    <span
      className={`inline-grid h-[18px] min-w-[18px] place-items-center rounded-[5px] bg-accent-soft px-1 font-mono text-2xs font-medium text-accent outline-1 outline-accent-line ${
        inline ? "shrink-0" : "mx-1 -translate-y-px align-middle"
      }`}
    >
      <span className="sr-only">source </span>
      {n}
    </span>
  );
}
