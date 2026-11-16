"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function signOut() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    // Already signed out or session expired: the cookie is cleared either way.
  }
  redirect("/");
}
