/**
 * Generate a URL-safe slug from a title string.
 * Handles German umlauts and special characters.
 */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ss/g, 'ss')
		.replace(/é|è|ê|ë/g, 'e')
		.replace(/à|â/g, 'a')
		.replace(/ç/g, 'c')
		.replace(/î|ï/g, 'i')
		.replace(/ô/g, 'o')
		.replace(/û|ù/g, 'u')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');
}
