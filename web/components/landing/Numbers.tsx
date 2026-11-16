import { SectionHeader } from "@/components/ui/SectionHeader";
import { metrics } from "@/lib/metrics";

/**
 * Evaluation results. Currently NOT rendered (commented out in app/page.tsx):
 * re-enable once lib/metrics.ts holds measured values.
 */
export function Numbers() {
  return (
    <section id="numbers" aria-labelledby="numbers-title" className="mx-auto max-w-6xl px-4 pt-24 md:px-8 md:pt-40">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
        <SectionHeader
          id="numbers-title"
          micro="recall@5 · MRR · leakage · attack success"
          title="Measured, not estimated."
        />
        <p className="reveal text-[1.0625rem] leading-7 text-muted">
          Retrieval quality against a vector baseline, isolation between tenants, and resistance to planted
          instructions, from the eval scripts in the repository.
        </p>
      </div>

      <dl className="reveal mt-14 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="border-line py-7 max-lg:border-b max-lg:last:border-b-0 sm:px-6 sm:first:pl-0 lg:border-l lg:first:border-l-0"
          >
            <dt>
              <span className="display block text-[1.625rem]">{metric.title}</span>
              <span className="mt-2 block text-sm text-muted">{metric.method}</span>
            </dt>
            {metric.rows.map((row) => (
              <dd key={row.label} className="mt-4 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted">{row.label}</span>
                <span className="font-mono text-fg">{row.value ?? "n/a"}</span>
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </section>
  );
}
