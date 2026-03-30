// ═══════════════════════════════════════════════════════════
// Database Schema — Drizzle ORM (PostgreSQL)
// ═══════════════════════════════════════════════════════════
// This is the SINGLE SOURCE OF TRUTH for the database schema.
// NEVER create SQL files manually — use `npm run db:generate`.

import { pgTable, pgEnum, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// ─── Enums ───
// <!-- ANPASSEN: Rollen für dein Projekt -->
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

// ─── Users ───
export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	avatarUrl: text('avatar_url'),
	role: userRoleEnum('role').notNull().default('user'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─── OAuth Accounts ───
export const oauthAccounts = pgTable('oauth_accounts', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	providerId: text('provider_id').notNull(),
	providerUserId: text('provider_user_id').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─── Sessions (Lucia) ───
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp('expires_at').notNull()
});

// <!-- ANPASSEN: Hier deine domain-spezifischen Tabellen hinzufügen -->
