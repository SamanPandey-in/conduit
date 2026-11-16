"use client";

import { useEffect, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

const labels: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Copy failed",
};

const announcements: Record<CopyState, string> = {
  idle: "",
  copied: "MCP config copied to clipboard.",
  failed: "Could not copy. Select the config text and copy it manually.",
};

/** Copy button for the dark Connect band. */
export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    // "failed" stays until the next click so the reader can see it.
    if (state !== "copied") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      // navigator.clipboard is undefined on insecure origins; that throws here too.
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={state === "idle" ? "Copy MCP config" : undefined}
        data-state={state}
        className="inline-flex h-8 min-w-[4.5rem] items-center justify-center rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-white/20 focus-visible:outline-white data-[state=copied]:border-honey/60 data-[state=copied]:text-honey"
      >
        {labels[state]}
      </button>
      <span role="status" className="sr-only">
        {announcements[state]}
      </span>
    </>
  );
}
