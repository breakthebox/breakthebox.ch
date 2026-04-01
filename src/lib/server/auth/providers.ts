// ═══════════════════════════════════════════════════════════
// OAuth Providers — Auth0 (via Arctic)
// ═══════════════════════════════════════════════════════════
// Docs: https://arcticjs.dev/providers/auth0
// Add more providers as needed (Google, GitHub, etc.)

import { Auth0 } from 'arctic';
import { env } from '$env/dynamic/private';

let _auth0: Auth0 | null = null;

export function getAuth0(): Auth0 {
	if (!_auth0) {
		const baseUrl = env.PUBLIC_APP_URL ?? 'http://localhost:5173';
		_auth0 = new Auth0(
			env.AUTH0_DOMAIN ?? '',
			env.AUTH0_CLIENT_ID ?? '',
			env.AUTH0_CLIENT_SECRET ?? '',
			`${baseUrl}/auth/callback/auth0`
		);
	}
	return _auth0;
}

// ─── Optional: Google OAuth ───
// import { Google } from 'arctic';
//
// export const google = new Google(
//   process.env.GOOGLE_CLIENT_ID ?? '',
//   process.env.GOOGLE_CLIENT_SECRET ?? '',
//   `${baseUrl}/auth/callback/google`
// );
