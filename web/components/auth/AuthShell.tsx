import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";

/** Narrow single-column frame shared by /login, /auth/error and /onboarding. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm"
          aria-label="Home"
        >
          <Logo />
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pt-12 pb-16 sm:pt-24">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
