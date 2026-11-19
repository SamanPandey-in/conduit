import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { enabledProviders } from "@/lib/auth";
import { signInMethodsLine } from "@/lib/auth-policy";
import { product } from "@/lib/product";
import { safeRedirect } from "@/lib/safe-redirect";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthShell>
      <h1 className="text-xl font-semibold tracking-tight text-fg">Sign in to {product.name}</h1>
      <p className="mt-2 text-sm text-muted">{signInMethodsLine(enabledProviders)}</p>
      <div className="mt-8">
        {/* Reads the session and the URL, so it renders at request time. */}
        <Suspense fallback={<LoginSkeleton />}>
          <Login searchParams={searchParams} />
        </Suspense>
      </div>
      <p className="mt-8 text-xs text-muted">
        By continuing, you agree to the{" "}
        <Link href="/terms" className="text-fg underline underline-offset-4">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-fg underline underline-offset-4">
          Privacy Policy
        </Link>
        . From Google or GitHub we only read your name, email address and avatar. Demo workspaces reset every night.
      </p>
    </AuthShell>
  );
}

async function Login({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next, reset } = await searchParams;
  const destination = safeRedirect(next);

  // Already signed in: don't show the form again.
  const user = await getCurrentUser();
  if (user) {
    redirect(user.workspaceId ? destination : "/onboarding");
  }

  return (
    <LoginForm
      providers={enabledProviders}
      next={destination}
      notice={reset === "done" ? "Password updated. Sign in with your new password." : undefined}
    />
  );
}

function LoginSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <div className="h-11 rounded-sm border border-line bg-surface" />
      <div className="h-11 rounded-sm border border-line bg-surface" />
      <div className="mt-3 h-11 rounded-sm border border-line bg-surface" />
      <div className="h-11 rounded-sm border border-line bg-surface" />
      <div className="h-11 rounded-sm bg-line" />
    </div>
  );
}
