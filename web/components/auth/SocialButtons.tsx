"use client";

import { useState, useSyncExternalStore } from "react";

import { Spinner } from "@/components/auth/fields";
import { ProviderIcon } from "@/components/auth/ProviderIcon";
import { authClient } from "@/lib/auth-client";
import { formErrorMessage } from "@/lib/auth-errors";

export type Provider = "google" | "github";

const PROVIDER_LABEL: Record<Provider, string> = { google: "Google", github: "GitHub" };

type Props = {
  providers: Provider[];
  /** Already validated against the redirect allow-list on the server. */
  next: string;
};

/** Google / GitHub buttons. Sign-in and sign-up are the same call: new users land on onboarding. */
export function SocialButtons({ providers, next }: Props) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastUsed = useLastUsedMethod();

  if (providers.length === 0) return null;

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
      setError(formErrorMessage(error, `Couldn't reach ${PROVIDER_LABEL[provider]}. Try again.`));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => signInWith(provider)}
          disabled={pending !== null}
          aria-busy={pending === provider}
          className="relative inline-flex h-11 items-center justify-center gap-3 rounded-sm border border-line bg-surface px-4 text-sm font-medium text-fg transition-colors duration-150 hover:border-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === provider ? <Spinner /> : <ProviderIcon provider={provider} />}
          {pending === provider
            ? `Opening ${PROVIDER_LABEL[provider]}…`
            : `Continue with ${PROVIDER_LABEL[provider]}`}
          {lastUsed === provider && pending === null ? <LastUsed /> : null}
        </button>
      ))}
      {error ? (
        <p role="alert" className="text-center text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LastUsed() {
  return <span className="absolute right-3 text-xs text-muted">Last used</span>;
}

/**
 * The last-used method lives in a readable cookie set by Better Auth's
 * lastLoginMethod plugin ("google", "github" or "email"). Server snapshot is
 * null so markup matches on hydration.
 */
export function useLastUsedMethod(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => authClient.getLastUsedLoginMethod(),
    () => null,
  );
}

function noopSubscribe() {
  return () => {};
}
