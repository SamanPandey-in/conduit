import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <h1 className="text-xl font-semibold tracking-tight text-fg">Reset your password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter the email you signed up with and we&apos;ll send you a link to choose a new password.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </AuthShell>
  );
}
