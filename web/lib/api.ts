import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * JWT bridge to the product API. The browser never holds the API token:
 * the server mints a short-lived JWT from the session and calls the API itself.
 */

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number | null; error: string };

export function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>("GET", path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  return request<T>("POST", path, body);
}

async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<ApiResult<T>> {
  let token: string;
  try {
    ({ token } = await auth.api.getToken({ headers: await headers() }));
  } catch {
    return { ok: false, status: 401, error: "No session" };
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await errorDetail(res) };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch (err) {
    const reason = err instanceof Error && err.name === "TimeoutError" ? "timed out" : "unreachable";
    return { ok: false, status: null, error: `API ${reason}` };
  }
}

/** FastAPI puts a human-readable reason in `detail`; fall back to the status text. */
async function errorDetail(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: unknown };
    if (typeof data.detail === "string") return data.detail;
  } catch {
    // Not JSON.
  }
  return res.statusText || "Request failed";
}
