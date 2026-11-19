/**
 * Email + password rules shared by the server config (lib/auth.ts) and the
 * forms, so the hint a user reads is the rule the server enforces.
 */

/**
 * Length is the only composition rule. No forced symbols or digits (NIST
 * SP 800-63B): they push people toward predictable patterns. 12 is a middle
 * ground between NIST's 8 (with MFA) and 15 (single factor).
 */
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

/** Confirmation links stay valid for a day: people open them from another device or later. */
export const VERIFY_EMAIL_EXPIRES_IN = 60 * 60 * 24;
/** Reset links are short-lived: they grant account access without the old password. */
export const RESET_PASSWORD_EXPIRES_IN = 60 * 30;

/** Where the confirmation link lands. Better Auth appends `?error=` when the link is bad. */
export const VERIFY_EMAIL_CALLBACK = "/auth/verified";
/** Where the reset link lands, with `?token=` or `?error=INVALID_TOKEN`. */
export const RESET_PASSWORD_PATH = "/reset-password";

const PROVIDER_NAMES: Record<string, string> = { google: "Google", github: "GitHub" };

/**
 * "Use Google, GitHub or your email and password." built from the providers that
 * are configured, so the subtitle never promises a button that isn't there.
 */
export function signInMethodsLine(providers: readonly string[]): string {
  const methods = [...providers.map((p) => PROVIDER_NAMES[p] ?? p), "your email and password"];
  const list = methods.length === 1 ? methods[0] : `${methods.slice(0, -1).join(", ")} or ${methods.at(-1)}`;
  return `Use ${list}.`;
}
