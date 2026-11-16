import { callStream, heldCall, type CallDecision } from "@/lib/call-stream";
import { HELD_LABEL, stageIndex, stages } from "@/lib/pipeline";
import { injectedCall, sampleAuditRow } from "@/lib/sample-audit";
import { StageDots } from "./StageDots";

const decisionLabel: Record<CallDecision, string> = {
  allowed: "ALLOWED",
  held: "HELD",
  denied: "DENIED",
};
const decisionColor: Record<CallDecision, string> = {
  allowed: "text-ok",
  held: "text-accent",
  denied: "text-danger",
};

const gate = stages[stageIndex(heldCall.stopsAt)];

/**
 * The Conduit admin app, drawn in code: the approvals view for the sample
 * workspace. Purely illustrative, so it is hidden from assistive tech and
 * described by the figcaption instead.
 */
export function AppWindow() {
  return (
    <figure>
      <figcaption className="sr-only">
        Conduit admin, approvals view for the sample workspace acme. A search_documents call from agent:it-triage
        passed all 8 pipeline stages and was allowed. A reset_password call from the same agent stopped at the risk
        gate and is held for approval, showing its exact arguments: user cfo@acme.test, notify false.
      </figcaption>
      <div
        aria-hidden="true"
        className="ui-card overflow-hidden text-left text-[13px] leading-5"
      >
        {/* Main pane: approvals only. The sidebar and the rest of the shell live in the demo. */}
        <div className="min-w-0">
          <div className="flex h-12 items-center gap-3 border-b px-4">
            <span className="font-medium">Approvals</span>
            <span className="hidden font-mono text-xs text-muted sm:inline">acme / approvals</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs text-muted">
              Sample workspace
            </span>
            <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Live
            </span>
          </div>

          <div className="p-3 sm:p-4">
            <div className="flex items-center gap-2 pb-2.5">
              <span className="text-xs font-medium">Needs approval</span>
              <span className="rounded-full bg-accent-soft px-1.5 font-mono text-2xs font-medium text-accent">1</span>
            </div>

            {/* The held call */}
            <div className="overflow-hidden rounded-md border border-accent-line">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-accent-soft px-3.5 py-2.5">
                <span className="h-2 w-2 rotate-45 rounded-[2px] bg-accent" />
                <span className="font-mono text-[13px] font-medium">{heldCall.tool}</span>
                <span className="hidden font-mono text-xs text-muted sm:inline">{heldCall.principal}</span>
                <span className="ml-auto hidden sm:inline-flex">
                  <StageDots stopsAt={heldCall.stopsAt} decision="held" />
                </span>
                <span className="ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-2xs font-medium tracking-wide text-white sm:ml-0">
                  {HELD_LABEL}
                </span>
              </div>
              <div className="grid gap-x-6 gap-y-3 border-t border-accent-line bg-surface px-3.5 py-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <p className="text-2xs text-muted">Arguments, exactly as sent</p>
                  <pre className="mt-1.5 overflow-hidden rounded-sm bg-sunken px-3 py-2 font-mono text-xs leading-5">
                    {injectedCall.args}
                  </pre>
                </div>
                <dl className="grid grid-cols-[auto_1fr] content-start gap-x-4 gap-y-1 text-xs">
                  <dt className="text-muted">Risk</dt>
                  <dd className="font-medium text-accent">high</dd>
                  <dt className="text-muted">Stopped at</dt>
                  <dd>
                    {gate.name} <span className="text-muted">· 6 of 8</span>
                  </dd>
                  <dt className="text-muted">Audit</dt>
                  <dd className="font-mono">{sampleAuditRow.auditId}</dd>
                  <dt className="text-muted">Trace</dt>
                  <dd className="font-mono">{sampleAuditRow.traceId}</dd>
                </dl>
              </div>
              <div className="flex items-center gap-2 border-t border-accent-line bg-surface px-3.5 py-2.5">
                <span className="mr-auto hidden text-xs text-muted sm:inline">Nothing runs until an admin decides.</span>
                <span className="mr-auto text-xs text-muted sm:hidden">{heldCall.principal}</span>
                <span className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium">Deny</span>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Approve</span>
              </div>
            </div>

            {/* Call stream. Hidden on phones: truncated tool names carry nothing there. */}
            <div className="flex items-center gap-2 pt-4 pb-1.5 max-sm:hidden">
              <span className="text-xs font-medium">Call stream</span>
              <span className="font-mono text-2xs text-muted">agent:* · last 5 min</span>
            </div>
            <div className={`${rowGrid} border-b pb-1.5 text-2xs text-muted max-sm:hidden`}>
              <span>Time</span>
              <span>Tool</span>
              <span className="hidden lg:block">Agent</span>
              <span>Pipeline</span>
              <span>Decision</span>
              <span className="hidden text-right sm:block">Latency</span>
            </div>
            <ul className="max-sm:hidden">
              {callStream.map((call) => (
                <li key={call.id} className={`${rowGrid} h-[34px] border-b last:border-b-0`}>
                  <span className="font-mono text-xs text-muted">{call.time.slice(0, 5)}<span className="hidden sm:inline">{call.time.slice(5)}</span></span>
                  <span className="truncate font-mono text-xs">{call.tool}</span>
                  <span className="hidden truncate font-mono text-xs text-muted lg:block">{call.principal}</span>
                  <StageDots stopsAt={call.stopsAt} decision={call.decision} />
                  <span className={`font-mono text-2xs font-medium tracking-wide ${decisionColor[call.decision]}`}>
                    {decisionLabel[call.decision]}
                  </span>
                  <span className="hidden text-right font-mono text-xs text-muted sm:block">{call.latency ?? "—"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </figure>
  );
}

const rowGrid =
  "grid items-center gap-x-3 grid-cols-[60px_minmax(0,1fr)_auto_62px_52px] lg:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_auto_62px_52px]";
