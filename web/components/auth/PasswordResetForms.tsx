"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { FormError, Notice, PasswordField, SubmitButton, TextField } from "@/components/auth/fields";
import { authClient } from "@/lib/auth-client";
import { formErrorMessage } from "@/lib/auth-errors";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, RESET_PASSWORD_PATH } from "@/lib/auth-policy";

/** Step 1: ask for a reset link. The reply is the same whether or not the email has an account. */
export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setPending(true);
    setError(null);
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: RESET_PASSWORD_PATH });
    setPending(false);
    if (error) {
      setError(formErrorMessage(error, "Couldn't send the reset link. Try again."));
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-4">
        <Notice>
          If <strong className="font-medium">{sentTo}</strong> has an account, a reset link is on its way. It works once
          and expires in 30 minutes.
        </Notice>
        <BackToSignIn />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" required autoFocus />
      <SubmitButton pending={pending} pendingLabel="Sending…">
        Send reset link
      </SubmitButton>
      <FormError>{error}</FormError>
      <BackToSignIn />
    </form>
  );
}

/** Step 2: set the new password. `token` comes from the emailed link via the server page. */
export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newPassword = String(new FormData(event.currentTarget).get("password") ?? "");
    setPending(true);
    setError(null);
    const { error } = await authClient.resetPassword({ newPassword, token });
    if (error) {
      setPending(false);
      setExpired(error.code === "INVALID_TOKEN");
      setError(formErrorMessage(error, "Couldn't update your password. Try again."));
      return;
    }
    // Every session was revoked by the reset, including any on this device.
    router.replace("/login?reset=done");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <PasswordField
        label="New password"
        name="password"
        autoComplete="new-password"
        minLength={PASSWORD_MIN_LENGTH}
        maxLength={PASSWORD_MAX_LENGTH}
        required
        autoFocus
        hint={`At least ${PASSWORD_MIN_LENGTH} characters. You'll be signed out everywhere else.`}
      />
      <SubmitButton pending={pending} pendingLabel="Updating…">
        Update password
      </SubmitButton>
      <FormError>
        {error}
        {expired ? (
          <>
            {" "}
            <Link href="/forgot-password" className="text-fg underline underline-offset-4">
              Request a new link
            </Link>
          </>
        ) : null}
      </FormError>
    </form>
  );
}

function BackToSignIn() {
  return (
    <Link
      href="/login"
      className="inline-flex min-h-11 items-center justify-center self-center rounded-sm px-3 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
    >
      Back to sign in
    </Link>
  );
}
