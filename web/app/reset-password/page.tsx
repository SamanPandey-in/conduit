import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false },
};

/**
 * The emailed link goes through /api/auth/reset-password/:token, which checks the
 * token and redirects here with `?token=` (valid) or `?error=INVALID_TOKEN`.
 */
export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <AuthShell>
      <Suspense fallback={<h1 className="text-xl font-semibold text-fg">Choose a new password</h1>}>
        <Reset searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Reset({ searchParams }: Pick<PageProps<"/reset-password">, "searchParams">) {
  const { token, error } = await searchParams;

  if (error || typeof token !== "string" || token.length === 0) {
    return (
      <>
        <h1 className="text-xl font-semibold tracking-tight text-fg">That reset link didn&apos;t work</h1>
        <p className="mt-2 text-sm text-muted">
          Reset links work once and expire after 30 minutes. Request a new one and use the latest email.
        </p>
        <Link
          href="/forgot-password"
          className="mt-8 inline-flex h-11 items-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg"
        >
          Request a new link
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight text-fg">Choose a new password</h1>
      <p className="mt-2 text-sm text-muted">This replaces your old password and signs you out on every device.</p>
      <div className="mt-8">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
}
