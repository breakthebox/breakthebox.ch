// ═══════════════════════════════════════════════════════════
// In-Memory Rate Limiter (Fixed Window)
// ═══════════════════════════════════════════════════════════
// Single-process limiter with no external store. Suitable for low-volume,
// abuse-prone endpoints like the admin login on a single Node instance.
// Keyed per identifier (e.g. client IP).

interface Window {
	count: number;
	resetAt: number;
}

const windows = new Map<string, Window>();

// Opportunistic cleanup so the map does not grow unbounded across many keys.
function sweep(now: number) {
	for (const [key, win] of windows) {
		if (win.resetAt <= now) windows.delete(key);
	}
}

export interface RateLimitResult {
	/** True when this hit exceeds the limit and should be blocked. */
	limited: boolean;
	/** Remaining allowed hits in the current window. */
	remaining: number;
	/** Seconds until the window resets (for a Retry-After header / UI hint). */
	retryAfter: number;
}

/**
 * Register one hit against `key` and report whether the limit is exceeded.
 * Fixed window: the first hit opens a `windowMs` window allowing `limit` hits;
 * further hits within that window are blocked until it resets.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	if (windows.size > 5000) sweep(now);

	const win = windows.get(key);
	if (!win || win.resetAt <= now) {
		windows.set(key, { count: 1, resetAt: now + windowMs });
		return { limited: false, remaining: limit - 1, retryAfter: 0 };
	}

	win.count += 1;
	if (win.count > limit) {
		return { limited: true, remaining: 0, retryAfter: Math.ceil((win.resetAt - now) / 1000) };
	}
	return { limited: false, remaining: limit - win.count, retryAfter: 0 };
}

/** Test helper: clear all limiter state. */
export function __resetRateLimit() {
	windows.clear();
}
