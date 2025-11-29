// app/hooks/useAuth.ts
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "../lib/api";

export interface LoginResponse {
  token: string;
  user?: { id: number; email: string };
  message?: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  // Rails expects nested user param in your backend routes
  const payload = { user: { email, password } };
  const data = await apiRequest("/auth/sign_in", "POST", payload);
  // store token
  if (data && data.token) {
    await SecureStore.setItemAsync("token", data.token);
  }
  return data;
}

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

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync("token");
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync("token");
}
