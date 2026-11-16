// No `import "server-only"` here: the Better Auth CLI loads this file outside Next
// to run migrations. Pages and actions reach it only through lib/session.ts, which is guarded.
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { anonymous, jwt, lastLoginMethod } from "better-auth/plugins";

import { db } from "@/lib/db";
import { product } from "@/lib/product";

const baseURL = requiredEnv("BETTER_AUTH_URL");

/**
 * Social providers are enabled only when their credentials exist, so local dev
 * works with just "Continue as demo" before any OAuth app is registered.
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
    // ADR-001: link accounts on a verified email from a trusted provider.
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
