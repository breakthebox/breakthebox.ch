import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { auth0 } from '$lib/server/auth/providers';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Already logged in? Redirect to admin
	if (locals.user) {
		throw redirect(302, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		const state = generateState();

		const url = auth0.createAuthorizationURL(state, ['openid', 'profile', 'email']);

		cookies.set('oauth_state', state, {
			path: '/',
			httpOnly: true,
			secure: false, // dev: false, prod: true
			maxAge: 60 * 10, // 10 minutes
			sameSite: 'lax'
		});

		throw redirect(302, url.toString());
	}
};
