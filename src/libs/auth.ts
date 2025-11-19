import { apiFetch } from "./apiClient";
import type { AuthResponse, RegisterPayload, LibraryUser } from "@interfaces";

export async function loginUser(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

export async function registerUser(payload: RegisterPayload) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function getProfile(token: string) {
  return apiFetch<{ success: boolean; data: LibraryUser }>("/auth/me", {
    method: "GET",
    token,
  });
}
