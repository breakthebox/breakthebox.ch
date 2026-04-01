// ═══════════════════════════════════════════════════════════
// Auth0 OAuth Callback
// ═══════════════════════════════════════════════════════════
// Handles the redirect from Auth0 after user authenticates.
// Only whitelisted emails are allowed to sign in.

import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuth0 } from '$lib/server/auth/providers';
import { handleOAuthCallback } from '$lib/server/auth/oauth-callback';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

// ─── Email Whitelist ───
// Only these emails can sign in. Add more as needed.
const ALLOWED_EMAILS = ['brigitte@breakthebox.ch'];

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	// Validate state
	if (!code || !state || !storedState || state !== storedState) {
		throw error(400, 'Ungültiger OAuth-State. Bitte erneut anmelden.');
	}

	// Clean up OAuth cookies
	cookies.delete('oauth_state', { path: '/' });

	try {
		// Exchange code for tokens
		const tokens = await getAuth0().validateAuthorizationCode(code);
		const accessToken = tokens.accessToken();

		// Fetch user info from Auth0
		const auth0Domain = env.AUTH0_DOMAIN ?? '';
		const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (!userInfoResponse.ok) {
			throw error(500, 'Benutzerinformationen konnten nicht abgerufen werden.');
		}

		const auth0User = await userInfoResponse.json();
		const email = (auth0User.email as string)?.toLowerCase();
		const name = (auth0User.name as string) ?? email;
		const picture = auth0User.picture as string | null;
		const providerUserId = auth0User.sub as string;

		if (!email) {
			throw error(400, 'Keine E-Mail-Adresse vom Provider erhalten.');
		}

		// ─── Whitelist Check ───
		if (!ALLOWED_EMAILS.includes(email)) {
			throw redirect(302, '/auth/login?error=not_allowed');
		}

		// Handle OAuth callback (create/update user + session)
		const result = await handleOAuthCallback({
			providerId: 'auth0',
			providerUserId,
			email,
			name,
			picture
		});

		if (!result.success) {
			throw redirect(302, '/auth/login?error=email_exists');
		}

		// Ensure first whitelisted user gets admin role
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser.length > 0 && existingUser[0].role !== 'admin') {
			await db
				.update(users)
				.set({ role: 'admin', updatedAt: new Date() })
				.where(eq(users.email, email));
		}

		// Set session cookie
		cookies.set(result.sessionCookie.name, result.sessionCookie.value, {
			path: '/',
			...result.sessionCookie.attributes
		});

		throw redirect(302, '/admin');
	} catch (err) {
		// Re-throw redirects and SvelteKit errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('OAuth callback error:', err);
		throw redirect(302, '/auth/login?error=callback_failed');
	}
};
