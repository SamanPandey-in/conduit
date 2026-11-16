"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Sets `data-run` once the wrapped content is in view. The animation itself
 * lives in CSS (`.pipe-run` in globals.css) and is skipped entirely under
 * prefers-reduced-motion, where the final state is shown from the start.
 */
export function RunOnView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="pipe-run" data-run={run ? "" : undefined}>
      {children}
    </div>
  );
}
