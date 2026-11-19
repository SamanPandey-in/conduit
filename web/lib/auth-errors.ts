/**
 * Plain-language copy for auth errors:
 *   - describeAuthError: the `error` code Better Auth (or the OAuth provider) puts
 *     on the /auth/error redirect. Codes from better-auth/dist/oauth2/errors.mjs.
 *   - describeVerificationError: a bad email-confirmation link (/auth/verified).
 *   - formErrorMessage: inline errors on the email + password forms.
 */

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth-policy";

export type AuthErrorCopy = { title: string; body: string };

const CANCELLED: AuthErrorCopy = {
  title: "Sign-in was cancelled",
  body: "You closed the consent screen or declined access, so nothing was shared. You can try again whenever you like.",
};

const NOT_LINKED: AuthErrorCopy = {
  title: "This account can't be linked",
  body: "An account with this email already exists and couldn't be matched safely. Sign in the way you did the first time. If you signed up with a password, confirm your email address first.",
};

const NO_EMAIL: AuthErrorCopy = {
  title: "We couldn't read your email",
  body: "The provider didn't share a verified email address. On GitHub, make sure your account has a verified email, then try again.",
};

const EXPIRED: AuthErrorCopy = {
  title: "That sign-in link expired",
  body: "The sign-in took too long or was opened in a different browser. Start again from this device.",
};

const PROVIDER_DOWN: AuthErrorCopy = {
  title: "The provider didn't respond",
  body: "We couldn't reach the sign-in provider just now. Try again in a minute, or use the other provider.",
};

const RATE_LIMITED: AuthErrorCopy = {
  title: "Too many attempts",
  body: "Please wait a few minutes before trying again.",
};

const GENERIC: AuthErrorCopy = {
  title: "Sign-in didn't work",
  body: "Something went wrong on our side. Try again, and if it keeps happening, use another way to sign in.",
};

const BY_CODE: Record<string, AuthErrorCopy> = {
  access_denied: CANCELLED,
  account_not_linked: NOT_LINKED,
  unable_to_link_account: NOT_LINKED,
  account_already_linked_to_different_user: NOT_LINKED,
  email_does_not_match: NOT_LINKED,
  email_not_found: NO_EMAIL,
  email_not_verified: NO_EMAIL,
  state_mismatch: EXPIRED,
  state_not_found: EXPIRED,
  please_restart_the_process: EXPIRED,
  no_code: EXPIRED,
  invalid_code: EXPIRED,
  unable_to_get_user_info: PROVIDER_DOWN,
  oauth_provider_not_found: PROVIDER_DOWN,
  temporarily_unavailable: PROVIDER_DOWN,
  server_error: PROVIDER_DOWN,
  too_many_requests: RATE_LIMITED,
};

export function describeAuthError(code: string | string[] | undefined): AuthErrorCopy {
  if (typeof code !== "string") return GENERIC;
  return BY_CODE[code.toLowerCase()] ?? GENERIC;
}

const LINK_EXPIRED: AuthErrorCopy = {
  title: "That link expired",
  body: "Confirmation links last 24 hours. Sign in with your email and password and we'll send you a fresh one.",
};

const LINK_INVALID: AuthErrorCopy = {
  title: "That link didn't work",
  body: "It may have been used already or copied incompletely. Sign in with your email and password and we'll send you a new one.",
};

/** Copy for /auth/verified when Better Auth redirects back with `?error=`. */
export function describeVerificationError(code: string): AuthErrorCopy {
  return code.toUpperCase() === "TOKEN_EXPIRED" ? LINK_EXPIRED : LINK_INVALID;
}

const FORM_ERRORS: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "That email and password don't match. Check both, or reset your password.",
  INVALID_EMAIL: "Enter a valid email address.",
  PASSWORD_TOO_SHORT: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
  PASSWORD_TOO_LONG: `Use at most ${PASSWORD_MAX_LENGTH} characters.`,
  INVALID_TOKEN: "This reset link has expired or was already used. Request a new one.",
  TOKEN_EXPIRED: "This link has expired. Request a new one.",
};

/** Inline message for a Better Auth client error on the email + password forms. */
export function formErrorMessage(
  error: { code?: string; status?: number } | null | undefined,
  fallback: string,
): string {
  if (error?.status === 429) return "Too many attempts. Wait a few minutes and try again.";
  return (error?.code && FORM_ERRORS[error.code]) || fallback;
}
