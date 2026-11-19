import type { Metadata } from "next";

import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and deletes your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const email = site.legal.email;
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy covers the hosted {site.name} service at {new URL(site.url).host}, including the public demo. It
        applies to people who sign in to the web app and to the agents they connect. Conduit is in active
        development: where a feature below isn&apos;t live yet, this describes how it will handle data when it ships.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account information.</strong> If you sign in with Google: your name, email address, profile picture
          and Google account ID. If you sign in with GitHub: your account ID, username, name, email address and
          avatar. If you sign up with email: your name, email address and a password. We store the password only as a
          one-way hash (scrypt), never in readable form, and we record when you confirmed your email address.
        </li>
        <li>
          <strong>Demo sessions.</strong> &ldquo;Continue as demo&rdquo; creates a temporary account with a random ID and
          no personal information, inside a shared demo workspace.
        </li>
        <li>
          <strong>Workspace content.</strong> Documents you upload, the text extracted from them, and the passages and
          embeddings built from that text so they can be searched. Questions asked in the workspace and the cited
          answers.
        </li>
        <li>
          <strong>Agent activity.</strong> The agents you connect and the tools they&apos;re granted. For every tool call:
          an audit record of which agent called which tool, when, the decision (allowed, denied, held for approval)
          and a hash of the arguments. Calls held for approval keep their full arguments so an admin can review them.
        </li>
        <li>
          <strong>Technical data.</strong> Your IP address and browser user agent, stored with your session and used
          to rate-limit sign-ins and prevent abuse.
        </li>
      </ul>

      <h2>What we don&apos;t collect</h2>
      <p>
        We don&apos;t sell your data, show ads, use your documents or questions to train models, run analytics or track
        you across other sites. Each workspace is isolated: one workspace&apos;s documents are never used to answer
        another&apos;s questions.
      </p>

      <h2>Cookies</h2>
      <p>We set two cookies, and neither is used for tracking or analytics:</p>
      <ul>
        <li>
          <strong>Session cookie</strong> (strictly necessary). Keeps you signed in. It is httpOnly, so scripts on the
          page can&apos;t read it.
        </li>
        <li>
          <strong>Last sign-in method</strong> (functional). Remembers whether you last used Google, GitHub or email
          so the sign-in page can point to it. Expires after 30 days.
        </li>
      </ul>
      <p>Agents don&apos;t use cookies; they authenticate with their own tokens. If we ever add non-essential cookies, we&apos;ll ask for your consent first.</p>

      <h2>Third parties</h2>
      <ul>
        <li>
          <strong>Google Cloud</strong> hosts the service (Cloud Run) and its database (Cloud SQL).
        </li>
        <li>
          <strong>Vertex AI (Google Cloud)</strong> creates the embeddings used for search and writes cited answers.
          Document text and questions are sent to Vertex AI for that purpose.
        </li>
        <li>
          <strong>Google and GitHub</strong> handle sign-in when you choose them. We receive only the profile
          information listed above.
        </li>
        <li>
          <strong>Resend</strong> delivers account emails: address confirmation, password reset links and security
          notices. It receives your email address and the message, nothing else.
        </li>
      </ul>
      <p>
        Agents you connect receive whatever their granted tools return. You decide those grants. We don&apos;t share your
        data with anyone else.
      </p>

      <h2>Data retention and deletion</h2>
      <p>
        We keep account and workspace data while your account is active. Deleting a document deletes its text,
        passages and embeddings. Audit records are kept for as long as the workspace exists, so the log stays
        complete. Sessions expire after 7 days without use. Demo accounts and the demo workspace are reset every
        night. To delete your account and workspaces, email <a href={`mailto:${email}`}>{email}</a> from the address
        on your account.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        {site.name} is not directed at children under 13, and we don&apos;t knowingly collect personal information from
        them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we make material changes, we&apos;ll update the date at the top of this page. Continuing to use {site.name}{" "}
        after a change means you accept the updated policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data: <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
