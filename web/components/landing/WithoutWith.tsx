import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HELD_LABEL, stageIndex, stages } from "@/lib/pipeline";
import { injectedCall, plantedDocument, sampleAuditRow } from "@/lib/sample-audit";

const gate = stageIndex("risk-gate");

/** The same call with no gateway in the way, as the agent's own log would show it. Illustrative. */
const withoutLog = [
  { time: "14:07:29", event: "retrieve", detail: `${plantedDocument.path.split("/").pop()} · page ${plantedDocument.page}` },
  { time: "14:07:30", event: `call ${injectedCall.tool}`, detail: injectedCall.argsInline },
  { time: "14:07:31", event: "200 OK", detail: "ticket service accepted the agent's credential", danger: true },
  { time: "", event: "audit", detail: "nothing recorded" },
];

function DocGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
      <path d="M4 1.5h5.5L13 5v9.5H4z" className="fill-sunken stroke-line-strong" strokeWidth="1" />
      <path d="M9.5 1.5V5H13" className="fill-none stroke-line-strong" strokeWidth="1" />
      <rect x="2" y="8.5" width="8" height="4.5" rx="1" className="fill-ink" />
      <text x="6" y="12" textAnchor="middle" className="fill-white" fontSize="3.4" fontWeight="700" fontFamily="sans-serif">
        PDF
      </text>
    </svg>
  );
}

export function WithoutWith() {
  return (
    <section id="injection" aria-labelledby="injection-title" className="section-t mx-auto max-w-6xl px-4 md:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
        <SectionHeader
          id="injection-title"
          micro="PENDING_APPROVAL"
          className="lg:col-span-6"
          title="A PDF asks for the CFO's password reset. Conduit asks a human."
          lede="Retrieved text is untrusted input. When a planted instruction turns into a tool call, the call still meets the risk gate, and an admin reads the exact arguments before anything runs."
        />

        {/* The planted document, in a viewer: toolbar, then the page itself. */}
        <figure className="reveal lg:col-span-6 lg:pl-8">
          <div className="ui-card overflow-hidden">
            <div className="flex h-10 items-center gap-2.5 border-b px-3.5 text-xs">
              <DocGlyph />
              <span className="font-medium">{plantedDocument.path.split("/").pop()}</span>
              <span className="truncate font-mono text-2xs text-muted max-sm:hidden">
                {plantedDocument.path.split("/").slice(0, -1).join("/")}
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-3 font-mono text-2xs text-muted">
                <span className="rounded-sm border px-1.5 py-0.5">
                  {plantedDocument.page} / 12
                </span>
                <span className="max-sm:hidden">100%</span>
              </span>
            </div>
            <div className="bg-sunken px-3 py-4 sm:px-8 sm:py-6">
              <div className="relative mx-auto max-w-[30rem] rounded-[3px] bg-surface px-5 pt-6 pb-4 shadow-card sm:px-8 sm:pt-8">
                <div className="space-y-3 font-display text-[1rem] leading-7 text-ink/75">
                  {plantedDocument.before.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p className="relative">
                    <mark className="bg-accent-soft box-decoration-clone px-1 text-ink shadow-[inset_0_-2px_0_var(--color-accent-line)]">
                      {plantedDocument.injected}
                    </mark>
                    <span className="mt-1.5 flex items-center gap-1.5 font-mono text-2xs text-accent">
                      <span aria-hidden="true" className="h-px w-3 bg-accent" />
                      planted instruction · untrusted input
                    </span>
                  </p>
                  {plantedDocument.after.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-6 text-center font-mono text-2xs text-muted">{plantedDocument.page}</p>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 text-xs text-muted">
            Sample document from the demo corpus. The agent retrieves this page while answering a billing question.
          </figcaption>
        </figure>
      </div>

      <div className="mt-14 grid gap-x-6 gap-y-12 md:mt-20 lg:grid-cols-12">
        {/* Without */}
        <article className="reveal flex flex-col lg:col-span-5">
          <h3 className="text-lg font-medium tracking-tight">Without a gateway</h3>
          <p className="mt-2 text-[0.9375rem] leading-6 text-muted">
            The agent holds the credential, so the instruction in the document is as good as an instruction from you.
          </p>
          <div className="ui-card mt-6 flex flex-1 flex-col overflow-hidden">
            <div className="flex h-10 items-center gap-2.5 border-b px-3.5 font-mono text-2xs">
              <span className="text-ink">agent log</span>
              <span className="text-muted">{injectedCall.principal}</span>
              <span className="ml-auto text-muted">no gateway</span>
            </div>
            <ol className="divide-y font-mono text-2xs leading-5">
              {withoutLog.map((row) => (
                <li
                  key={row.time + row.event}
                  className={`grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-3 px-3.5 py-2.5 ${row.danger ? "bg-danger-soft/60" : ""}`}
                >
                  <span className="text-muted">{row.time}</span>
                  <span className="min-w-0">
                    <span className={row.danger ? "font-medium text-danger" : "text-ink"}>{row.event}</span>
                    <span className="block break-words text-muted">{row.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-auto border-t bg-sunken/70 px-3.5 py-3.5">
              <p className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-2.5 py-1 font-mono text-2xs font-medium tracking-wide text-danger">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-danger" />
                EXECUTED
              </p>
              <p className="mt-2.5 text-[0.9375rem] leading-6">
                The password is reset. Nobody approved it, and nothing recorded what was asked.
              </p>
              <p className="mt-2 text-xs text-muted">Illustrative sequence, not captured output.</p>
            </div>
          </div>
        </article>

        {/* With */}
        <article className="reveal flex flex-col lg:col-span-7">
          <h3 className="text-lg font-medium tracking-tight">With Conduit</h3>
          <p className="mt-2 text-[0.9375rem] leading-6 text-muted">
            The same call arrives at stage {gate + 1} of 8. It is high risk, so it waits.
          </p>
          {/* A ruled grid with a cobalt glow: the boundary the call cannot cross on its own. */}
          <Panel variant="grid" className="mt-6 flex-1">
            <div className="flex h-full items-center justify-center p-4 sm:p-10">
              <div className="ui-card w-full max-w-[29rem] text-[13px] leading-5">
                <div className="flex items-center gap-2.5 border-b px-4 py-3">
                  <span aria-hidden="true" className="h-2 w-2 rotate-45 rounded-[2px] bg-accent" />
                  <span className="font-mono text-2xs font-medium tracking-wide text-accent">{HELD_LABEL}</span>
                  <span className="ml-auto font-mono text-2xs text-muted">{sampleAuditRow.ts}</span>
                </div>
                <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-y-2.5 px-4 py-4">
                  <dt className="text-muted">Tool</dt>
                  <dd className="font-mono font-medium">{injectedCall.tool}</dd>
                  <dt className="text-muted">Agent</dt>
                  <dd className="font-mono">{injectedCall.principal}</dd>
                  <dt className="text-muted">Stopped at</dt>
                  <dd className="text-accent">
                    {stages[gate].name} <span className="text-muted">· stage {gate + 1} of 8</span>
                  </dd>
                  <dt className="text-muted">Arguments</dt>
                  <dd>
                    <pre className="overflow-x-auto rounded-sm bg-sunken px-3 py-2 font-mono text-xs leading-5">
                      {injectedCall.args}
                    </pre>
                  </dd>
                  <dt className="text-muted">Execute</dt>
                  <dd className="text-muted">not reached</dd>
                </dl>
                <div aria-hidden="true" className="flex items-center justify-end gap-2 border-t px-4 py-3">
                  <span className="mr-auto text-xs text-muted">Waiting for an admin</span>
                  <span className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium">Deny</span>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Approve</span>
                </div>
                <div className="rounded-b-lg border-t bg-sunken/70 px-4 py-3">
                  <p className="text-2xs text-muted">Audit row, written before any decision</p>
                  <p className="mt-1 font-mono text-2xs leading-5 break-words">
                    {sampleAuditRow.auditId} · {sampleAuditRow.decision} · args_sha256 {sampleAuditRow.argsSha256} ·{" "}
                    {sampleAuditRow.traceId}
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </article>
      </div>
    </section>
  );
}
