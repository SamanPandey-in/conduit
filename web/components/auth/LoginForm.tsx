"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { ProviderIcon } from "@/components/auth/ProviderIcon";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";
type Pending = Provider | "demo" | null;

const PROVIDER_LABEL: Record<Provider, string> = { google: "Google", github: "GitHub" };

type Props = {
  providers: Provider[];
  /** Already validated against the redirect allow-list on the server. */
  next: string;
};

export function LoginForm({ providers, next }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);
  const lastUsed = useLastUsedMethod();

  async function signInWith(provider: Provider) {
    setPending(provider);
    setError(null);
    // On success the browser navigates to the provider, so pending stays set.
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: next,
      newUserCallbackURL: "/onboarding",
      errorCallbackURL: "/auth/error",
    });
    if (error) {
      setPending(null);
      setError(messageFor(error.status, `Couldn't reach ${PROVIDER_LABEL[provider]}. Try again.`));
    }
  }

  async function continueAsDemo() {
    setPending("demo");
    setError(null);
    const { error } = await authClient.signIn.anonymous();
    if (error) {
      setPending(null);
      setError(messageFor(error.status, "Couldn't start a demo session. Try again."));
      return;
    }
    router.replace(next);
  }

  const busy = pending !== null;
  // With no OAuth configured the demo is the only way in, so it becomes the primary action.
  const demoClass =
    providers.length === 0
      ? "inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex min-h-11 items-center justify-center gap-2 self-center rounded-sm px-3 text-sm text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => signInWith(provider)}
          disabled={busy}
          aria-busy={pending === provider}
          className="relative inline-flex h-11 items-center justify-center gap-3 rounded-sm border border-line bg-surface px-4 text-sm font-medium text-fg transition-colors duration-150 hover:border-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === provider ? <Spinner /> : <ProviderIcon provider={provider} />}
          {pending === provider
            ? `Opening ${PROVIDER_LABEL[provider]}…`
            : `Continue with ${PROVIDER_LABEL[provider]}`}
          {lastUsed === provider && pending === null ? (
            <span className="absolute right-3 text-xs text-muted">Last used</span>
          ) : null}
        </button>
      ))}

      {providers.length === 0 ? (
        <p className="text-sm text-muted">
          Google and GitHub sign-in aren&apos;t configured in this environment.
        </p>
      ) : null}

      <button
        type="button"
        onClick={continueAsDemo}
        disabled={busy}
        aria-busy={pending === "demo"}
        className={demoClass}
      >
        {pending === "demo" ? <Spinner /> : null}
        {pending === "demo" ? "Starting demo…" : "Continue as demo"}
      </button>

      <p role="alert" className="min-h-5 text-center text-sm text-danger">
        {error}
      </p>
    </div>
  );
}

function messageFor(status: number | undefined, fallback: string): string {
  if (status === 429) return "Too many attempts. Wait a few minutes and try again.";
  return fallback;
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
    />
  );
}

/**
 * The last-used provider lives in a readable cookie set by Better Auth's
 * lastLoginMethod plugin. Server snapshot is null so markup matches on hydration.
 */
function useLastUsedMethod(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => authClient.getLastUsedLoginMethod(),
    () => null,
  );
}

function noopSubscribe() {
  return () => {};
}
