// app/lib/api.ts

// Devise auth routes are NOT inside /api/v1
export const API_URL = "http://192.168.1.5:3001";

// All API v1 endpoints must include /api/v1 manually
export const API_V1 = `${API_URL}/api/v1`;

export async function apiRequest(
  endpoint: string,
  method = "GET",
  body?: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<any> {
  // If endpoint starts with /auth → use root
  const url = endpoint.startsWith("/auth")
    ? `${API_URL}${endpoint}`
    : `${API_V1}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  };

  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    const message = text || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
