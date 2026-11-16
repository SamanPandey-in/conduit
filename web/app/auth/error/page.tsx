import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { describeAuthError } from "@/lib/auth-errors";

export const metadata: Metadata = {
  title: "Sign-in problem",
  robots: { index: false },
};

export default function AuthErrorPage({ searchParams }: PageProps<"/auth/error">) {
  return (
    <AuthShell>
      <Suspense fallback={<h1 className="text-xl font-semibold text-fg">Sign-in didn&apos;t work</h1>}>
        <ErrorMessage searchParams={searchParams} />
      </Suspense>
      <Link
        href="/login"
        className="mt-8 inline-flex h-11 items-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg"
      >
        Try signing in again
      </Link>
    </AuthShell>
  );
}

async function ErrorMessage({ searchParams }: Pick<PageProps<"/auth/error">, "searchParams">) {
  const { error } = await searchParams;
  const copy = describeAuthError(error);
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight text-fg">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.body}</p>
      {typeof error === "string" ? (
        <p className="mt-4 text-xs text-muted">
          Error code: <code className="font-mono">{error.slice(0, 64)}</code>
        </p>
      ) : null}
    </>
  );
}
