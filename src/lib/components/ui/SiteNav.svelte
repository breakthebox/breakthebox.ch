<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { safeColor, mixHex, isDarkColor } from '$lib/utils/color';
	import type { Theme } from '$lib/types/content';

	// Site-weite Navigation — identisch auf Startseite und Unterseiten.
	// Farben werden aus dem aktiven Theme abgeleitet (Fläche = Header-Farbe,
	// Text nach Kontrast), damit die Komponente in jedem Kontext trägt.
	interface NavLink {
		href: string;
		label: string;
		active?: boolean;
	}
	let {
		theme,
		links = [],
		ctaHref = '#kontakt',
		ctaLabel,
		subtitle = 'Break the Box'
	}: {
		theme?: Theme | null;
		links?: NavLink[];
		ctaHref?: string;
		ctaLabel?: string;
		subtitle?: string;
	} = $props();

	let menuOpen = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		function onScroll() {
			scrolled = window.scrollY > 20;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	const cHeader = safeColor(theme?.colors?.header ?? theme?.colors?.cream, '#fbf1ec');
	const cInk = safeColor(theme?.colors?.ink, '#2b1a1c');
	const cPrimary = safeColor(theme?.colors?.primary, '#b11e2c');
	const cSoft = safeColor(theme?.colors?.soft, '#f6d9d5');
	const headerDark = isDarkColor(cHeader);

	const navStyle =
		`--navbg:${cHeader};` +
		`--navtext:${headerDark ? '#ffffff' : cInk};` +
		`--navaccent:${headerDark ? mixHex(cHeader, '#ffffff', 0.3) : cPrimary};` +
		`--navline:${headerDark ? mixHex(cHeader, '#ffffff', 0.82) : mixHex(cSoft, cInk, 0.92)};`;

	const cta = $derived(ctaLabel ?? m.h_nav_cta());
	const home = localizeHref('/');
</script>

<nav class="nav" class:scrolled style={navStyle}>
	<div class="nav-inner">
		<a href={home} class="brand">
			<img src="/box.svg" alt="" class="brand-cube" width="34" height="34" />
			<span class="brand-txt">
				<span class="brand-m">Brigitte Hulliger</span>
				<span class="brand-c">{subtitle}</span>
			</span>
		</a>
		<div class="nav-links">
			{#each links as l}
				<a href={l.href} class:active={l.active}>{l.label}</a>
			{/each}
		</div>
		<a class="btn solid nav-cta" href={ctaHref}>{cta}</a>
		<button
			type="button"
			class="nav-burger"
			aria-label={menuOpen ? 'Menü schliessen' : 'Menü öffnen'}
			aria-expanded={menuOpen}
			aria-controls="site-nav-mobile"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{#if menuOpen}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
			{/if}
		</button>
	</div>
	{#if menuOpen}
		<div class="nav-mobile" id="site-nav-mobile">
			{#each links as l}
				<a href={l.href} onclick={() => (menuOpen = false)}>{l.label}</a>
			{/each}
			<a class="btn solid" href={ctaHref} onclick={() => (menuOpen = false)}>{cta}</a>
		</div>
	{/if}
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: color-mix(in srgb, var(--navbg) 90%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--navline);
		color: var(--navtext);
		transition: box-shadow 0.3s ease;
	}
	.nav.scrolled {
		box-shadow: 0 1px 10px rgba(120, 20, 40, 0.06);
	}
	.nav-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 18px 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}
	.brand {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 11px;
		text-decoration: none;
		color: var(--navtext);
	}
	.brand-cube {
		width: 34px;
		height: auto;
		flex-shrink: 0;
	}
	.brand-txt {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
	}
	.brand-m {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.01em;
	}
	.brand-c {
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--navaccent);
		margin-top: 3px;
	}
	.nav-links {
		display: flex;
		gap: 34px;
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-left: auto;
		margin-right: 8px;
	}
	.nav-links a {
		color: var(--navtext);
		opacity: 0.7;
		text-decoration: none;
		transition: opacity 0.2s, color 0.2s;
	}
	.nav-links a:hover,
	.nav-links a.active {
		opacity: 1;
		color: var(--navaccent);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.04em;
		padding: 14px 26px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		text-transform: uppercase;
		text-decoration: none;
	}
	.btn.solid {
		background: var(--btb-steel);
		color: #fff;
	}
	.btn.solid:hover {
		background: var(--btb-steel-hover);
	}
	.nav-cta {
		flex-shrink: 0;
	}
	/* Burger + Mobile-Menü (Desktop: versteckt) */
	.nav-burger {
		display: none;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: var(--navtext);
		cursor: pointer;
		padding: 0;
	}
	.nav-burger svg {
		width: 26px;
		height: 26px;
	}
	.nav-mobile {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		padding: 6px 22px 20px;
		border-top: 1px solid var(--navline);
	}
	.nav-mobile a {
		display: block;
		padding: 12px 0;
		font-size: 15px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--navtext);
		text-decoration: none;
	}
	.nav-mobile a.btn {
		margin-top: 8px;
		padding: 14px 26px;
		color: #fff;
	}
	@media (max-width: 980px) {
		.nav-links {
			display: none;
		}
		.nav-cta {
			display: none;
		}
		.nav-burger {
			display: flex;
			margin-left: auto;
		}
	}
</style>
