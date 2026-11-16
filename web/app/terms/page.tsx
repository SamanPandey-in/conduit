import type { Metadata } from "next";

import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `The terms for using ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const email = site.legal.email;
  return (
    <LegalPage title="Terms and Conditions">
      <p>
        These terms govern your use of the hosted {site.name} service at {new URL(site.url).host}, both the web app
        and the MCP gateway your agents connect to. By signing in, including with &ldquo;Continue as demo&rdquo;, you agree
        to them.
      </p>

      <h2>The service</h2>
      <p>
        {site.name} lets agents search your documents with cited answers and call tools you grant them, with
        approvals for risky calls and an audit log. It is a free project in active development, provided &ldquo;as
        is&rdquo; without uptime guarantees. Features, limits and availability may change.
      </p>
      <p>The public demo uses a shared sample workspace that is reset every night, and it has usage limits.</p>

      <h2>Your account</h2>
      <p>
        You sign in with Google or GitHub, and you&apos;re responsible for keeping that account secure. You&apos;re also
        responsible for the credentials you issue to agents and for the tools you grant them. If you think an account
        or credential has been compromised, revoke it and tell us right away.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Upload content you don&apos;t have the right to share, or anything illegal.</li>
        <li>Use {site.name} to send spam, malware or phishing, or to act on systems you aren&apos;t authorized to use.</li>
        <li>Get around rate limits, grants or approvals, for example by creating demo sessions in bulk.</li>
        <li>
          Try to access another workspace&apos;s data, or probe the service&apos;s security without our permission.
        </li>
      </ul>
      <p>
        If you find a security issue, including a way to read across workspaces, please report it to{" "}
        <a href={`mailto:${email}`}>{email}</a> instead. We may suspend or end access that breaks these rules, with
        notice where practical.
      </p>

      <h2>Your content</h2>
      <p>
        You keep all rights to the documents and data you put into {site.name}. We use them only to run the service
        for you: to search them, answer questions with citations and serve your agents&apos; tool calls.
      </p>
      <p>
        Answers come from a language model and can be wrong, even with citations. Approvals and grants reduce risk;
        they don&apos;t guarantee an agent will only do what you intended. Review what you approve.
      </p>

      <h2>Service availability</h2>
      <p>
        We don&apos;t guarantee that {site.name} will be uninterrupted or error-free. To the fullest extent permitted by
        law, we aren&apos;t liable for downtime, data loss, actions taken by connected agents, or changes to the service.
      </p>

      <h2>Termination</h2>
      <p>
        You can stop using {site.name} at any time and ask us to delete your account at{" "}
        <a href={`mailto:${email}`}>{email}</a>. We may suspend accounts or agent credentials that break these terms
        or put the service or other users at risk.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If we make material changes, we&apos;ll update the date at the top of this page. Continuing to use {site.name}{" "}
        after a change means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
