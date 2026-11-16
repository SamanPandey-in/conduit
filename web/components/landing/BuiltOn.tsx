import { stack } from "@/lib/stack";

/** The stack, as plain wordmarks with the job each piece does. No logos, no customers. */
export function BuiltOn() {
  return (
    <section aria-labelledby="built-on-title" className="mx-auto max-w-6xl px-4 pt-14 md:px-8 md:pt-20">
      <div className="reveal grid gap-x-8 gap-y-6 border-y py-8 lg:grid-cols-[8rem_minmax(0,1fr)] lg:items-baseline">
        <h2 id="built-on-title" className="micro">
          Built on
        </h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {stack.map((item) => (
            <li key={item.name}>
              <p className="text-[0.9375rem] font-medium tracking-tight text-ink/85">{item.name}</p>
              <p className="mt-1 font-mono text-2xs text-muted">{item.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
