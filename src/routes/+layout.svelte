<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { PUBLIC_LOCALES, DEFAULT_LOCALE, HREFLANG, localizedPath } from '$lib/config/locales';
	import { SITE_URL, SITE_NAME } from '$lib/config/site';
	import { buildSiteIdentity } from '$lib/config/site-identity';
	import {
		buildPerson,
		buildOrganization,
		buildAffiliations,
		buildWebSite,
		buildGraph
	} from '$lib/utils/schema';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { safeColor, mixHex, softFromPrimary } from '$lib/utils/color';
	import { resolveFonts, googleFontsUrl } from '$lib/config/fonts';
	import * as m from '$lib/paraglide/messages.js';
	import type { PageMeta } from '$lib/types/seo';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	// ─── Aktives Theme → globale CSS-Variablen (site-wide) ───
	// Farbwerte werden sanitisiert (nur Hex), damit @html keine CSS-Injection erlaubt.
	function hexToRgb(hex: string): string {
		const h = hex.replace('#', '');
		const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
		const n = parseInt(full, 16);
		if (Number.isNaN(n) || full.length !== 6) return '177, 30, 44';
		return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
	}
	let tc = $derived(data.theme?.colors);
	let primary = $derived(safeColor(tc?.primary, '#b11e2c'));
	let primaryDark = $derived(safeColor(tc?.primaryDark, '#8e1622'));
	let ink = $derived(safeColor(tc?.ink, '#2b1a1c'));
	let cream = $derived(safeColor(tc?.cream, '#fbf1ec'));
	let soft = $derived(safeColor(tc?.soft, softFromPrimary(primary)));
	// Fläche der dunklen Bänder. Leer = wie bisher aus Primär dunkel und Text
	// gemischt, damit bestehende Themes unverändert aussehen.
	let band = $derived(safeColor(tc?.band, mixHex(primaryDark, ink, 0.58)));
	let primaryRgb = $derived(hexToRgb(primary));
	// Schriften des aktiven Themes (Keys → Registry; unbekannt = Standard).
	let fonts = $derived(resolveFonts(data.theme?.fonts));
	let fontsHref = $derived(googleFontsUrl(data.theme?.fonts));
	// Form des aktiven Themes: 'edge' setzt alle Radien auf 0 und nimmt den
	// Karten-Schatten weg (Editorial-Look). Das Backoffice hebt das wieder auf.
	let edge = $derived(data.theme?.shape === 'edge');
	let shapeCss = $derived(edge ? `--round:0;--shadow-card:none;--shadow-card-hover:none;` : '');
	// ─── Web-Analyse (Umami Cloud, cookielos) ───
	// Nur aktiv, wenn PUBLIC_UMAMI_WEBSITE_ID gesetzt ist (in Production). Kein Consent nötig
	// (keine Cookies, keine personenbezogenen Daten). In Dev bleibt die Variable leer → aus.
	let umamiWebsiteId = $derived(env.PUBLIC_UMAMI_WEBSITE_ID);
	let umamiSrc = $derived(env.PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js');
	let themeCss = $derived(
		`:root:root:root{` +
			`--btb-steel:${primary};--btb-steel-hover:${primaryDark};` +
			`--btb-steel-light:${mixHex(primary, '#ffffff', 0.85)};` +
			`--btb-teal:${primary};--btb-teal-dark:${primaryDark};--color-info:${primary};` +
			`--btb-teal-light:${soft};` +
			`--btb-steel-subtle:rgba(${primaryRgb},0.12);--btb-teal-subtle:rgba(${primaryRgb},0.1);` +
			`--cat-steel:rgba(${primaryRgb},0.14);--cat-teal:rgba(${primaryRgb},0.1);` +
			`--bg-section-alt:${mixHex(cream, soft, 0.5)};--bg-elevated:${mixHex(cream, soft, 0.5)};` +
			`--border:${mixHex(soft, ink, 0.92)};` +
			`--text-secondary:${mixHex(ink, cream, 0.55)};--text-muted:${mixHex(ink, cream, 0.32)};` +
			`--ff-serif:${fonts.heading.family};--ff-ui:${fonts.body.family};--ff-sketch:${fonts.hand.family};` +
			`--ff-kicker:${fonts.kicker.family};` +
			// Palette für dunkle Bänder (invertierte Sektionen, Kontakt-Band):
			// tiefe Markenfarbe als Fläche, aufgehellte Primärfarbe als Akzent.
			`--inv-bg:${band};--inv-bg2:${mixHex(band, '#000000', 0.94)};` +
			// heller bzw. tiefer Ton für den leichten Verlauf über den Bändern
			`--inv-top:${mixHex(band, '#ffffff', 0.86)};--inv-deep:${mixHex(band, '#000000', 0.86)};` +
			`--inv-lum:${mixHex(primary, '#ffffff', 0.55)};--inv-tint:${mixHex(primary, '#ffffff', 0.32)};` +
			shapeCss +
			`--bg-page:${cream};--text-heading:${ink};--text-primary:${ink};}`
	);

	// ?v= bustet die Vorschau-Caches der Messenger/Social-Scraper bei Neugestaltung
	const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg?v=3`;

	const identity = buildSiteIdentity(SITE_URL);
	const baseGraph = buildGraph([
		buildPerson(identity),
		buildOrganization(identity),
		...buildAffiliations(identity),
		buildWebSite(identity)
	]);

	// Absolute URL for OG/Twitter images (LinkedIn & Co. require absolute URLs).
	function absoluteImage(src?: string | null): string {
		if (!src) return DEFAULT_OG_IMAGE;
		if (/^https?:\/\//i.test(src)) return src;
		return SITE_URL + (src.startsWith('/') ? src : `/${src}`);
	}

	// Per-page overrides come from the route's `load` as `meta`; otherwise site defaults.
	let meta = $derived(((page.data as { meta?: PageMeta })?.meta ?? {}) as PageMeta);
	let ogTitle = $derived(meta.ogTitle ?? meta.title ?? `${SITE_NAME} — ${identity.personName}`);
	let ogDescription = $derived(meta.description ?? m.hero_subline());
	let ogType = $derived(meta.type ?? 'website');
	let ogImage = $derived(absoluteImage(meta.image));

	// Strip any locale prefix from the current path before re-localizing.
	function stripLocalePrefix(pathname: string): string {
		const seg = pathname.split('/')[1];
		if (seg && seg.length === 2 && seg !== DEFAULT_LOCALE) {
			return pathname.slice(`/${seg}`.length) || '/';
		}
		return pathname;
	}

	let basePath = $derived(stripLocalePrefix(page.url.pathname));
	let canonical = $derived(SITE_URL + localizedPath(basePath, DEFAULT_LOCALE));
	let alternates = $derived(
		PUBLIC_LOCALES.map((loc) => ({
			hreflang: HREFLANG[loc] ?? loc,
			href: SITE_URL + localizedPath(basePath, loc)
		}))
	);
</script>

<svelte:head>
	<!-- Aktives Theme: globale Farb- und Font-Variablen (überschreibt app.css :root) -->
	{@html `<style id="btb-theme">${themeCss}</style>`}
	{#if umamiWebsiteId}
		<script defer src={umamiSrc} data-website-id={umamiWebsiteId}></script>
	{/if}
	{#if fontsHref}
		<link rel="stylesheet" href={fontsHref} />
	{/if}
	<!-- Nur wenn die Route `meta` liefert; Admin- und Auth-Seiten setzen ihren Titel lokal. -->
	{#if meta.title}
		<title>{meta.title}</title>
	{/if}
	{#if meta.description}
		<meta name="description" content={meta.description} />
	{/if}
	<link rel="canonical" href={canonical} />
	{#each alternates as alt}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={canonical} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content="de_CH" />
	<meta property="og:type" content={ogType} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={ogImage} />
	{#if ogType === 'article' && meta.article}
		{#if meta.article.publishedTime}
			<meta property="article:published_time" content={meta.article.publishedTime} />
		{/if}
		{#if meta.article.modifiedTime}
			<meta property="article:modified_time" content={meta.article.modifiedTime} />
		{/if}
		{#each meta.article.tags ?? [] as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
</svelte:head>

<JsonLd data={baseGraph} />

{@render children()}
