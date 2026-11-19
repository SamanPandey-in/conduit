// No `import "server-only"` here: the Better Auth CLI loads this file outside Next
// to run migrations. Pages and actions reach it only through lib/session.ts, which is guarded.
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { anonymous, jwt, lastLoginMethod } from "better-auth/plugins";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RESET_PASSWORD_EXPIRES_IN,
  VERIFY_EMAIL_EXPIRES_IN,
} from "@/lib/auth-policy";
import { db } from "@/lib/db";
import { actionEmail, sendEmail } from "@/lib/email";
import { product } from "@/lib/product";

const baseURL = requiredEnv("BETTER_AUTH_URL");

/**
 * Social providers are enabled only when their credentials exist, so local dev
 * works with email + password and "Continue as demo" before any OAuth app is registered.
 */
const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          // openid, email, profile only: non-sensitive, so no Google verification review.
          scope: ["openid", "email", "profile"],
          disableDefaultScope: true,
          prompt: "select_account" as const,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scope: ["read:user", "user:email"],
          disableDefaultScope: true,
        },
      }
    : {}),
};

export type SocialProvider = keyof typeof socialProviders;
export const enabledProviders = Object.keys(socialProviders) as SocialProvider[];

export const auth = betterAuth({
  appName: product.name,
  baseURL,
  secret: requiredEnv("BETTER_AUTH_SECRET"),
  database: db,
  socialProviders,

  emailAndPassword: {
    enabled: true,
    // No session until the email is confirmed. This also turns on Better Auth's
    // enumeration protection: signing up with a taken email returns the same
    // response as a new one, and the real owner gets a notice instead.
    requireEmailVerification: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_EXPIRES_IN,
    // A reset means the old password may be known to someone else: end every session.
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(
        actionEmail(user.email, {
          appName: product.name,
          subject: `Reset your ${product.name} password`,
          intro: `Someone asked to reset the password for your ${product.name} account. The link works once and expires in 30 minutes.`,
          action: "Choose a new password",
          url,
          outro: "If you didn't ask for this, ignore this email. Your password stays the same.",
        }),
      );
    },
    onPasswordReset: async ({ user }) => {
      await sendEmail(
        actionEmail(user.email, {
          appName: product.name,
          subject: `Your ${product.name} password was changed`,
          intro: `The password for your ${product.name} account was just changed, and every signed-in device was signed out.`,
          action: "Sign in",
          url: `${baseURL}/login`,
          outro: `If this wasn't you, reset your password now from the sign-in page and reply to this email.`,
        }),
      );
    },
    onExistingUserSignUp: async ({ user }) => {
      await sendEmail(
        actionEmail(user.email, {
          appName: product.name,
          subject: `Sign-up attempt for your ${product.name} account`,
          intro: `Someone tried to create a ${product.name} account with this email, which already has one. Nothing changed.`,
          action: "Sign in",
          url: `${baseURL}/login`,
          outro: "If it was you, sign in instead. If you've forgotten your password, reset it from the sign-in page.",
        }),
      );
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    // An unverified user who signs in (with the right password) gets a fresh link.
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: VERIFY_EMAIL_EXPIRES_IN,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(
        actionEmail(user.email, {
          appName: product.name,
          subject: `Confirm your email for ${product.name}`,
          intro: `Confirm this address to finish creating your ${product.name} account. The link expires in 24 hours.`,
          action: "Confirm email",
          url,
          outro: "If you didn't create an account, ignore this email and nothing will happen.",
        }),
      );
    },
  },

  user: {
    additionalFields: {
      // Server-owned (`input: false`): a client can never set its own role or
      // workspace, because both end up as trusted JWT claims for the API.
      role: { type: "string", required: false, defaultValue: "user", input: false },
      workspaceId: { type: "string", required: false, input: false },
      workspaceName: { type: "string", required: false, input: false },
    },
  },

  account: {
    // ADR-001: link accounts on a verified email from a trusted provider. Better Auth
    // also requires the local user's email to be verified first (requireLocalEmailVerified,
    // on by default), so an unconfirmed password sign-up can't capture a Google/GitHub login.
    accountLinking: { enabled: true, trustedProviders: ["google", "github"] },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    // No cookie cache: it would keep a revoked session valid for its maxAge.
    // One indexed session lookup per request is cheap at this scale.
  },

  databaseHooks: {
    user: {
      create: {
        // Demo users get the demo role and the shared seeded workspace.
        before: async (user) => {
          if ((user as { isAnonymous?: boolean }).isAnonymous) {
            return {
              data: {
                ...user,
                name: "Demo user",
                role: "demo",
                workspaceId: product.demoWorkspace,
                workspaceName: "Demo",
              },
            };
          }
          return { data: user };
        },
      },
    },
  },

  rateLimit: {
    // On in production by default; DB storage so limits hold across Cloud Run instances.
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      // The public demo spends real money: throttle demo sign-ins per IP.
      "/sign-in/anonymous": { window: 60 * 10, max: 3 },
      "/sign-in/social": { window: 60, max: 10 },
      // Password guessing and email-sending endpoints get tight per-IP limits.
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60 * 10, max: 5 },
      "/request-password-reset": { window: 60 * 10, max: 3 },
      "/send-verification-email": { window: 60 * 10, max: 3 },
      "/reset-password": { window: 60 * 10, max: 10 },
    },
  },

  onAPIError: { errorURL: "/auth/error" },

  advanced: {
    cookiePrefix: product.name.toLowerCase(),
    // Secure cookies whenever we're served over https (prod), even if NODE_ENV says otherwise.
    useSecureCookies: baseURL.startsWith("https://"),
  },

  plugins: [
    anonymous({ emailDomainName: "demo.invalid" }),
    lastLoginMethod(),
    jwt({
      jwt: {
        issuer: baseURL,
        audience: product.apiAudience,
        expirationTime: "15m",
        // Only what the API needs. `sub` (user id) is added by the plugin.
        definePayload: ({ user }) => ({
          role: (user.role as string | undefined) ?? "user",
          [product.workspaceClaim]: (user.workspaceId as string | null | undefined) ?? null,
        }),
      },
      // Tokens are minted server-side on demand (lib/api.ts); don't sign one on every get-session.
      disableSettingJwtHeader: true,
    }),
    nextCookies(), // must stay last
  ],
});

export type Session = typeof auth.$Infer.Session;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  }
  return value;
}
