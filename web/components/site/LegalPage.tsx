import Link from "next/link";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

/** Formats an ISO date (YYYY-MM-DD) as "November 23, 2026" without timezone drift. */
export function formatLegalDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

/**
 * Shell for Privacy and Terms (owner's template): back link, title,
 * "Last updated" directly under it, plain unnumbered sections.
 */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" aria-label={`${site.name} home`} className="inline-flex min-h-11 items-center rounded-sm">
          <Logo />
        </Link>
        <Link href="/" className="inline-flex min-h-11 items-center text-sm text-muted hover:text-fg">
          Back to home
        </Link>
      </header>
      <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 pt-12 pb-24 md:pt-16">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
        <p className="mt-3 text-sm text-muted">
          Last updated: <time dateTime={site.legal.updated}>{formatLegalDate(site.legal.updated)}</time>
        </p>
        <div className="mt-10 text-base text-fg [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-fg [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-muted [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted [&_strong]:font-medium [&_strong]:text-fg">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
