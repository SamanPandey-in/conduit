"use client";

import { useEffect, useRef } from "react";

/**
 * Ordered-dither dot field drawn in code. The "funnel": many loose streams on
 * the left converge through one narrow gate and leave as a single governed
 * line on the right. That is Conduit: many agents, one gateway, one audited
 * path. Static and decorative: drawn once per size change.
 */
const CELL = 4;
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function funnel(u: number, v: number, gateU: number): number {
  const y = v - 0.5;
  if (u < gateU) {
    // Streams spread wide on the left and narrow toward the gate.
    const t = u / gateU; // 0 at left edge, 1 at the gate
    const spread = 0.36 * (1 - t) + 0.012;
    const streams = 7;
    let best = 0;
    for (let s = 0; s < streams; s++) {
      const lane = ((s + 0.5) / streams - 0.5) * 2 * spread;
      best = Math.max(best, Math.exp(-Math.abs(y - lane) * 70));
    }
    const fade = 0.35 + t * 0.65;
    return clamp(best * fade);
  }
  // One bright line after the gate, plus the gate itself.
  const line = Math.exp(-Math.abs(y) * 70) * (1 - (u - gateU) * 0.35);
  const halo = Math.exp(-Math.abs(y) * 24) * 0.2 * (1 - (u - gateU));
  return clamp(line + halo);
}

function gate(u: number, v: number, gateU: number, aspect: number): number {
  const x = (u - gateU) * aspect;
  const posts = Math.abs(Math.abs(v - 0.5) - 0.18) < 0.13 ? Math.exp(-Math.abs(x) * 90) * 0.85 : 0;
  return posts;
}

export function Dither({ className = "", gateAt = 0.58 }: { className?: string; gateAt?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const styles = getComputedStyle(canvas);
      const light = styles.getPropertyValue("--dither-light").trim() || "#ffffff";
      const tint = styles.getPropertyValue("--dither-tint").trim() || "#e8a23a";
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      const aspect = width / height;
      const dot = 2.4;
      const floor = 0.1; // below this the field is dust, not light: draw nothing

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const u = (x + 0.5) / cols;
          const v = (y + 0.5) / rows;
          const flow = funnel(u, v, gateAt);
          const g = gate(u, v, gateAt, aspect);
          const i = Math.max(flow, g);
          if (i < floor || i <= BAYER[y % 8][x % 8]) continue;
          // After the gate the line takes the accent: the governed path.
          ctx.fillStyle = (u > gateAt && flow > 0.55) || g > 0.5 ? tint : light;
          ctx.globalAlpha = 0.35 + i * 0.65;
          ctx.fillRect(x * CELL + (CELL - dot) / 2, y * CELL + (CELL - dot) / 2, dot, dot);
        }
      }
      ctx.globalAlpha = 1;
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [gateAt]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block ${className}`} />;
}
