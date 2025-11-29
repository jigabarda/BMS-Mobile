// app/constants/api.ts
export const API_URL = "http://10.0.2.2:3000/api/v1"; // Android emulator mapping to localhost
// If testing on real device or Expo Go, change to your machine LAN IP, e.g. "http://192.168.1.5:3000/api/v1"

export async function apiRequest(
  endpoint: string,
  method = "GET",
  body?: unknown,
  token?: string | null
): Promise<any> {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  // Throw a helpful error message including status (so UI can inspect)
  if (!res.ok) {
    const text = await res.text();
    const message = text || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  // Some endpoints might return empty body (204) - handle gracefully
  if (res.status === 204) return null;
  return res.json();
}
