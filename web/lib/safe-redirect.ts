/**
 * Validates the `next` redirect param against a same-origin allow-list.
 *
 * Only relative paths under an allowed prefix pass. Everything else (absolute URLs,
 * protocol-relative `//evil.com`, backslash tricks `/\evil.com`, encoded variants)
 * falls back to the default, which closes the open-redirect hole.
 */

const ALLOWED_PREFIXES = ["/app", "/onboarding"] as const;
export const DEFAULT_REDIRECT = "/app";

export function safeRedirect(
  next: string | string[] | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (typeof next !== "string" || next.length === 0 || next.length > 512) {
    return fallback;
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return fallback;
  }

  // Must be a single-slash relative path. Reject `//host`, `/\host`, control chars.
  if (!decoded.startsWith("/") || decoded.startsWith("//") || /[\\\u0000-\u001f]/.test(decoded)) {
    return fallback;
  }

  // Resolve against a dummy origin to normalise `..` segments, then re-check.
  const base = "http://same-origin.invalid";
  let url: URL;
  try {
    url = new URL(decoded, base);
  } catch {
    return fallback;
  }
  if (url.origin !== base) {
    return fallback;
  }

  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
  );
  return allowed ? `${url.pathname}${url.search}${url.hash}` : fallback;
}
