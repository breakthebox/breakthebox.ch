// ═══════════════════════════════════════════════════════════
// OAuth Providers — Auth0 (via Arctic)
// ═══════════════════════════════════════════════════════════
// Docs: https://arcticjs.dev/providers/auth0
// Add more providers as needed (Google, GitHub, etc.)

import { Auth0 } from 'arctic';

const baseUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:5173';

export const auth0 = new Auth0(
	process.env.AUTH0_DOMAIN ?? '',
	process.env.AUTH0_CLIENT_ID ?? '',
	process.env.AUTH0_CLIENT_SECRET ?? '',
	`${baseUrl}/auth/callback/auth0`
);

// ─── Optional: Google OAuth ───
// import { Google } from 'arctic';
//
// export const google = new Google(
//   process.env.GOOGLE_CLIENT_ID ?? '',
//   process.env.GOOGLE_CLIENT_SECRET ?? '',
//   `${baseUrl}/auth/callback/google`
// );
