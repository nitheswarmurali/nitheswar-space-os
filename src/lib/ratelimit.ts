// Simple in-process fixed-window rate limiter.
// Replace with Redis/Upstash when scaling horizontally.
const buckets = new Map<string, { count: number; reset: number }>();

export function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: max - 1, reset: now + windowMs };
  }
  if (b.count >= max) return { ok: false, remaining: 0, reset: b.reset };
  b.count += 1;
  return { ok: true, remaining: max - b.count, reset: b.reset };
}

export function clientKey(req: Request, scope: string) {
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0].trim() || 'local';
  return `${scope}:${ip}`;
}