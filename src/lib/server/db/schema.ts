// ═══════════════════════════════════════════════════════════
// Database Schema — Drizzle ORM (PostgreSQL)
// ═══════════════════════════════════════════════════════════
// This is the SINGLE SOURCE OF TRUTH for the database schema.
// NEVER create SQL files manually — use `npm run db:generate`.

import { pgTable, pgEnum, text, timestamp, uuid, jsonb, integer, boolean } from 'drizzle-orm/pg-core';

// ─── Enums ───
// <!-- ANPASSEN: Rollen für dein Projekt -->
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);
export const blogPostStatusEnum = pgEnum('blog_post_status', ['draft', 'published', 'scheduled']);

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

// ─── Site Content (CMS) ───
// Flexible JSON-based content storage per section.
// Each section (pillars, about, walkthetalk, references, blog)
// stores its content as a JSONB column.
export const siteContent = pgTable('site_content', {
	id: uuid('id').defaultRandom().primaryKey(),
	section: text('section').notNull().unique(),
	data: jsonb('data').notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	updatedBy: uuid('updated_by').references(() => users.id)
});

// ─── Blog Posts ───
export const blogPosts = pgTable('blog_posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content').notNull().default(''),
	excerpt: text('excerpt'),
	headerImage: text('header_image'),
	tags: text('tags').array().notNull().default([]),
	status: blogPostStatusEnum('status').notNull().default('draft'),
	publishDate: timestamp('publish_date'),
	metaTitle: text('meta_title'),
	metaDescription: text('meta_description'),
	ogImage: text('og_image'),
	authorId: uuid('author_id').references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─── Reference Logos ───
// Client/partner logos with optional image uploads.
export const referenceLogos = pgTable('reference_logos', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	logoUrl: text('logo_url'),
	websiteUrl: text('website_url'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
