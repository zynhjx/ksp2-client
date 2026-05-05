/**
 * Custom fetch wrapper that automatically adds the x-app-type header.
 * Dispatches an `account:suspended` DOM event when the server returns a
 * 403 with reason "account_suspended" so any mounted guard can react.
 *
 * On a 401, it transparently calls POST /api/auth/refresh to rotate tokens
 * (the server reads/writes cookies automatically), then retries the original
 * request once. If the refresh also fails the original 401 response is returned.
 */
export async function apiFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const headers = new Headers(options?.headers);

  if (!headers.has('x-app-type')) {
    headers.set('x-app-type', 'youth');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'x-app-type': 'youth' },
        }
      );

      if (refreshResponse.ok) {
        // Retry the original request — cookies are now updated
        return await fetch(url, { ...options, headers });
      }
    } catch {
      // Network error during refresh — fall through and return original 401
    }

    return response;
  }

  if (response.status === 403 && typeof window !== 'undefined') {
    try {
      const data = await response.clone().json();
      if (data?.reason === 'account_suspended') {
        window.dispatchEvent(new CustomEvent('account:suspended'));
      }
    } catch {
      // ignore parse errors — original response is untouched
    }
  }

  return response;
}
