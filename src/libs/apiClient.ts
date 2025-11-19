import { API_BASE_URL } from "./config";

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  { token, skipAuth, headers, ...options }: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const mergedHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token && !skipAuth) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error =
      data?.error ||
      data?.message ||
      data?.msg ||
      (data?.success === false ? "Request rejected by the server" : null) ||
      response.statusText ||
      `Request failed (${response.status})`;
    throw new Error(error);
  }

  return data as T;
}
