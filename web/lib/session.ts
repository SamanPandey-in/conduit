import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Data access layer for the session. Every protected page and server action goes
 * through here; the proxy's cookie check is only an optimistic early redirect.
 */

export type CurrentUser = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  role: "user" | "demo" | "admin";
  isDemo: boolean;
  workspaceId: string | null;
  workspaceName: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { user } = session;
  const isDemo = Boolean(user.isAnonymous);
  return {
    id: user.id,
    name: user.name,
    // Demo users carry a placeholder email; never show it.
    email: isDemo ? null : user.email,
    image: user.image ?? null,
    role: toRole(user.role),
    isDemo,
    workspaceId: user.workspaceId ?? null,
    workspaceName: user.workspaceName ?? null,
  };
}

/** Redirects to /login (preserving where the user was going) when signed out. */
export async function requireUser(next: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return user;
}

function toRole(value: unknown): CurrentUser["role"] {
  return value === "demo" || value === "admin" ? value : "user";
}
