/**
 * Custom fetch wrapper that automatically adds the x-app-type header
 */
export async function apiFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const headers = new Headers(options?.headers);
  
  // Add custom header if not already present
  if (!headers.has('x-app-type')) {
    headers.set('x-app-type', 'youth');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
