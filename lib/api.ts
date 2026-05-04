/**
 * Custom fetch wrapper that automatically adds the x-app-type header.
 * Dispatches an `account:suspended` DOM event when the server returns a
 * 403 with reason "account_suspended" so any mounted guard can react.
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
