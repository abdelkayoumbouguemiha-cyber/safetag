// Simple in-memory rate limiter — fine for pilot scale (single server instance).
// For production at larger scale, replace with a Redis-backed solution.

const requests = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const timestamps = requests.get(key) ?? [];

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) {
    requests.set(key, recent);
    return true;
  }

  recent.push(now);
  requests.set(key, recent);
  return false;
}
