import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto w-full max-w-6xl px-4 py-4 md:px-8">
        <Link href="/" aria-label={`${site.name} home`} className="inline-flex min-h-11 items-center rounded-sm">
          <Logo />
        </Link>
      </header>
      <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-24">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-fg">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-sm text-muted">The link may be old, or the address has a typo.</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg"
          >
            Back to {site.name}
          </Link>
          <Link href="/app" className="inline-flex min-h-11 items-center text-sm text-muted hover:text-fg">
            Open the app
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
