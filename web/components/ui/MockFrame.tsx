import type { ReactNode } from "react";

type MockFrameProps = {
  title: string;
  note?: string;
  className?: string;
  children: ReactNode;
};

/** A bordered window for a product UI mockup. Inner structure uses rules, never nested boxes. */
export function MockFrame({ title, note, className = "", children }: MockFrameProps) {
  return (
    <figure className={`flex min-w-0 flex-col overflow-hidden rounded-md border bg-surface ${className}`}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-3">
        <span className="text-sm font-medium">{title}</span>
        {note ? <span className="text-xs text-muted">{note}</span> : null}
      </figcaption>
      {children}
    </figure>
  );
}
