<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { PUBLIC_LOCALES, DEFAULT_LOCALE, HREFLANG, localizedPath } from '$lib/config/locales';
	import { buildSiteIdentity } from '$lib/config/site-identity';
	import { buildPerson, buildOrganization, buildWebSite, buildGraph } from '$lib/utils/schema';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const SITE_URL = (env.PUBLIC_APP_URL || 'https://breakthebox.ch').replace(/\/$/, '');
	const SITE_NAME = 'Break the Box';
	const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.webp`;

	const identity = buildSiteIdentity(SITE_URL);
	const baseGraph = buildGraph([
		buildPerson(identity),
		buildOrganization(identity),
		buildWebSite(identity)
	]);

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
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
</svelte:head>

<JsonLd data={baseGraph} />

{@render children()}
