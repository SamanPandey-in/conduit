import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { enabledProviders } from "@/lib/auth";
import { signInMethodsLine } from "@/lib/auth-policy";
import { product } from "@/lib/product";
import { safeRedirect } from "@/lib/safe-redirect";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false },
};

export default function SignUpPage({ searchParams }: PageProps<"/signup">) {
  return (
    <AuthShell>
      <h1 className="text-xl font-semibold tracking-tight text-fg">Create your {product.name} account</h1>
      <p className="mt-2 text-sm text-muted">{signInMethodsLine(enabledProviders)}</p>
      <div className="mt-8">
        <Suspense fallback={<div aria-hidden="true" className="h-96" />}>
          <SignUp searchParams={searchParams} />
        </Suspense>
      </div>
      <p className="mt-8 text-xs text-muted">
        By creating an account, you agree to the{" "}
        <Link href="/terms" className="text-fg underline underline-offset-4">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-fg underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}

async function SignUp({ searchParams }: Pick<PageProps<"/signup">, "searchParams">) {
  const { next } = await searchParams;
  const destination = safeRedirect(next);

  const user = await getCurrentUser();
  if (user) {
    redirect(user.workspaceId ? destination : "/onboarding");
  }

  return <SignUpForm providers={enabledProviders} next={destination} />;
}
