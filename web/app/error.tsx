"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Route-level error boundary: plain copy, one retry, a way home. */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-24">
      <h1 className="text-xl font-semibold tracking-tight text-fg">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">
        This page hit an error on our side. Trying again usually works.
      </p>
      {error.digest ? (
        <p className="mt-4 text-xs text-muted">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg"
        >
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center text-sm text-muted hover:text-fg">
          Go home
        </Link>
      </div>
    </main>
  );
}
