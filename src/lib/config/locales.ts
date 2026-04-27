// ═══════════════════════════════════════════════════════════
// Public Locale Config — SEO / hreflang / sitemap
// ═══════════════════════════════════════════════════════════
// Single source of truth for which locales are publicly exposed.
// Independent of Paraglide's runtime `locales` so we can stage rollouts:
// translations can land before they're announced to crawlers.
//
// To enable English publicly:
//   1. Translate messages/en.json (every key)
//   2. Add 'en' to project.inlang/settings.json -> locales
//   3. Switch Paraglide to URL strategy (path prefix /en/...) in
//      project.inlang/settings.json + svelte.config.js
//   4. Add 'en' to PUBLIC_LOCALES below
//   5. Confirm `localizedPath('/blog', 'en')` === '/en/blog' resolves

export const DEFAULT_LOCALE = 'de' as const;

/**
 * Locales advertised to search engines via hreflang + sitemap.
 * Extend when a locale is fully translated AND its URL routing works.
 */
export const PUBLIC_LOCALES = ['de'] as const;

export type PublicLocale = (typeof PUBLIC_LOCALES)[number];

/**
 * BCP 47 hreflang values per locale.
 * Use region-specific tags only when content actually differs by region.
 */
export const HREFLANG: Record<string, string> = {
	de: 'de-CH',
	en: 'en',
	fr: 'fr'
};

/**
 * Build the canonical pathname for a given locale.
 * Default locale is served at root; others get a path prefix (/en/..., /fr/...).
 * Mirrors what Paraglide's URL strategy will produce once enabled.
 */
export function localizedPath(pathname: string, locale: string): string {
	const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
	if (locale === DEFAULT_LOCALE) return clean;
	if (clean === '/') return `/${locale}`;
	return `/${locale}${clean}`;
}
