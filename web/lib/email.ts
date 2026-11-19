/**
 * Transactional email for auth (verification, password reset, security notices).
 *
 * With RESEND_API_KEY and EMAIL_FROM set, mail goes through Resend's HTTP API:
 * no SDK, just one fetch. Without them, outside production, the message is
 * printed to the dev server log so the whole sign-up flow works locally with
 * no email account. In production a missing provider throws: a silently
 * dropped verification link would lock every new user out.
 *
 * No path-alias imports here, so the node test runner can load this file as is.
 */

export type EmailMessage = { to: string; subject: string; text: string; html: string };

type EmailEnv = { RESEND_API_KEY?: string; EMAIL_FROM?: string; NODE_ENV?: string };

const RESEND_URL = "https://api.resend.com/emails";

export async function sendEmail(
  message: EmailMessage,
  env: EmailEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;

  if (apiKey && from) {
    const response = await fetchImpl(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      // A hung provider must not hold the sign-up request open indefinitely.
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      // The provider's reason helps debugging; the message body (with its link) is never logged.
      const reason = await response.text().catch(() => "");
      throw new Error(`Email provider rejected the message (${response.status}): ${reason.slice(0, 200)}`);
    }
    return;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("Email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  console.info(`\n[email:dev] to: ${message.to}\n[email:dev] subject: ${message.subject}\n${message.text}\n`);
}

type ActionEmail = {
  appName: string;
  subject: string;
  /** One or two sentences: what happened and what the link does. */
  intro: string;
  /** Button label. */
  action: string;
  url: string;
  /** Closing line, usually what to do if this wasn't you. */
  outro: string;
};

/** One template for every auth email: a sentence, a button, the raw link, a closing line. */
export function actionEmail(to: string, email: ActionEmail): EmailMessage {
  const { appName, subject, intro, action, url, outro } = email;
  const text = `${intro}\n\n${action}: ${url}\n\n${outro}\n\n${appName}`;
  const muted = "color:#5a6270;font-size:13px;line-height:20px";
  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:32px 16px;background:#ffffff;color:#0f1216;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:480px;margin:0 auto">
<p style="margin:0 0 24px;font-size:15px;font-weight:600">${escapeHtml(appName)}</p>
<p style="margin:0 0 24px;font-size:15px;line-height:24px">${escapeHtml(intro)}</p>
<p style="margin:0 0 24px"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;border-radius:6px;background:#0f1216;color:#ffffff;font-size:14px;font-weight:500;text-decoration:none">${escapeHtml(action)}</a></p>
<p style="margin:0 0 8px;${muted}">Or paste this link into your browser:</p>
<p style="margin:0 0 24px;${muted};word-break:break-all"><a href="${escapeHtml(url)}" style="color:#5a6270">${escapeHtml(url)}</a></p>
<p style="margin:0;${muted}">${escapeHtml(outro)}</p>
</div>
</body>
</html>`;
  return { to, subject, text, html };
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
