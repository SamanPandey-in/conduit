/**
 * Plain-language copy for the `error` codes Better Auth (and the OAuth provider)
 * put on the /auth/error redirect. Codes from better-auth/dist/oauth2/errors.mjs.
 */

export type AuthErrorCopy = { title: string; body: string };

const CANCELLED: AuthErrorCopy = {
  title: "Sign-in was cancelled",
  body: "You closed the consent screen or declined access, so nothing was shared. You can try again whenever you like.",
};

const NOT_LINKED: AuthErrorCopy = {
  title: "This account can't be linked",
  body: "An account with this email already exists and couldn't be matched safely. Sign in with the provider you used the first time.",
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
  body: "Something went wrong on our side. Try again, and if it keeps happening, use the other provider.",
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
