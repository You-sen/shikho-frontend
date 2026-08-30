const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

interface StrapiError {
  error?: { message?: string };
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const data = await res.json();

  if (!res.ok) {
    const err = data as StrapiError;
    throw new Error(err?.error?.message || 'Something went wrong');
  }

  return data as T;
}