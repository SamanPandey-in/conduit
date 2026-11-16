import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Logo } from "@/components/ui/Logo";
import { getCurrentUser } from "@/lib/session";

import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false },
};

/**
 * Protected shell. The frame is static; anything that reads the session streams
 * in behind Suspense. Each page also checks the session itself (lib/session.ts).
 */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/app" className="inline-flex min-h-11 items-center rounded-sm" aria-label="App home">
            <Logo />
          </Link>
          <Suspense fallback={<div className="h-5 w-32" aria-hidden="true" />}>
            <AccountMenu />
          </Suspense>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}

async function AccountMenu() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="hidden truncate text-muted sm:inline">
        {user.isDemo ? "Demo session" : (user.email ?? user.name)}
      </span>
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-sm px-2 text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
