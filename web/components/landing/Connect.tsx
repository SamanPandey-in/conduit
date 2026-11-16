import Link from "next/link";
import { mcpConfig, site } from "@/lib/site";
import { CopyButton } from "./CopyButton";
import { Dither } from "./Dither";
import { ArrowRight } from "./icons";

export function Connect() {
  return (
    <section id="connect" aria-labelledby="connect-title" className="section-t mx-auto max-w-[84rem] px-3 pb-16 md:px-6 md:pb-24">
      <div className="relative isolate overflow-hidden rounded-2xl bg-night text-white">
        <div className="grid gap-x-10 gap-y-10 px-4 pt-12 pb-10 sm:px-10 md:pt-16 lg:grid-cols-12 lg:px-12 lg:pt-20 xl:px-[6.5rem]">
          <div className="reveal lg:col-span-6">
            <p className="micro text-white/70">MCP · Streamable HTTP</p>
            <h2 id="connect-title" className="display mt-4 text-[clamp(2.125rem,4.6vw,3.5rem)]">
              Point an MCP client at one URL.
            </h2>
            <p className="mt-5 max-w-[30rem] text-[1.0625rem] leading-7 text-white/75">
              Add the server, pass a token, and the agent sees only the tools it was granted. Everything it does from
              then on goes through the pipeline.
            </p>
            <p className="mt-5 flex items-center gap-2.5 text-[0.9375rem] font-medium">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-honey" />
              Works with Tracebase
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={site.links.demo}
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-[0.9375rem] font-medium text-ink transition-colors duration-150 hover:bg-white/90 focus-visible:outline-white"
              >
                Run the demo
                <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="reveal min-w-0 lg:col-span-6 lg:pl-6">
            <div className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.03] shadow-float">
              <div className="flex h-10 items-stretch border-b border-white/10 bg-white/[0.03] text-2xs">
                <span className="relative flex items-center gap-2 border-r border-white/10 bg-night px-3.5 font-mono text-white/90">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-honey" />
                  <span aria-hidden="true" className="font-semibold text-honey">{"{}"}</span>
                  mcp.json
                </span>
                <span className="flex items-center px-3.5 font-mono text-white/45 max-sm:hidden">.cursor / .claude / any MCP client</span>
                <span className="ml-auto flex items-center pr-2">
                  <CopyButton text={mcpConfig} />
                </span>
              </div>
              <pre
                tabIndex={0}
                aria-label="MCP client config"
                className="scrollbar-none overflow-x-auto py-4 font-mono text-[0.8125rem] leading-6 focus-visible:outline-white"
              >
                <code>
                  {mcpConfig.split("\n").map((line, i) => (
                    <span key={i} className="flex">
                      <span aria-hidden="true" className="w-11 shrink-0 pr-4 text-right text-white/30 select-none">
                        {i + 1}
                      </span>
                      <span className="pr-5 whitespace-pre text-white/90 max-sm:break-words max-sm:whitespace-pre-wrap">{line}</span>
                    </span>
                  ))}
                </code>
              </pre>
              <p className="border-t border-white/10 px-4 py-3 text-xs leading-5 text-white/65 sm:px-5">
                Replace <code className="font-mono text-white/90">&lt;token&gt;</code> with a token issued to your agent.
                It only sees the tools it was granted.
              </p>
            </div>
          </div>
        </div>

        {/* Many agents in, one gate, one governed line out. Drawn as a dither field. */}
        <div aria-hidden="true" className="relative h-28 border-t border-white/10 sm:h-36 [--dither-light:#ffffff] [--dither-tint:var(--color-honey)]">
          <Dither className="absolute inset-0 size-full" />
          <span className="absolute bottom-3 left-4 font-mono text-2xs text-white/45 sm:left-10 lg:left-12 xl:left-[6.5rem]">
            agents
          </span>
          <span className="absolute top-3 left-[58%] -translate-x-1/2 font-mono text-2xs text-honey">conduit</span>
          <span className="absolute right-4 bottom-3 font-mono text-2xs text-white/45 sm:right-10 lg:right-12 xl:right-[6.5rem]">
            granted tools only
          </span>
        </div>
      </div>
    </section>
  );
}
