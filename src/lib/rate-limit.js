// Lightweight in-memory fixed-window rate limiter. No external deps.
//
// LIMITATION: state lives in one server instance's memory, so on multi-instance
// / serverless deployments it only throttles bursts that hit the same warm
// instance. It's solid basic abuse protection; for strict, distributed limits
// upgrade to Upstash Redis (@upstash/ratelimit) later. Keep it simple for now.

const buckets = new Map();
const MAX_ENTRIES = 10_000;

export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > MAX_ENTRIES) {
    for (const [k, v] of buckets) {
      if (now > v.reset) buckets.delete(k);
    }
  }

  const entry = buckets.get(key);
  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true };
}

export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
