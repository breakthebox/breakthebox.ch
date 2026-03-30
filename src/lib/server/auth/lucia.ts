// ═══════════════════════════════════════════════════════════
// Lucia v3 — Auth Setup (Drizzle PostgreSQL Adapter)
// ═══════════════════════════════════════════════════════════
// Docs: https://lucia-auth.com/
// Adapter: https://lucia-auth.com/database/drizzle

import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import { sessions, users } from '$lib/server/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			name: attributes.name,
			role: attributes.role,
			avatarUrl: attributes.avatarUrl
		};
	}
});

// ─── Type Augmentation ───
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	name: string;
	role: string; // <!-- ANPASSEN: Union-Type mit deinen Rollen -->
	avatarUrl: string | null;
}
