import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { site } from "@/lib/site";
import { AppWindow } from "./AppWindow";
import { ArrowRight, GitHubIcon } from "./icons";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-14 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
        <h1 id="hero-title" className="display text-[clamp(2.75rem,7vw,5.25rem)]">
          Give agents your data <br className="hidden md:block" />
          without giving them the keys.
        </h1>
        <p className="mx-auto mt-6 max-w-[39rem] text-[1.0625rem] leading-7 text-muted md:mt-7 md:text-lg md:leading-8">
          Conduit is a governed MCP gateway. Agents get cited retrieval and scoped tools. Every call runs the same
          eight-stage pipeline, and the risky ones wait for a human.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={site.links.demo}
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-white transition-colors duration-150 hover:bg-ink/85"
          >
            Run the demo
            <ArrowRight />
          </Link>
          <a
            href={site.links.github}
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-surface px-6 text-[0.9375rem] font-medium transition-colors duration-150 hover:border-ink"
          >
            <GitHubIcon />
            View on GitHub
          </a>
        </div>
      </div>

      {/* The product on soft light over a dot grid: drawn in CSS, no photography. */}
      <div className="mx-auto mt-14 max-w-6xl px-4 md:mt-20 md:px-8">
        <Panel variant="aurora">
          <div className="px-3 py-3 sm:p-8 lg:p-12">
            <AppWindow />
          </div>
        </Panel>
      </div>
    </section>
  );
}
