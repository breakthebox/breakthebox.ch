<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { renderMarkdown } from '$lib/utils/markdown';
	import SiteNav from '$lib/components/ui/SiteNav.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import FaqList from '$lib/components/ui/FaqList.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import type { TransformationContent } from '$lib/types/content';

	let { data } = $props();
	const c: TransformationContent = data.content;

	// Nav-Links zeigen auf die Startseiten-Sektionen (Unterseite).
	const home = localizeHref('/');
	const navLinks = [
		{ href: `${home}#angebot`, label: m.nav_services() },
		{ href: `${home}#about`, label: m.nav_about() },
		{ href: localizeHref('/impulse'), label: m.nav_blog() }
	];

	// UTM-Ankunft aus der Simulation: personalisiert Banner + Kontakt-CTA.
	let mg = $derived(page.url.searchParams.get('utm_source') === c.banner.utmSource);
	let bannerDismissed = $state(false);
</script>

<svelte:head>
	<title>Transformation — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Transformation, die trägt — IT-, Digital- und KI-Strategie in Stufen, die einzeln bestehen. Für Geschäftsleitungen und Verwaltungsräte."
	/>
</svelte:head>

<div class="tf">
	<ScrollProgress />

	{#if mg && !bannerDismissed}
		<div class="mg-banner">
			<div class="wrap">
				<span class="md">{@html renderMarkdown(c.banner.text)}</span>
				<a class="mg-cta" href={c.banner.ctaHref}>{c.banner.ctaLabel} →</a>
				<button class="mg-close" onclick={() => (bannerDismissed = true)} aria-label="Schliessen">×</button>
			</div>
		</div>
	{/if}

	<SiteNav theme={data.theme} links={navLinks} subtitle="Transformation" />

	<!-- ═══════ Hero ═══════ -->
	<header class="hero">
		<div class="wrap">
			<span class="kick">{c.hero.kicker}</span>
			<div class="hero-lead">
				<div class="hero-main">
					<h1 class="md">{@html renderMarkdown(c.hero.title)}</h1>
					<div class="hero-cta">
						<a class="btn" href="#stufen">{c.hero.ctaPrimary} →</a>
						<a class="btn ghost" href="#kontakt">{c.hero.ctaSecondary}</a>
					</div>
				</div>
				<div class="hero-side">
					<p class="sub">{c.hero.subline}</p>
				</div>
			</div>
		</div>
	</header>

	<!-- ═══════ Spiegel ═══════ -->
	<section class="mirror">
		<div class="wrap">
			<span class="kick">{c.mirror.kicker}</span>
			<h2>{c.mirror.title}</h2>
			<p class="lead">{c.mirror.lead}</p>
			<div class="sits">
				{#each c.mirror.situations as sit}
					<div class="sit">
						<p class="q">{sit.quote}</p>
						<p class="a md">{@html renderMarkdown(sit.answer)}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ Treppe ═══════ -->
	<section id="stufen" class="block">
		<div class="wrap">
			<span class="kick">{c.steps.kicker}</span>
			<h2>{c.steps.title}</h2>
			<p class="claimline md">{@html renderMarkdown(c.steps.claim)}</p>

			<div class="steps-grid">
				{#each c.steps.items as step, i}
					<div class="scard" style="--i: {i}">
						<div class="scard-body">
							<div class="scard-head">
								<span class="scard-no">{step.no}</span>
								<span class="scard-badge">{step.durationTag}</span>
							</div>
							<h3>{step.title}</h3>
							<p class="scard-q">{step.question}</p>
							<p class="scard-desc">{step.description}</p>
							{#if step.tags?.length}
								<ul class="scard-list">
									{#each step.tags as tag}<li>{tag}</li>{/each}
								</ul>
							{/if}
						</div>
						<div class="scard-foot">
							<div class="scard-result">
								<span class="scard-k">Ergebnis</span>
								<span class="scard-result-v">{step.result}</span>
							</div>
							{#if step.duration}
								<p class="scard-dur"><span class="scard-k">Dauer</span>{step.duration}</p>
							{/if}
							{#if step.exit}
								<div class="scard-exit">
									<span class="scard-exit-k">Ausgang</span>
									<span class="scard-exit-t">{step.exit}</span>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ Wirkung ═══════ -->
	<section class="impact">
		<div class="wrap">
			<span class="kick kick-light">{c.impact.kicker}</span>
			<p class="big md">{@html renderMarkdown(c.impact.big)}</p>
			<p class="impact-small">{c.impact.small}</p>
		</div>
	</section>

	<!-- ═══════ Beweis ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.proof.kicker}</span>
			<h2>{c.proof.title}</h2>
			<p class="lead">{c.proof.lead}</p>

			<div class="case">
				<div class="cl">{c.proof.caseLabel}</div>
				{#each c.proof.caseRows as row}
					<div class="tlrow">
						<span class="m">{row.month}</span>
						<p class="md">
							{@html renderMarkdown(row.text)}{#if row.tag}<span class="tag">{row.tag}</span>{/if}
						</p>
					</div>
				{/each}
			</div>

			<div class="mgcard">
				<svg width="40" height="40" viewBox="0 0 26 26" fill="none" aria-hidden="true">
					<polygon points="13,2 23,7.5 23,18.5 13,24 3,18.5 3,7.5" stroke="currentColor" stroke-width="1.5" />
					<polygon points="13,8 18,10.8 18,15.2 13,18 8,15.2 8,10.8" fill="currentColor" />
				</svg>
				<div>
					<b>{c.proof.missgovern.title}</b>
					<span>{c.proof.missgovern.text}</span>
				</div>
				<a href={c.proof.missgovern.url || '#'}>{c.proof.missgovern.cta} →</a>
			</div>
		</div>
	</section>

	<!-- ═══════ Abgrenzung ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.boundaries.kicker}</span>
			<h2>{c.boundaries.title}</h2>
			<p class="lead">{c.boundaries.lead}</p>
			<div class="not">
				{#each c.boundaries.items as item}
					<div class="not-card">
						<span class="not-x" aria-hidden="true">✕</span>
						<h3 class="not-t">{item.title}</h3>
						<p class="not-d">{item.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ Erstgespräch + Box ═══════ -->
	<section class="block">
		<div class="wrap">
			<div class="first">
				<div>
					<span class="kick">{c.contact.kicker}</span>
					<h2>{c.contact.title}</h2>
					<p class="lead lead-tight">{c.contact.lead}</p>
					<div class="steps30">
						{#each c.contact.steps as s, i}
							<div class="s30"><span class="n">{i + 1}</span><span>{s}</span></div>
						{/each}
					</div>
				</div>
				<div class="ctabox" class:mg>
					{#if mg}
						<p class="mg-line md">★ {@html renderMarkdown(c.contact.box.mgLine)}</p>
					{/if}
					<h3>{c.contact.box.title}</h3>
					<p>{c.contact.box.text}</p>
					<a class="btn" href="mailto:info@breakthebox.ch">Lass uns reden →</a>
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

	<!-- ═══════ Kontakt-CTA (site-weit einheitlich, wie Landing) ═══════ -->
	<ContactBand />

	<SiteFooter />
</div>

<style>
	/* ═══════════════════════════════════════════════════════════
	   Theme-Mapping — Prototyp-Palette → aktive Theme-Variablen.
	   Zentral hier, damit die Seite in jedem Theme trägt.
	═══════════════════════════════════════════════════════════ */
	.tf {
		--tf-accent: var(--btb-steel);
		--tf-accent-strong: var(--btb-steel-hover);
		--tf-accent-soft: var(--btb-teal-light);
		--tf-ink: var(--text-heading);
		--tf-paper: var(--bg-page);
		--tf-surface: var(--bg-surface);
		--tf-line: var(--border);
		--tf-muted: var(--text-muted);
		--tf-graphite: var(--text-secondary);

		background: var(--bg-page);
		color: var(--text-primary);
		min-height: 100vh;
	}
	.wrap {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* Akzent-Auszeichnung aus Markdown (**fett** / *kursiv*) */
	.md :global(strong) {
		color: var(--tf-accent-strong);
		font-weight: 700;
	}
	.md :global(em) {
		color: var(--tf-accent-strong);
		font-style: normal;
	}

	/* ─── Section-Grundlagen ─── */
	/* Horizontale Trennlinien zwischen den Sektionen (wie auf der Startseite). */
	.block {
		padding: 64px 0;
		border-bottom: 1px solid var(--tf-line);
	}
	h2 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: clamp(1.5rem, 3.4vw, 2rem);
		color: var(--text-heading);
		margin-bottom: 8px;
	}
	.kick {
		display: block;
		font-family: var(--ff-ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--tf-accent);
		margin-bottom: 16px;
	}
	.lead {
		color: var(--tf-graphite);
		font-size: 0.97rem;
		line-height: 1.7;
		max-width: 62ch;
		margin-bottom: 32px;
	}
	.lead-tight {
		margin-bottom: 10px;
	}

	/* ─── MissGovern-Banner (UTM) ─── */
	.mg-banner {
		background: var(--tf-ink);
		color: var(--tf-paper);
		padding: 12px 0;
		font-size: 0.85rem;
	}
	.mg-banner .wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
	}
	.mg-banner .md :global(strong) {
		color: var(--tf-accent-soft);
	}
	.mg-cta {
		color: var(--tf-accent-soft);
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}
	.mg-close {
		background: none;
		border: none;
		color: var(--tf-muted);
		cursor: pointer;
		font-size: 1.1rem;
		line-height: 1;
	}

	/* ─── Hero (Titel links, Beschreibung rechts — wie Landing) ─── */
	.hero {
		padding: 72px 0 60px;
		border-bottom: 1px solid var(--tf-line);
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
		font-size: clamp(2.1rem, 5.6vw, 3.4rem);
		line-height: 1.08;
		max-width: 16ch;
		color: var(--text-heading);
	}
	.hero-side {
		padding-left: 20px;
		border-left: 3px solid var(--tf-accent);
	}
	.hero .sub {
		color: var(--tf-graphite);
		font-size: 1.02rem;
		line-height: 1.6;
		max-width: 42ch;
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
		background: var(--tf-accent);
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.95rem;
		padding: 15px 30px;
		border-radius: var(--radius-md);
		transition: transform 0.15s, background 0.15s;
	}
	.btn:hover {
		transform: translateY(-2px);
		background: var(--tf-accent-strong);
	}
	.btn.ghost {
		background: transparent;
		border: 1.5px solid var(--tf-accent);
		color: var(--tf-accent-strong);
	}
	.btn.ghost:hover {
		background: var(--btb-steel-subtle);
	}

	/* ─── Spiegel ─── */
	.mirror {
		padding: 64px 0;
		background: var(--bg-section-alt);
		border-bottom: 1px solid var(--tf-line);
	}
	.sits {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 14px;
	}
	.sit {
		background: var(--tf-surface);
		border: 1px solid var(--tf-line);
		border-radius: 14px;
		padding: 22px 24px;
	}
	.sit .q {
		font-family: var(--ff-serif);
		font-style: italic;
		font-weight: 500;
		font-size: 1.03rem;
		line-height: 1.45;
		color: var(--text-primary);
	}
	.sit .a {
		font-size: 0.82rem;
		color: var(--tf-graphite);
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px dashed var(--tf-line);
	}

	/* ─── Treppe ─── */
	.claimline {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(1.05rem, 2.6vw, 1.3rem);
		color: var(--text-heading);
		margin: 8px 0 34px;
		max-width: 44ch;
		line-height: 1.4;
	}
	/* Drei-Karten-Menü — scanbar, vergleichbar, Ausgang als Karten-Fuss */
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		align-items: stretch;
	}
	.scard {
		display: flex;
		flex-direction: column;
		background: var(--tf-surface);
		border: 1px solid var(--tf-line);
		/* Akzent-Leiste oben; nickt zur Treppe (dicker mit jeder Stufe) */
		border-top: calc(3px + var(--i) * 2px) solid var(--tf-accent);
		border-radius: 4px 4px 16px 16px;
		overflow: hidden;
		box-shadow: var(--shadow-card);
	}
	.scard-body {
		padding: 26px 26px 22px;
	}
	.scard-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}
	.scard-no {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 2.4rem;
		line-height: 1;
		color: var(--tf-accent);
	}
	.scard-badge {
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--tf-accent-strong);
		background: var(--btb-steel-subtle);
		border-radius: 100px;
		padding: 5px 12px;
		white-space: nowrap;
	}
	.scard h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.3rem;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.scard-q {
		font-family: var(--ff-serif);
		font-style: italic;
		font-size: 0.95rem;
		color: var(--tf-accent-strong);
		margin-bottom: 12px;
	}
	.scard-desc {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-primary);
	}
	.scard-list {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.scard-list li {
		position: relative;
		padding-left: 22px;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--tf-graphite);
	}
	.scard-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tf-accent);
		opacity: 0.5;
	}
	/* Eingefärbter Karten-Fuss (flush, keine Box-in-Box); sinkt nach unten */
	.scard-foot {
		margin-top: auto;
		background: var(--btb-steel-subtle);
		border-top: 1px solid color-mix(in srgb, var(--tf-accent) 16%, transparent);
		padding: 20px 26px 24px;
	}
	.scard-k {
		display: block;
		font-family: var(--ff-ui);
		font-size: 0.6rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--tf-muted);
		margin-bottom: 3px;
	}
	/* Ergebnis prominent (Serif) */
	.scard-result-v {
		display: block;
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 1.05rem;
		line-height: 1.3;
		color: var(--text-heading);
	}
	.scard-dur {
		margin-top: 12px;
		font-size: 0.82rem;
		color: var(--tf-graphite);
	}
	.scard-exit {
		margin-top: 18px;
	}
	.scard-exit-k {
		display: block;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--tf-accent-strong);
		margin-bottom: 5px;
	}
	.scard-exit-k::before {
		content: '→ ';
	}
	.scard-exit-t {
		display: block;
		font-size: 0.86rem;
		line-height: 1.5;
		color: var(--tf-accent-strong);
	}

	/* ─── Wirkung (Petrol — wie die Landing-Boxen) ─── */
	.impact {
		padding: 64px 0;
		background: radial-gradient(
			120% 130% at 82% 0%,
			color-mix(in srgb, var(--tf-accent) 68%, #d9f2f0) 0%,
			var(--tf-accent) 58%,
			var(--tf-accent-strong) 118%
		);
		color: #fff;
	}
	.kick-light {
		color: rgba(255, 255, 255, 0.82);
	}
	.big {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(1.2rem, 3vw, 1.6rem);
		line-height: 1.4;
		max-width: 38ch;
		color: #fff;
	}
	.big :global(em) {
		color: #fff;
		font-style: italic;
	}
	.impact-small {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.88rem;
		line-height: 1.6;
		max-width: 56ch;
		margin-top: 16px;
	}

	/* ─── Beweis ─── */
	.case {
		border-left: 3px solid var(--tf-accent);
		background: var(--tf-surface);
		border-radius: 0 16px 16px 0;
		padding: 26px 30px;
		margin-bottom: 18px;
	}
	.case .cl {
		font-family: var(--ff-ui);
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tf-muted);
		margin-bottom: 14px;
	}
	.tlrow {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 16px;
		padding: 9px 0;
		border-bottom: 1px dashed var(--tf-line);
		font-size: 0.88rem;
	}
	.tlrow:last-child {
		border-bottom: none;
	}
	.tlrow .m {
		font-family: var(--ff-ui);
		font-size: 0.75rem;
		color: var(--tf-accent-strong);
		padding-top: 2px;
	}
	.tlrow p {
		line-height: 1.6;
		color: var(--text-primary);
	}
	.tag {
		display: inline-block;
		font-family: var(--ff-ui);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		color: var(--tf-accent-strong);
		background: var(--tf-accent-soft);
		border-radius: 100px;
		padding: 2px 10px;
		margin-left: 8px;
		vertical-align: 1px;
	}
	.mgcard {
		display: flex;
		gap: 20px;
		align-items: center;
		background: var(--tf-ink);
		color: var(--tf-paper);
		border-radius: 16px;
		padding: 24px 28px;
	}
	.mgcard svg {
		flex-shrink: 0;
		color: var(--tf-accent-soft);
	}
	.mgcard b {
		color: var(--tf-paper);
		font-size: 0.97rem;
		display: block;
		margin-bottom: 3px;
	}
	.mgcard span {
		font-size: 0.85rem;
		color: color-mix(in srgb, var(--tf-paper) 72%, transparent);
	}
	.mgcard a {
		margin-left: auto;
		flex-shrink: 0;
		background: var(--tf-accent);
		color: #fff;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.85rem;
		padding: 12px 20px;
		border-radius: 10px;
		transition: background 0.15s;
	}
	.mgcard a:hover {
		background: var(--tf-accent-strong);
	}

	/* ─── Abgrenzung ─── */
	.not {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.not-card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--tf-line);
		border-radius: 16px;
		padding: 28px 26px;
		background: var(--tf-surface);
		box-shadow: var(--shadow-card);
	}
	.not-x {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--btb-steel-subtle);
		color: var(--tf-accent-strong);
		font-size: 1rem;
		margin-bottom: 16px;
	}
	.not-t {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--text-heading);
		margin-bottom: 8px;
	}
	.not-d {
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--tf-graphite);
	}

	/* ─── Erstgespräch + Box ─── */
	.first {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 30px;
		align-items: start;
	}
	.steps30 {
		margin-top: 8px;
	}
	.s30 {
		display: flex;
		gap: 13px;
		padding: 9px 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-primary);
	}
	.s30 .n {
		font-family: var(--ff-ui);
		font-size: 0.72rem;
		color: var(--tf-accent-strong);
		border: 1px solid var(--tf-line);
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		background: var(--tf-surface);
	}
	/* Dunkle CTA-Box mit Glow — identisch zur Haltungs-Box auf der Startseite */
	.ctabox {
		background: radial-gradient(
			120% 130% at 18% 0%,
			color-mix(in srgb, var(--tf-ink) 74%, #6b7280) 0%,
			var(--tf-ink) 60%,
			#14090b 118%
		);
		border-radius: 18px;
		padding: 34px 34px 30px;
		box-shadow: 0 26px 54px -36px rgba(10, 8, 8, 0.45);
	}
	.ctabox .mg-line {
		font-size: 0.82rem;
		color: var(--tf-accent-soft);
		margin-bottom: 10px;
	}
	.ctabox .mg-line :global(strong) {
		color: var(--tf-accent-soft);
	}
	.ctabox h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.35rem;
		color: #fff;
		margin-bottom: 6px;
	}
	.ctabox > p {
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.78);
		margin-bottom: 20px;
	}

	/* ─── FAQ ─── */
	.faq-title {
		margin-bottom: 18px;
	}

	/* ─── Responsive ─── */
	@media (max-width: 920px) {
		.steps-grid {
			grid-template-columns: 1fr;
			max-width: 560px;
		}
		.scard {
			border-top-width: 4px;
		}
	}
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
			max-width: 52ch;
		}
	}
	@media (max-width: 720px) {
		.sits,
		.not,
		.first {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.wrap {
			padding: 0 18px;
		}
	}
</style>
