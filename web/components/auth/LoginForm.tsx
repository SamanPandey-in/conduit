"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { FormError, Notice, OrDivider, PasswordField, Spinner, SubmitButton, TextField } from "@/components/auth/fields";
import { type Provider, SocialButtons, useLastUsedMethod } from "@/components/auth/SocialButtons";
import { authClient } from "@/lib/auth-client";
import { formErrorMessage } from "@/lib/auth-errors";
import { VERIFY_EMAIL_CALLBACK } from "@/lib/auth-policy";

type Props = {
  providers: Provider[];
  /** Already validated against the redirect allow-list on the server. */
  next: string;
  /** Shown above the form, e.g. after a password reset. */
  notice?: string;
};

export function LoginForm({ providers, next, notice }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {notice ? <Notice>{notice}</Notice> : null}
      <SocialButtons providers={providers} next={next} />
      {providers.length > 0 ? <OrDivider /> : null}
      <EmailSignIn next={next} />
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link
          href={next === "/app" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
          className="text-fg underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
      <DemoButton next={next} />
    </div>
  );
}

function EmailSignIn({ next }: { next: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState<string | null>(null);
  const lastUsed = useLastUsedMethod();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setPending(true);
    setError(null);
    setUnverified(null);
    // callbackURL is where the fresh confirmation link lands if the email isn't verified yet.
    const { data, error } = await authClient.signIn.email({ email, password, callbackURL: VERIFY_EMAIL_CALLBACK });
    if (error) {
      setPending(false);
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setUnverified(email);
        return;
      }
      setError(formErrorMessage(error, "Couldn't sign you in. Try again."));
      return;
    }
    // Pending stays set while the next page loads.
    const workspaceId = (data?.user as { workspaceId?: string | null } | undefined)?.workspaceId;
    router.replace(workspaceId ? next : "/onboarding");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" required />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        required
        labelAside={
          <Link href="/forgot-password" className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
            Forgot password?
          </Link>
        }
      />
      {unverified ? (
        <Notice>
          Confirm your email first. We sent a new link to <strong className="font-medium">{unverified}</strong>.
        </Notice>
      ) : null}
      <SubmitButton pending={pending} pendingLabel="Signing in…" hint={lastUsed === "email" ? "Last used" : null}>
        Sign in
      </SubmitButton>
      <FormError>{error}</FormError>
    </form>
  );
}

function DemoButton({ next }: { next: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function continueAsDemo() {
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.anonymous();
    if (error) {
      setPending(false);
      setError(formErrorMessage(error, "Couldn't start a demo session. Try again."));
      return;
    }
    router.replace(next);
  }

  return (
    <div className="flex flex-col items-center border-t border-line pt-4">
      <button
        type="button"
        onClick={continueAsDemo}
        disabled={pending}
        aria-busy={pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-sm text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Spinner /> : null}
        {pending ? "Starting demo…" : "Or try the demo without an account"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
