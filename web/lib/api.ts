import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * JWT bridge to the FastAPI service. The browser never holds the API token:
 * the server mints a short-lived JWT from the session and calls the API itself.
 */

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number | null; error: string };

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  let token: string;
  try {
    ({ token } = await auth.api.getToken({ headers: await headers() }));
  } catch {
    return { ok: false, status: 401, error: "No session" };
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: res.statusText || "Request failed" };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    const reason = err instanceof Error && err.name === "TimeoutError" ? "timed out" : "unreachable";
    return { ok: false, status: null, error: `API ${reason}` };
  }
}
