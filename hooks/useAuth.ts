// app/hooks/useAuth.ts

import * as SecureStore from "expo-secure-store";
import { apiRequest } from "../lib/api";

export interface LoginResponse {
  token: string;
  user?: { id: number; email: string };
  message?: string;
}

// ✔ FIXED LOGIN PAYLOAD FORMAT
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const payload = { user: { email, password } };

  const data = await apiRequest("/auth/sign_in", "POST", payload);

  if (data?.token) {
    await SecureStore.setItemAsync("auth_token", data.token);
  }

  return data;
}

// signup route
export async function signup(
  email: string,
  password: string,
  passwordConfirmation?: string
) {
  const payload = {
    user: {
      email,
      password,
      ...(passwordConfirmation
        ? { password_confirmation: passwordConfirmation }
        : {}),
    },
  };

  return apiRequest("/auth", "POST", payload);
}

export async function logout() {
  await SecureStore.deleteItemAsync("auth_token");
}

// unified token header
export async function getTokenHeaders() {
  const token = await SecureStore.getItemAsync("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function getRawToken() {
  return await SecureStore.getItemAsync("auth_token");
}
