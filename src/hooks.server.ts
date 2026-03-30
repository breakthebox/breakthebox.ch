// ═══════════════════════════════════════════════════════════
// Server Hooks — Auth Middleware + Security Headers
// ═══════════════════════════════════════════════════════════
// All /(app) routes require a valid session.
// CSRF origin check on non-GET requests.
// Security headers on every response.

import { lucia } from '$lib/server/auth/lucia';
import { redirect, error, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// ─── CSRF origin check for non-GET requests ───
	if (event.request.method !== 'GET') {
		const origin = event.request.headers.get('origin');
		if (origin && new URL(origin).origin !== event.url.origin) {
			throw error(403, 'CSRF check failed');
		}
	}

	// ─── Session validation ───
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const result = await lucia.validateSession(sessionId);

		if (result.session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}

		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}

		event.locals.user = result.user;
		event.locals.session = result.session;
	}

	// ─── Protect /(app) routes ───
	if (event.route.id?.startsWith('/(app)') && !event.locals.user) {
		throw redirect(302, '/auth/login');
	}

	// ─── Resolve with locale ───
	const locale = event.cookies.get('locale') || 'de';

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});

	// ─── Security headers ───
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
