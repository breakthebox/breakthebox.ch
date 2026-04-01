// ═══════════════════════════════════════════════════════════
// Auth Guards — Route Protection Helpers
// ═══════════════════════════════════════════════════════════
// Usage in +page.server.ts / +server.ts:
//   const { user } = requireAuth(event);
//   requireRole(event, ['admin', 'editor']);

import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Require authenticated user. Redirects to login if not authenticated.
 */
export function requireAuth(event: RequestEvent) {
	if (!event.locals.user || !event.locals.session) {
		throw redirect(302, '/auth/login');
	}
	return { user: event.locals.user, session: event.locals.session };
}

/**
 * Require specific role(s). Redirects to dashboard if role doesn't match.
 */
export function requireRole(event: RequestEvent, allowedRoles: string[]) {
	const { user } = requireAuth(event);
	if (!allowedRoles.includes(user.role)) {
		throw redirect(302, '/');
	}
	return { user, session: event.locals.session! };
}
