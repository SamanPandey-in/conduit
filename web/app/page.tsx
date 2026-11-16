import { BuiltOn } from "@/components/landing/BuiltOn";
import { Connect } from "@/components/landing/Connect";
import { Hero } from "@/components/landing/Hero";
import { Nav } from "@/components/landing/Nav";
// Hidden until the eval scripts have produced real values in lib/metrics.ts.
// import { Numbers } from "@/components/landing/Numbers";
import { Pipeline } from "@/components/landing/Pipeline";
import { Surfaces } from "@/components/landing/Surfaces";
import { WithoutWith } from "@/components/landing/WithoutWith";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <BuiltOn />
        <Pipeline />
        <WithoutWith />
        <Surfaces />
        {/* <Numbers /> */}
        <Connect />
      </main>
      <SiteFooter note="A governed MCP gateway. In active development." />
    </>
  );
}
