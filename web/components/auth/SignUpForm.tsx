"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { FormError, Notice, OrDivider, PasswordField, SubmitButton, TextField } from "@/components/auth/fields";
import { type Provider, SocialButtons } from "@/components/auth/SocialButtons";
import { authClient } from "@/lib/auth-client";
import { formErrorMessage } from "@/lib/auth-errors";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFY_EMAIL_CALLBACK } from "@/lib/auth-policy";

type Props = {
  providers: Provider[];
  /** Already validated against the redirect allow-list on the server. */
  next: string;
};

export function SignUpForm({ providers, next }: Props) {
  // Set once the account is created: the form gives way to "check your inbox".
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) return <CheckInbox email={sentTo} onRestart={() => setSentTo(null)} />;

  return (
    <div className="flex flex-col gap-6">
      <SocialButtons providers={providers} next={next} />
      {providers.length > 0 ? <OrDivider /> : null}
      <EmailSignUp onCreated={setSentTo} />
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={next === "/app" ? "/login" : `/login?next=${encodeURIComponent(next)}`}
          className="text-fg underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function EmailSignUp({ onCreated }: { onCreated: (email: string) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setPending(true);
    setError(null);
    const { error } = await authClient.signUp.email({ name, email, password, callbackURL: VERIFY_EMAIL_CALLBACK });
    setPending(false);
    if (error) {
      setError(formErrorMessage(error, "Couldn't create your account. Try again."));
      return;
    }
    // Same screen whether the email was new or already registered: the response is
    // identical by design, and an existing owner gets a notice email instead.
    onCreated(email);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextField label="Name" name="name" autoComplete="name" maxLength={80} required />
      <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" required />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        minLength={PASSWORD_MIN_LENGTH}
        maxLength={PASSWORD_MAX_LENGTH}
        required
        hint={`At least ${PASSWORD_MIN_LENGTH} characters. A few unrelated words work well.`}
      />
      <SubmitButton pending={pending} pendingLabel="Creating account…">
        Create account
      </SubmitButton>
      <FormError>{error}</FormError>
    </form>
  );
}

function CheckInbox({ email, onRestart }: { email: string; onRestart: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    setState("sending");
    setError(null);
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: VERIFY_EMAIL_CALLBACK });
    if (error) {
      setState("idle");
      setError(formErrorMessage(error, "Couldn't resend the email. Try again."));
      return;
    }
    setState("sent");
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-fg">Check your email</h2>
      <p className="text-sm text-muted">
        We sent a confirmation link to <strong className="font-medium text-fg">{email}</strong>. Open it on any device
        to finish creating your account. The link expires in 24 hours.
      </p>
      {state === "sent" ? <Notice>Sent again. It can take a minute to arrive; check spam too.</Notice> : null}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={state !== "idle"}
          className="inline-flex min-h-11 items-center text-fg underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Resend the email"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Use a different email
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
