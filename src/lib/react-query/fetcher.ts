export async function fetcher<TResponse = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(input, init);
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload && payload.error) ||
      (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
      `Request failed with status ${response.status}`;
    throw new Error(String(message));
  }

  return (payload as TResponse) ?? ({} as TResponse);
}
