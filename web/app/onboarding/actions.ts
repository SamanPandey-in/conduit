"use server";

import { randomBytes } from "node:crypto";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { product } from "@/lib/product";
import { requireUser } from "@/lib/session";

export type NameFormState = { error: string | null; value: string };

const MAX_NAME = 60;

export async function nameWorkspace(
  _prev: NameFormState,
  formData: FormData,
): Promise<NameFormState> {
  const user = await requireUser("/onboarding");
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");

  if (name.length === 0) {
    return { error: `Give your ${product.workspaceNoun} a name.`, value: name };
  }
  if (name.length > MAX_NAME) {
    return { error: `Keep it under ${MAX_NAME} characters.`, value: name };
  }

  await assignWorkspace(user.id, user.workspaceId, name);
  redirect("/onboarding?step=sample");
}

export async function skipOnboarding() {
  const user = await requireUser("/onboarding");
  await assignWorkspace(user.id, user.workspaceId, `My ${product.workspaceNoun}`);
  redirect("/app");
}

/**
 * Day 1: the workspace lives on the user row. The id is server-generated and the
 * field is `input: false`, so a client can never pick its own workspace claim.
 */
async function assignWorkspace(userId: string, existingId: string | null, name: string) {
  const ctx = await auth.$context;
  await ctx.internalAdapter.updateUser(userId, {
    workspaceId: existingId ?? `${product.workspaceNoun.slice(0, 3)}_${randomBytes(8).toString("hex")}`,
    workspaceName: name,
  });
}
