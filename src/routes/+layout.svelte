<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { PUBLIC_LOCALES, DEFAULT_LOCALE, HREFLANG, localizedPath } from '$lib/config/locales';
	import { buildSiteIdentity } from '$lib/config/site-identity';
	import { buildPerson, buildOrganization, buildWebSite, buildGraph } from '$lib/utils/schema';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { PageMeta } from '$lib/types/seo';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const SITE_URL = (env.PUBLIC_APP_URL || 'https://breakthebox.ch').replace(/\/$/, '');
	const SITE_NAME = 'Break the Box';
	const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

	const identity = buildSiteIdentity(SITE_URL);
	const baseGraph = buildGraph([
		buildPerson(identity),
		buildOrganization(identity),
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
	let ogTitle = $derived(meta.title ?? `${SITE_NAME} — ${identity.personName}`);
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
