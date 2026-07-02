// Per-page Open Graph / Twitter meta. Returned by a route's `load` as `meta`
// and rendered centrally in the root layout so each tag appears exactly once.
export interface PageMeta {
	/** og:title / twitter:title. Falls back to the site default. */
	title?: string;
	/** og:description / twitter:description. Falls back to the site default. */
	description?: string;
	/** og:image / twitter:image. Relative paths are resolved to absolute. Falls back to the default OG image. */
	image?: string | null;
	/** og:type. Defaults to 'website'. */
	type?: 'website' | 'article';
	/** Extra article:* tags (only relevant for og:type = 'article'). */
	article?: {
		publishedTime?: string;
		modifiedTime?: string;
		tags?: string[];
	};
}
