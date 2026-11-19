import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { describeVerificationError } from "@/lib/auth-errors";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false },
};

/**
 * Landing page for the email-confirmation link. Better Auth verifies the token,
 * signs the user in (autoSignInAfterVerification) and redirects here; on a bad
 * or expired token it appends `?error=`.
 */
export default function VerifiedPage({ searchParams }: PageProps<"/auth/verified">) {
  return (
    <AuthShell>
      <Suspense fallback={<p className="text-sm text-muted">Confirming…</p>}>
        <Verified searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Verified({ searchParams }: Pick<PageProps<"/auth/verified">, "searchParams">) {
  const { error } = await searchParams;

  if (typeof error === "string") {
    const copy = describeVerificationError(error);
    return (
      <>
        <h1 className="text-xl font-semibold tracking-tight text-fg">{copy.title}</h1>
        <p className="mt-2 text-sm text-muted">{copy.body}</p>
        <SignInLink label="Go to sign in" />
      </>
    );
  }

  const user = await getCurrentUser();
  if (user) {
    redirect(user.workspaceId ? "/app" : "/onboarding");
  }

  // Confirmed, but no session here (e.g. the link was opened in another browser).
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight text-fg">Email confirmed</h1>
      <p className="mt-2 text-sm text-muted">Your account is ready. Sign in with your email and password to continue.</p>
      <SignInLink label="Sign in" />
    </>
  );
}

function SignInLink({ label }: { label: string }) {
  return (
    <Link
      href="/login"
      className="mt-8 inline-flex h-11 items-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg"
    >
      {label}
    </Link>
  );
}
