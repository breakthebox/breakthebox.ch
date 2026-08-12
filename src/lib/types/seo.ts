// Per-Page-Meta. Wird vom `load` einer Route als `meta` zurückgegeben und
// zentral im Root-Layout gerendert, damit jeder Tag genau einmal vorkommt.
//
// Konvention: Öffentliche Routen liefern IMMER `title` und `description`.
// Das Layout rendert `<title>`/`<meta name="description">` nur, wenn gesetzt —
// so behalten Admin- und Auth-Seiten ihren lokalen `<svelte:head>`-Titel,
// ohne dass zwei `<title>`-Elemente entstehen.
export interface PageMeta {
	/** Vollständiger `<title>` inklusive Suffix — via `pageTitle()` aus `$lib/config/site`. */
	title?: string;
	/** Abweichender og:title / twitter:title. Default: `title`. */
	ogTitle?: string;
	/** meta description, og:description und twitter:description. */
	description?: string;
	/** og:image / twitter:image. Relative Pfade werden absolut aufgelöst. Default: Site-OG-Bild. */
	image?: string | null;
	/** og:type. Default: 'website'. */
	type?: 'website' | 'article';
	/** Zusätzliche article:*-Tags (nur bei og:type = 'article'). */
	article?: {
		publishedTime?: string;
		modifiedTime?: string;
		tags?: string[];
	};
}
