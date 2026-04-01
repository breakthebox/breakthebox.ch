// ═══════════════════════════════════════════════════════════
// Content Queries — Read/Write site_content table
// ═══════════════════════════════════════════════════════════

import { eq } from 'drizzle-orm';
import { db } from '../index';
import { siteContent } from '../schema';
import type { SectionKey, SectionContent } from '$lib/types/content';

/**
 * Get content for a section. Returns null if not yet stored in DB.
 */
export async function getSectionContent<T extends SectionContent>(
	section: SectionKey
): Promise<T | null> {
	const rows = await db
		.select()
		.from(siteContent)
		.where(eq(siteContent.section, section))
		.limit(1);

	if (rows.length === 0) return null;
	return rows[0].data as T;
}

/**
 * Save content for a section (upsert).
 */
export async function saveSectionContent(
	section: SectionKey,
	data: SectionContent,
	userId?: string
): Promise<void> {
	const existing = await db
		.select({ id: siteContent.id })
		.from(siteContent)
		.where(eq(siteContent.section, section))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(siteContent)
			.set({
				data,
				updatedAt: new Date(),
				updatedBy: userId ?? null
			})
			.where(eq(siteContent.section, section));
	} else {
		await db.insert(siteContent).values({
			section,
			data,
			updatedBy: userId ?? null
		});
	}
}

/**
 * Get all sections' content at once (for public page).
 */
export async function getAllContent(): Promise<Record<string, SectionContent>> {
	const rows = await db.select().from(siteContent);
	const result: Record<string, SectionContent> = {};
	for (const row of rows) {
		result[row.section] = row.data as SectionContent;
	}
	return result;
}
