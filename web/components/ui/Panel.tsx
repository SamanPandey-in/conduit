import type { ReactNode } from "react";

/**
 * Backdrops for the panels product cards float on. All drawn in CSS, no photos:
 *   aurora:   soft amber/rose/cobalt light over a fine dot grid (the hero)
 *   grid:     a line grid with a cobalt glow: structure, a boundary (the risk gate)
 *   dots:     a dot grid with a warm glow (cited answers)
 *   channels: parallel vertical channels: one query, ranked four ways (retrieval)
 */
export type PanelVariant = "aurora" | "grid" | "dots" | "channels";

type PanelProps = {
  variant: PanelVariant;
  className?: string;
  children: ReactNode;
};

export function Panel({ variant, className = "", children }: PanelProps) {
  return (
    <div className={`panel panel-${variant} relative isolate overflow-hidden rounded-2xl ${className}`}>{children}</div>
  );
}
