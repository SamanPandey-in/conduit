import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { NameWorkspaceForm } from "@/components/auth/NameWorkspaceForm";
import { product } from "@/lib/product";
import { requireUser } from "@/lib/session";

import { skipOnboarding } from "./actions";

export const metadata: Metadata = {
  title: "Set up",
  robots: { index: false },
};

export default function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  return (
    <AuthShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <Onboarding searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Onboarding({ searchParams }: Pick<PageProps<"/onboarding">, "searchParams">) {
  const user = await requireUser("/onboarding");
  const { step } = await searchParams;

  // Demo users arrive with the seeded workspace; nothing to set up.
  if (user.isDemo) redirect("/app");

  if (step === "sample" && user.workspaceId) {
    return <SampleStep />;
  }
  if (user.workspaceId && step !== "name") {
    redirect("/app");
  }
  return <NameStep defaultValue={user.workspaceName ?? ""} />;
}

function StepCount({ current }: { current: 1 | 2 }) {
  return (
    <p className="text-sm text-muted">
      <span className="sr-only">Step </span>
      {current} of 2
    </p>
  );
}

function NameStep({ defaultValue }: { defaultValue: string }) {
  const { nameStep } = product.onboarding;
  return (
    <>
      <StepCount current={1} />
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-fg">{nameStep.title}</h1>
      <p className="mt-2 text-sm text-muted">{nameStep.description}</p>
      <div className="mt-8">
        <NameWorkspaceForm
          label={`${capitalize(product.workspaceNoun)} name`}
          placeholder={nameStep.placeholder}
          defaultValue={defaultValue}
        />
      </div>
      <form action={skipOnboarding} className="mt-4 flex justify-center">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Skip setup
        </button>
      </form>
    </>
  );
}

function SampleStep() {
  const { sampleStep } = product.onboarding;
  return (
    <>
      <StepCount current={2} />
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-fg">{sampleStep.title}</h1>
      <p className="mt-2 text-sm text-muted">{sampleStep.description}</p>
      <div className="mt-8 flex flex-col gap-3">
        {/* STUB (Day 1): seeding needs the API (Day 2). /app explains what's missing. */}
        <Link
          href="/app?sample=requested"
          className="inline-flex h-11 items-center justify-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg"
        >
          {sampleStep.action}
        </Link>
        <Link
          href="/app"
          className="inline-flex min-h-11 items-center justify-center self-center rounded-sm px-3 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Skip for now
        </Link>
      </div>
    </>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
