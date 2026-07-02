import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit, __resetRateLimit } from './rate-limit';

const LIMIT = 5;
const WINDOW = 15 * 60 * 1000; // 15 min

describe('rateLimit', () => {
	beforeEach(() => {
		__resetRateLimit();
		vi.useFakeTimers();
		vi.setSystemTime(0);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('allows up to the limit, then blocks further hits', () => {
		for (let i = 0; i < LIMIT; i++) {
			expect(rateLimit('ip', LIMIT, WINDOW).limited).toBe(false);
		}
		expect(rateLimit('ip', LIMIT, WINDOW).limited).toBe(true);
	});

	it('reports decreasing remaining count', () => {
		expect(rateLimit('ip', LIMIT, WINDOW).remaining).toBe(4);
		expect(rateLimit('ip', LIMIT, WINDOW).remaining).toBe(3);
	});

	it('tracks keys independently', () => {
		for (let i = 0; i < LIMIT; i++) rateLimit('a', LIMIT, WINDOW);
		expect(rateLimit('a', LIMIT, WINDOW).limited).toBe(true);
		expect(rateLimit('b', LIMIT, WINDOW).limited).toBe(false);
	});

	it('resets after the window elapses', () => {
		for (let i = 0; i < LIMIT; i++) rateLimit('ip', LIMIT, WINDOW);
		expect(rateLimit('ip', LIMIT, WINDOW).limited).toBe(true);

		vi.setSystemTime(WINDOW + 1);
		expect(rateLimit('ip', LIMIT, WINDOW).limited).toBe(false);
	});

	it('exposes retryAfter (seconds) while blocked', () => {
		for (let i = 0; i < LIMIT; i++) rateLimit('ip', LIMIT, WINDOW);
		const res = rateLimit('ip', LIMIT, WINDOW);
		expect(res.limited).toBe(true);
		expect(res.retryAfter).toBe(WINDOW / 1000);
	});
});
