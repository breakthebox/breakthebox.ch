// ═══════════════════════════════════════════════════════════
// Shared OAuth Callback Handler
// ═══════════════════════════════════════════════════════════
// Handles user creation/linking after OAuth provider returns.
// Used by all OAuth callback routes (Auth0, Google, etc.)

import { eq } from 'drizzle-orm';
import type { CookieAttributes } from 'lucia';
import { lucia } from '$lib/server/auth/lucia';
import { db } from '$lib/server/db';
import { users, oauthAccounts } from '$lib/server/db/schema';

interface OAuthUserInfo {
	providerId: string;
	providerUserId: string;
	email: string;
	name: string;
	picture?: string | null;
}

export type OAuthCallbackResult =
	| { success: true; sessionCookie: { name: string; value: string; attributes: CookieAttributes } }
	| { success: false; error: 'email_exists' };

export async function handleOAuthCallback(userInfo: OAuthUserInfo): Promise<OAuthCallbackResult> {
	const { providerId, providerUserId, email, name, picture } = userInfo;

	// Check if OAuth account already exists
	const existingAccount = await db
		.select()
		.from(oauthAccounts)
		.where(eq(oauthAccounts.providerUserId, providerUserId))
		.limit(1);

	let userId: string;

	if (existingAccount.length > 0) {
		// Returning user — update profile info
		userId = existingAccount[0].userId;
		await db
			.update(users)
			.set({ name, avatarUrl: picture ?? null, updatedAt: new Date() })
			.where(eq(users.id, userId));
	} else {
		// Check if user with this email already exists
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			// Email exists but from different provider — security risk, don't auto-link
			return { success: false, error: 'email_exists' };
		}

		// New user — create account
		const newUser = await db
			.insert(users)
			.values({ email, name, avatarUrl: picture ?? null })
			.returning({ id: users.id });

		userId = newUser[0].id;

		// Link OAuth account
		await db.insert(oauthAccounts).values({
			providerId,
			providerUserId,
			userId
		});
	}

	// Create session
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	return {
		success: true,
		sessionCookie: {
			name: sessionCookie.name,
			value: sessionCookie.value,
			attributes: sessionCookie.attributes
		}
	};
}
