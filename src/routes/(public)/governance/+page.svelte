<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { renderMarkdown } from '$lib/utils/markdown';
	import SiteNav from '$lib/components/ui/SiteNav.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import FaqList from '$lib/components/ui/FaqList.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { buildFaqPage } from '$lib/utils/schema';
	import type { GovernanceContent } from '$lib/types/content';

	let { data } = $props();
	const c: GovernanceContent = data.content;

	// FAQ als strukturierte Daten (GEO/SEO) — kanonische deutsche URL.
	const SITE_URL = (env.PUBLIC_APP_URL || 'https://breakthebox.ch').replace(/\/$/, '');
	const faqJsonLd = buildFaqPage(SITE_URL + '/governance', c.faq.items);

	const home = localizeHref('/');
	const navLinks = [
		{ href: `${home}#angebot`, label: m.nav_services() },
		{ href: `${home}#about`, label: m.nav_about() },
		{ href: localizeHref('/impulse'), label: m.nav_blog() }
	];
</script>

<svelte:head>
	<title>Governance — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Digitale Urteilskraft dauerhaft im Gremium: Brigitte Hulliger als Verwaltungsrätin — IT und KI auf der Wirkungsseite, Verantwortung nach OR 716a."
	/>
</svelte:head>

<JsonLd data={faqJsonLd} />

<div class="governance">
	<ScrollProgress />
	<SiteNav theme={data.theme} links={navLinks} subtitle="Governance" />

	<!-- ═══════ Hero ═══════ -->
	<header class="hero">
		<div class="wrap">
			<span class="kick">{c.hero.kicker}</span>
			<div class="hero-lead">
				<div class="hero-main">
					<h1 class="md">{@html renderMarkdown(c.hero.title)}</h1>
					<div class="hero-cta">
						<a class="btn" href="#dossier">{c.hero.ctaPrimary} →</a>
						<a class="btn ghost" href="#kontakt">{c.hero.ctaSecondary}</a>
					</div>
				</div>
				<div class="hero-side">
					<p class="sub md">{@html renderMarkdown(c.hero.subline)}</p>
				</div>
			</div>
		</div>
	</header>

	<!-- ═══════ Der leere Stuhl (Petrol) ═══════ -->
	<section class="chair">
		<div class="wrap">
			<span class="kick kick-light">{c.chair.kicker}</span>
			<p class="big md">{@html renderMarkdown(c.chair.big)}</p>
			<p class="chair-small">{c.chair.small}</p>
		</div>
	</section>

	<!-- ═══════ Was ich an den Tisch bringe ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.contributions.kicker}</span>
			<h2>{c.contributions.title}</h2>
			<p class="lead">{c.contributions.lead}</p>
			<div class="bring">
				{#each c.contributions.items as item}
					<div class="bcard">
						<div class="bcard-body">
							<h3>{item.title}</h3>
							<p>{item.text}</p>
						</div>
						<div class="bcard-ex">
							<span class="bcard-ex-k">{item.exampleLabel}</span>
							{#if item.url}
								<a href={item.url}>{item.example}</a>
							{:else}
								<span class="bcard-ex-t">{item.example}</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ Kompetenz-Matrix ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.matrix.kicker}</span>
			<h2>{c.matrix.title}</h2>
			<p class="lead">{c.matrix.lead}</p>
			<div class="matrix-grid">
				<div>
					{#each c.matrix.rows as row}
						<div class="mrow" class:hot={row.highlight}>
							<span class="mrow-lbl">
								{row.label}{#if row.highlight && row.note}<em class="mrow-note">— {row.note}</em>{/if}
							</span>
							<span class="cover" aria-label="Abdeckung {row.level} von 3">
								{#each Array(3) as _, i}
									<span class="pip" class:on={i < row.level}></span>
								{/each}
							</span>
						</div>
					{/each}
					<p class="matrix-note">{c.matrix.note}</p>
				</div>
				<div class="facts">
					{#each c.matrix.facts as fact}
						<div class="fact">
							<div class="fact-l">{fact.label}</div>
							<div class="fact-v">{fact.value}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════ Mandate ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.mandates.kicker}</span>
			<h2>{c.mandates.title}</h2>
			<p class="lead">{c.mandates.lead}</p>
			<div class="mandat">
				{#each c.mandates.items as mandate}
					<div class="mrow2" class:vrp={mandate.president}>
						<div class="mrow2-head">
							{#if mandate.logo}<img class="mrow2-logo" src={mandate.logo} alt="{mandate.org} Logo" loading="lazy" />{/if}
							{#if mandate.website}
								<a class="org" href={mandate.website} target="_blank" rel="noopener noreferrer">{mandate.org}</a>
							{:else}
								<span class="org">{mandate.org}</span>
							{/if}
						</div>
						<span class="role">{#if mandate.president}<span class="star" aria-hidden="true">★</span>{/if}{mandate.role}</span>
						<p>{mandate.desc}</p>
					</div>
				{/each}
			</div>
			<div class="principle">
				<p class="principle-title md">{@html renderMarkdown(c.mandates.principleTitle)}</p>
				<p class="principle-sub">{c.mandates.principleText}</p>
			</div>
		</div>
	</section>

	<!-- ═══════ Haltung ═══════ -->
	<section class="stance">
		<div class="wrap">
			<span class="kick">{c.stance.kicker}</span>
			<blockquote>{c.stance.quote}</blockquote>
			<cite>{c.stance.citeText} <a href={localizeHref(c.stance.citeUrl)}>{c.stance.citeLinkLabel}</a></cite>
		</div>
	</section>

	<!-- ═══════ CTA (zweigleisig) ═══════ -->
	<section class="block">
		<div class="wrap">
			<div class="cta2">
				<div class="ctacard dark" id="dossier">
					<h3>{c.cta.dark.title}</h3>
					<p>{c.cta.dark.text}</p>
					<a class="btn" href={c.cta.dark.dossierUrl} target="_blank" rel="noopener noreferrer">{c.cta.dark.ctaLabel}</a>
					<p class="cta-contact"><b>{c.cta.dark.email}</b> · {c.cta.dark.phone}</p>
				</div>
				<div class="ctacard light">
					<h3>{c.cta.light.title}</h3>
					<p>{c.cta.light.text}</p>
					<a class="btn" href={c.cta.light.ctaHref}>{c.cta.light.ctaLabel}</a>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════ FAQ ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">Häufige Fragen</span>
			<h2 class="faq-title">Kurz beantwortet</h2>
			<FaqList items={c.faq.items} />
		</div>
	</section>

	<!-- ═══════ Kontakt-Band (site-weit) ═══════ -->
	<ContactBand />

	<SiteFooter />
</div>

<style>
	/* ═══════════════════════════════════════════════════════════
	   Theme-Mapping — Prototyp-Palette → aktive Theme-Variablen
	   (dieselben Werte wie /transformation, damit beide Seiten tragen).
	═══════════════════════════════════════════════════════════ */
	.governance {
		--gov-accent: var(--btb-steel);
		--gov-accent-strong: var(--btb-steel-hover);
		--gov-accent-soft: var(--btb-teal-light);
		--gov-ink: var(--text-heading);
		--gov-paper: var(--bg-page);
		--gov-surface: var(--bg-surface);
		--gov-line: var(--border);
		--gov-muted: var(--text-muted);
		--gov-graphite: var(--text-secondary);

		background: var(--bg-page);
		color: var(--text-primary);
		min-height: 100vh;
	}
	.wrap {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 24px;
	}
	.md :global(strong) {
		color: var(--gov-accent-strong);
		font-weight: 700;
	}
	.md :global(em) {
		color: var(--gov-accent-strong);
		font-style: normal;
	}

	/* ─── Section-Grundlagen ─── */
	.block {
		padding: 60px 0;
		border-bottom: 1px solid var(--gov-line);
	}
	h2 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: clamp(1.5rem, 3.4vw, 2rem);
		color: var(--text-heading);
		margin-bottom: 8px;
	}
	.faq-title {
		margin-bottom: 18px;
	}
	.kick {
		display: block;
		font-family: var(--ff-ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--gov-accent);
		margin-bottom: 16px;
	}
	.lead {
		color: var(--gov-graphite);
		font-size: 0.97rem;
		line-height: 1.7;
		max-width: 62ch;
		margin-bottom: 30px;
	}

	/* ─── Hero ─── */
	.hero {
		padding: 72px 0 56px;
		border-bottom: 1px solid var(--gov-line);
	}
	.hero-lead {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 44px;
		align-items: center;
	}
	.hero h1 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: clamp(1.9rem, 4.9vw, 3rem);
		line-height: 1.12;
		max-width: 22ch;
		color: var(--text-heading);
	}
	.hero-side {
		padding-left: 20px;
		border-left: 3px solid var(--gov-accent);
	}
	.hero .sub {
		color: var(--gov-graphite);
		font-size: 1.02rem;
		line-height: 1.6;
		max-width: 46ch;
		margin: 0;
	}
	.hero-cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.btn {
		display: inline-block;
		background: var(--gov-accent);
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.92rem;
		padding: 14px 28px;
		border-radius: var(--radius-md);
		transition: transform 0.15s, background 0.15s;
	}
	.btn:hover {
		transform: translateY(-2px);
		background: var(--gov-accent-strong);
	}
	.btn.ghost {
		background: transparent;
		border: 1.5px solid var(--gov-accent);
		color: var(--gov-accent-strong);
	}
	.btn.ghost:hover {
		background: var(--btb-steel-subtle);
	}

	/* ─── Der leere Stuhl (Petrol — wie «Was am Ende steht») ─── */
	.chair {
		padding: 60px 0;
		background: radial-gradient(
			120% 130% at 82% 0%,
			color-mix(in srgb, var(--gov-accent) 68%, #d9f2f0) 0%,
			var(--gov-accent) 58%,
			var(--gov-accent-strong) 118%
		);
		color: #fff;
	}
	.kick-light {
		color: rgba(255, 255, 255, 0.82);
	}
	.big {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(1.15rem, 2.8vw, 1.5rem);
		line-height: 1.45;
		max-width: 44ch;
		color: #fff;
	}
	.big :global(em) {
		color: #fff;
		font-style: italic;
	}
	.chair-small {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.88rem;
		line-height: 1.6;
		max-width: 60ch;
		margin-top: 14px;
	}

	/* ─── Beiträge (Akzent-Top-Bar-Karten) ─── */
	.bring {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.bcard {
		display: flex;
		flex-direction: column;
		background: var(--gov-surface);
		border: 1px solid var(--gov-line);
		border-top: 3px solid var(--gov-accent);
		border-radius: 4px 4px 16px 16px;
		overflow: hidden;
		box-shadow: var(--shadow-card);
	}
	.bcard-body {
		padding: 24px 24px 18px;
	}
	.bcard h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--text-heading);
		margin-bottom: 8px;
	}
	.bcard p {
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--gov-graphite);
	}
	.bcard-ex {
		margin-top: auto;
		background: var(--btb-steel-subtle);
		border-top: 1px solid color-mix(in srgb, var(--gov-accent) 16%, transparent);
		padding: 16px 24px 18px;
	}
	.bcard-ex-k {
		display: block;
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gov-muted);
		margin-bottom: 4px;
	}
	.bcard-ex-t {
		font-size: 0.84rem;
		line-height: 1.5;
		color: var(--gov-graphite);
	}
	.bcard-ex a {
		font-size: 0.84rem;
		line-height: 1.5;
		color: var(--gov-accent-strong);
		font-weight: 600;
		text-decoration: none;
	}
	.bcard-ex a:hover {
		text-decoration: underline;
	}

	/* ─── Kompetenz-Matrix ─── */
	.matrix-grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 34px;
		align-items: start;
	}
	.mrow {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 12px;
		align-items: center;
		padding: 10px 14px;
		border-bottom: 1px solid var(--gov-line);
		font-size: 0.9rem;
		color: var(--text-primary);
	}
	.mrow.hot {
		background: var(--gov-surface);
		border: 1px solid var(--gov-accent);
		border-radius: 10px;
		font-weight: 600;
		margin-bottom: 2px;
	}
	.mrow-note {
		margin-left: 6px;
		font-family: var(--ff-serif);
		font-style: italic;
		font-weight: 500;
		color: var(--gov-accent-strong);
		font-size: 0.82rem;
	}
	.cover {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}
	.pip {
		width: 22px;
		height: 8px;
		border-radius: 100px;
		background: var(--gov-line);
	}
	.pip.on {
		background: var(--gov-accent);
	}
	.matrix-note {
		font-size: 0.78rem;
		color: var(--gov-muted);
		margin-top: 14px;
		padding: 0 14px;
		line-height: 1.5;
	}
	.facts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.fact {
		border: 1px solid var(--gov-line);
		border-radius: 12px;
		background: var(--gov-surface);
		padding: 14px 16px;
		box-shadow: var(--shadow-card);
	}
	.fact-l {
		font-size: 0.6rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gov-muted);
	}
	.fact-v {
		font-size: 0.86rem;
		font-weight: 600;
		color: var(--text-heading);
		margin-top: 4px;
	}

	/* ─── Mandate ─── */
	.mandat {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		margin-bottom: 26px;
	}
	.mrow2 {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 18px;
		background: var(--gov-surface);
		border: 1px solid var(--gov-line);
		border-radius: 13px;
		padding: 16px 20px;
		flex-wrap: wrap;
		box-shadow: var(--shadow-card);
	}
	.mrow2.vrp {
		border-left: 3px solid var(--gov-accent);
	}
	.mrow2-head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.mrow2-logo {
		height: 28px;
		width: auto;
		max-width: 88px;
		object-fit: contain;
		flex-shrink: 0;
	}
	.mrow2 .org {
		font-weight: 700;
		font-size: 1rem;
		color: var(--text-heading);
		text-decoration: none;
	}
	a.org:hover {
		color: var(--gov-accent-strong);
	}
	.mrow2 .role {
		font-family: var(--ff-ui);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gov-accent-strong);
	}
	.mrow2 .star {
		margin-right: 5px;
	}
	.mrow2 p {
		flex-basis: 100%;
		font-size: 0.85rem;
		color: var(--gov-graphite);
		margin-top: 2px;
	}
	.principle {
		border-left: 3px solid var(--gov-accent);
		background: var(--bg-section-alt);
		border-radius: 0 14px 14px 0;
		padding: 22px 26px;
	}
	.principle-title {
		font-family: var(--ff-serif);
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.5;
		max-width: 56ch;
		color: var(--text-heading);
	}
	.principle-sub {
		font-family: var(--ff-ui);
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--gov-graphite);
		margin-top: 10px;
		line-height: 1.65;
		max-width: 62ch;
	}

	/* ─── Haltung ─── */
	.stance {
		padding: 60px 0;
		background: var(--bg-section-alt);
		border-bottom: 1px solid var(--gov-line);
	}
	.stance blockquote {
		font-family: var(--ff-serif);
		font-style: italic;
		font-weight: 600;
		font-size: clamp(1.2rem, 2.8vw, 1.6rem);
		line-height: 1.4;
		max-width: 38ch;
		color: var(--text-heading);
	}
	.stance cite {
		display: block;
		font-family: var(--ff-ui);
		font-style: normal;
		font-size: 0.85rem;
		color: var(--gov-graphite);
		margin-top: 12px;
	}
	.stance cite a {
		color: var(--gov-accent-strong);
		font-weight: 600;
		text-decoration: none;
	}

	/* ─── CTA (zweigleisig) ─── */
	.cta2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.ctacard {
		border-radius: 16px;
		padding: 30px 32px;
	}
	.ctacard.dark {
		background: radial-gradient(
			120% 130% at 18% 0%,
			color-mix(in srgb, var(--gov-ink) 74%, #6b7280) 0%,
			var(--gov-ink) 60%,
			#14090b 118%
		);
		color: #fff;
		box-shadow: 0 26px 54px -36px rgba(10, 8, 8, 0.45);
	}
	.ctacard.light {
		background: var(--gov-surface);
		border: 1px solid var(--gov-line);
		box-shadow: var(--shadow-card);
	}
	.ctacard h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.25rem;
		margin-bottom: 6px;
	}
	.ctacard.dark h3 {
		color: #fff;
	}
	.ctacard.light h3 {
		color: var(--text-heading);
	}
	.ctacard p {
		font-size: 0.88rem;
		line-height: 1.6;
		margin-bottom: 18px;
	}
	.ctacard.dark p {
		color: rgba(255, 255, 255, 0.78);
	}
	.ctacard.light p {
		color: var(--gov-graphite);
	}
	.cta-contact {
		font-family: var(--ff-ui);
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.72);
		margin-top: 14px !important;
		margin-bottom: 0 !important;
	}
	.cta-contact b {
		color: #fff;
		font-weight: 500;
	}

	/* ─── Responsive ─── */
	@media (max-width: 860px) {
		.hero-lead {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.hero-side {
			border-left: none;
			padding-left: 0;
		}
		.hero .sub {
			max-width: 56ch;
		}
		.matrix-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
	@media (max-width: 760px) {
		.bring,
		.cta2 {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.wrap {
			padding: 0 18px;
		}
		.facts {
			grid-template-columns: 1fr;
		}
	}
</style>
