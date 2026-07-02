import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { dev } from '$app/environment';
import { getAuth0 } from '$lib/server/auth/providers';
import { rateLimit } from '$lib/server/rate-limit';
import type { Actions, PageServerLoad } from './$types';

// Brute-force guard: max attempts per IP before the login is temporarily blocked.
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const load: PageServerLoad = async ({ locals }) => {
	// Already logged in? Redirect to admin
	if (locals.user) {
		throw redirect(302, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ cookies, getClientAddress }) => {
		// ─── Rate limit per IP (brute-force protection) ───
		const { limited } = rateLimit(`login:${getClientAddress()}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
		if (limited) {
			console.warn(`[login] rate limit exceeded for ${getClientAddress()}`);
			throw redirect(303, '/auth/login?error=rate_limited');
		}

		const state = generateState();

		const url = getAuth0().createAuthorizationURL(state, ['openid', 'profile', 'email']);

		cookies.set('oauth_state', state, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			maxAge: 60 * 10, // 10 minutes
			sameSite: 'lax'
		});

		throw redirect(302, url.toString());
	}
};
