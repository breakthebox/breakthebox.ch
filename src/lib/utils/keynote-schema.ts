// ═══════════════════════════════════════════════════════════
// Keynote-Termine → Event-JSON-LD
// ═══════════════════════════════════════════════════════════
// Wird von der Startseite und von /keynotes verwendet — die @id-Fragmente sind
// identisch, damit beide Seiten dieselbe Entität beschreiben.

import { buildEvent, type Event } from '$lib/utils/schema';
import { renderMarkdownBlock } from '$lib/utils/markdown';
import type { KeynoteItem } from '$lib/types/content';

/** Relative Pfade absolut machen — Structured Data verlangt absolute URLs. */
function absUrl(siteUrl: string, u: string | undefined): string | undefined {
	if (!u) return undefined;
	return /^https?:\/\//.test(u) ? u : siteUrl + (u.startsWith('/') ? '' : '/') + u;
}

/** Markdown zu Klartext — keine Syntax und keine Tags in Structured Data. */
export function mdToPlain(md: string | undefined): string | undefined {
	if (!md?.trim()) return undefined;
	const text = renderMarkdownBlock(md)
		.replace(/<li>/g, '• ')
		.replace(/<\/(p|li|h[1-6])>/g, ' ')
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
	return text || undefined;
}

/** Event-Knoten für jeden Auftritt mit gültigem Datum. */
export function buildKeynoteEvents(siteUrl: string, items: KeynoteItem[]): Event[] {
	return items
		.filter((k) => k.date?.trim())
		.map((k, i) =>
			buildEvent({
				siteUrl,
				id: `keynote-${i}`,
				name: k.title,
				startDate: k.date,
				endDate: k.endDate?.trim() || undefined,
				description: mdToPlain(k.desc),
				image: absUrl(siteUrl, k.image),
				url: absUrl(siteUrl, k.url),
				location: k.location?.trim() || undefined,
				organizer: k.event?.trim() || undefined
			})
		);
}
