<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { renderMarkdown, renderMarkdownBlock } from '$lib/utils/markdown';
	import SiteNav from '$lib/components/ui/SiteNav.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import type { KeynotesPageContent, KeynotesContent, KeynoteItem } from '$lib/types/content';

	let { data } = $props();
	const c: KeynotesPageContent = data.content;
	const events: KeynotesContent = data.events;

	const home = localizeHref('/');
	const navLinks = [
		{ href: `${home}#angebot`, label: m.nav_services() },
		{ href: `${home}#about`, label: m.nav_about() },
		{ href: localizeHref('/impulse'), label: m.nav_blog() }
	];

	// ─── Termine: kommend/vergangen (gleiche Logik wie bisher) ───
	const MONTHS_SHORT_DE = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'];
	function toDate(s: string | undefined): Date | null {
		if (!s) return null;
		const d = new Date(s);
		return isNaN(d.getTime()) ? null : d;
	}
	function startOfToday(): Date {
		const t = new Date();
		t.setHours(0, 0, 0, 0);
		return t;
	}
	function isUpcoming(a: KeynoteItem): boolean {
		const end = toDate(a.endDate) ?? toDate(a.date);
		return end ? end >= startOfToday() : false;
	}
	function ts(s: string | undefined): number {
		return toDate(s)?.getTime() ?? 0;
	}
	function fmtDate(s: string | undefined): string {
		const d = toDate(s);
		return d ? `${d.getDate()}. ${MONTHS_SHORT_DE[d.getMonth()]} ${d.getFullYear()}` : '';
	}
	function fmtRange(a: KeynoteItem): string {
		if (!a.endDate || a.endDate === a.date) return fmtDate(a.date);
		return `${fmtDate(a.date)} – ${fmtDate(a.endDate)}`;
	}
	function metaLine(a: KeynoteItem): string {
		return [a.event, a.format].filter((x) => x?.trim()).join(' · ');
	}
	const upcoming = events.items.filter(isUpcoming).sort((a, b) => ts(a.date) - ts(b.date));
	const past = events.items.filter((a) => !isUpcoming(a)).sort((a, b) => ts(b.date) - ts(a.date));

	const speakerKitHref = c.cta.dark.speakerKitUrl || c.cta.dark.mailtoHref;
	const speakerKitIsPdf = !!c.cta.dark.speakerKitUrl;
</script>

<svelte:head>
	<title>Keynotes & Lehre — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Keynotes zu KI, Governance und digitaler Urteilskraft — ohne Hype, aus erster Hand. Formate, Auftritte und Speaker-Kit von Brigitte Hulliger."
	/>
</svelte:head>

<div class="kn">
	<ScrollProgress />
	<SiteNav theme={data.theme} links={navLinks} subtitle="Keynotes" />

	<!-- ═══════ Hero ═══════ -->
	<header class="hero">
		<div class="wrap">
			<span class="kick">{c.hero.kicker}</span>
			<div class="hero-lead">
				<div class="hero-main">
					<h1 class="md">{@html renderMarkdown(c.hero.title)}</h1>
					<div class="hero-cta">
						<a class="btn" href="#talks">{c.hero.ctaPrimary} →</a>
						<a class="btn ghost" href="#kontakt">{c.hero.ctaSecondary}</a>
					</div>
				</div>
				<div class="hero-side">
					<p class="sub">{c.hero.subline}</p>
				</div>
			</div>
		</div>
	</header>

	<!-- ═══════ Signature-Talks ═══════ -->
	<section id="talks" class="block">
		<div class="wrap">
			<span class="kick">{c.signature.kicker}</span>
			<h2>{c.signature.title}</h2>
			<p class="lead">{c.signature.lead}</p>
			<div class="talks">
				{#each c.signature.items as talk}
					<div class="talk">
						<div class="talk-head" class:has-img={talk.image}>
							{#if talk.image}<img class="talk-head-bg" src={talk.image} alt="" loading="lazy" />{/if}
							<div class="talk-head-inner">
								<span class="talk-kick">{talk.kicker}</span>
								<h3>{talk.title}</h3>
								<p class="talk-desc">{talk.desc}</p>
							</div>
						</div>
						<div class="talk-body">
							<span class="talk-tw">{talk.takeawaysLabel}</span>
							<ul>
								{#each talk.takeaways as t}<li>{t}</li>{/each}
							</ul>
							{#if talk.meta?.length}
								<div class="talk-meta">
									{#each talk.meta as mtag}<span>{mtag}</span>{/each}
								</div>
							{/if}
							{#if talk.linkUrl}
								<a class="talk-link" href={talk.linkUrl} target="_blank" rel="noopener noreferrer">{talk.linkLabel}</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ USP (Petrol) ═══════ -->
	<section class="usp">
		<div class="wrap">
			<span class="kick kick-light">{c.usp.kicker}</span>
			<p class="big md">{@html renderMarkdown(c.usp.big)}</p>
			<p class="usp-small">{c.usp.small}</p>
			{#if c.usp.demo}<p class="usp-demo">{c.usp.demo}</p>{/if}
		</div>
	</section>

	<!-- ═══════ Formate ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.formats.kicker}</span>
			<h2>{c.formats.title}</h2>
			<p class="lead">{c.formats.lead}</p>
			<div class="formats">
				{#each c.formats.items as f}
					<div class="format">
						<span class="format-k">{f.label}</span>
						<h3>{f.title}</h3>
						<p>{f.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ Lehre ═══════ -->
	<section class="lehre">
		<div class="wrap">
			<div class="lehre-row">
				<div>
					<span class="kick">{c.lehre.kicker}</span>
					<h2>{c.lehre.title}</h2>
					<p class="lehre-text">{c.lehre.text}</p>
				</div>
				<blockquote>{c.lehre.quote}</blockquote>
			</div>
			{#if c.lehre.items?.length}
				<div class="lehre-list">
					{#each c.lehre.items as item}
						<div class="lehre-item">
							<span class="lehre-item-role">{item.role}{#if item.note} · {item.note}{/if}</span>
							<b>{item.title}</b>
							<span class="lehre-item-org">{item.org}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════ Auftritte ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.auftritte.kicker}</span>
			<h2>{c.auftritte.title}</h2>
			<p class="lead">{c.auftritte.lead}</p>

			{#if upcoming.length > 0}
				<div class="next-list">
					{#each upcoming as a, i}
						<div class="next" class:next-has-img={a.image}>
							{#if a.image}<img class="next-img" src={a.image} alt={a.title} loading="lazy" />{/if}
							<div class="next-info">
								<span class="next-k">{i === 0 ? '★ Nächster Auftritt' : metaLine(a) || 'Auftritt'}</span>
								<b>{a.title}</b>
								<p class="next-when">{fmtRange(a)}{#if a.location} · {a.location}{/if}{#if a.event && i === 0} · {a.event}{/if}</p>
								{#if a.desc}<div class="next-desc">{@html renderMarkdownBlock(a.desc)}</div>{/if}
								{#if a.tags?.length}
									<div class="next-tags">
										{#each a.tags.slice(0, 4) as tag}<span>{tag}</span>{/each}
									</div>
								{/if}
							</div>
							{#if a.url}<div class="next-cta"><a class="btn" href={a.url} target="_blank" rel="noopener noreferrer">Zum Anlass →</a></div>{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#if past.length > 0}
				<div class="past">
					{#each past as a}
						<div class="prow">
							{#if a.image}<img class="prow-img" src={a.image} alt="" loading="lazy" />{/if}
							<span class="d">{toDate(a.date) ? `${MONTHS_SHORT_DE[toDate(a.date)!.getMonth()]} ${toDate(a.date)!.getFullYear()}` : ''}</span>
							<span class="prow-txt">{#if a.event}<b>{a.event}</b> — {/if}{a.title}</span>
							{#if a.blogSlug}
								<a href={localizeHref(`/impulse/${a.blogSlug}`)}>Nachlese →</a>
							{:else if a.url}
								<a href={a.url} target="_blank" rel="noopener noreferrer">Mehr →</a>
							{:else}<span></span>{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════ CTA (zweigleisig) ═══════ -->
	<section id="kontakt" class="block">
		<div class="wrap">
			<div class="cta2">
				<div class="ctacard dark">
					<h3>{c.cta.dark.title}</h3>
					<p>{c.cta.dark.text}</p>
					{#if speakerKitIsPdf}
						<a class="btn" href={speakerKitHref} target="_blank" rel="noopener noreferrer">{c.cta.dark.ctaLabel}</a>
					{:else}
						<a class="btn" href={speakerKitHref}>{c.cta.dark.ctaLabel}</a>
					{/if}
				</div>
				<div class="ctacard light">
					<h3>{c.cta.light.title}</h3>
					<p>{c.cta.light.text}</p>
					<a class="btn" href={c.cta.light.ctaHref}>{c.cta.light.ctaLabel}</a>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════ Post-Event (dunkel, QR-Ziel) ═══════ -->
	<section class="postevent" id="nach-dem-referat">
		<div class="wrap">
			<span class="kick kick-light">{c.postEvent.kicker}</span>
			<h2>{c.postEvent.title}</h2>
			<div class="pe-grid">
				{#each c.postEvent.cards as card}
					{#if card.url}
						<a class="pe-card" href={card.url} target={card.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
							<b>{card.title}</b>
							<span>{card.desc}</span>
						</a>
					{:else}
						<div class="pe-card pe-card-static">
							<b>{card.title}</b>
							<span>{card.desc}</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<ContactBand />
	<SiteFooter />
</div>

<style>
	/* ═══════════════════════════════════════════════════════════
	   Theme-Mapping — Prototyp-Palette → aktive Theme-Variablen
	   (dieselben Werte wie /transformation).
	═══════════════════════════════════════════════════════════ */
	.kn {
		--kn-accent: var(--btb-steel);
		--kn-accent-strong: var(--btb-steel-hover);
		--kn-accent-soft: var(--btb-teal-light);
		--kn-ink: var(--text-heading);
		--kn-paper: var(--bg-page);
		--kn-surface: var(--bg-surface);
		--kn-line: var(--border);
		--kn-muted: var(--text-muted);
		--kn-graphite: var(--text-secondary);

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
		color: var(--kn-accent-strong);
		font-weight: 700;
	}
	.md :global(em) {
		color: var(--kn-accent-strong);
		font-style: normal;
	}

	/* ─── Section-Grundlagen ─── */
	.block {
		padding: 60px 0;
		border-bottom: 1px solid var(--kn-line);
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
		color: var(--kn-accent);
		margin-bottom: 16px;
	}
	.lead {
		color: var(--kn-graphite);
		font-size: 0.97rem;
		line-height: 1.7;
		max-width: 62ch;
		margin-bottom: 30px;
	}

	/* ─── Hero ─── */
	.hero {
		padding: 72px 0 56px;
		border-bottom: 1px solid var(--kn-line);
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
		font-size: clamp(2rem, 5vw, 3.1rem);
		line-height: 1.1;
		max-width: 18ch;
		color: var(--text-heading);
	}
	.hero-side {
		padding-left: 20px;
		border-left: 3px solid var(--kn-accent);
	}
	.hero .sub {
		color: var(--kn-graphite);
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
		background: var(--kn-accent);
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
		background: var(--kn-accent-strong);
	}
	.btn.ghost {
		background: transparent;
		border: 1.5px solid var(--kn-accent);
		color: var(--kn-accent-strong);
	}
	.btn.ghost:hover {
		background: var(--btb-steel-subtle);
	}

	/* ─── Signature-Talks (dunkler Kopf, heller Body) ─── */
	.talks {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	.talk {
		display: flex;
		flex-direction: column;
		background: var(--kn-surface);
		border: 1px solid var(--kn-line);
		border-radius: 16px;
		overflow: hidden;
		box-shadow: var(--shadow-card);
	}
	.talk-head {
		position: relative;
		overflow: hidden;
		padding: 24px 26px 20px;
		color: #fff;
		background: radial-gradient(
			120% 130% at 18% 0%,
			color-mix(in srgb, var(--kn-ink) 74%, #6b7280) 0%,
			var(--kn-ink) 60%,
			#14090b 118%
		);
	}
	/* Mit Bild: Bild als Hintergrund, Text unten über dunklem Overlay */
	.talk-head.has-img {
		min-height: 158px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.talk-head-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}
	.talk-head.has-img::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(160deg, rgba(20, 9, 11, 0.55), rgba(20, 9, 11, 0.9));
		z-index: 1;
	}
	.talk-head-inner {
		position: relative;
		z-index: 2;
	}
	.talk-kick {
		display: block;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--kn-accent-soft);
		margin-bottom: 8px;
	}
	.talk-head h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.3rem;
		line-height: 1.2;
		color: #fff;
	}
	.talk-desc {
		font-size: 0.85rem;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.78);
		margin-top: 8px;
	}
	.talk-body {
		padding: 20px 26px 22px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.talk-tw {
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--kn-muted);
		margin-bottom: 8px;
	}
	.talk-body ul {
		list-style: none;
		margin: 0 0 16px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.talk-body li {
		position: relative;
		padding-left: 22px;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--text-primary);
	}
	.talk-body li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--kn-accent);
		font-weight: 700;
	}
	.talk-meta {
		display: flex;
		gap: 7px;
		flex-wrap: wrap;
		margin-top: auto;
	}
	.talk-meta span {
		font-size: 0.72rem;
		color: var(--kn-graphite);
		border: 1px solid var(--kn-line);
		border-radius: 100px;
		padding: 4px 12px;
		background: var(--bg-section-alt);
	}
	.talk-link {
		margin-top: 14px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--kn-accent-strong);
		text-decoration: none;
	}
	.talk-link:hover {
		text-decoration: underline;
	}

	/* ─── USP (Petrol) ─── */
	.usp {
		padding: 60px 0;
		background: radial-gradient(
			120% 130% at 82% 0%,
			color-mix(in srgb, var(--kn-accent) 68%, #d9f2f0) 0%,
			var(--kn-accent) 58%,
			var(--kn-accent-strong) 118%
		);
		color: #fff;
	}
	.kick-light {
		color: rgba(255, 255, 255, 0.82);
	}
	.big {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(1.25rem, 3vw, 1.7rem);
		line-height: 1.35;
		max-width: 36ch;
		color: #fff;
	}
	.big :global(em) {
		color: #fff;
		font-style: italic;
	}
	.usp-small {
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.9rem;
		line-height: 1.6;
		max-width: 58ch;
		margin-top: 14px;
	}
	.usp-demo {
		margin-top: 22px;
		padding: 16px 20px;
		border: 1px dashed rgba(255, 255, 255, 0.4);
		border-radius: 14px;
		max-width: 560px;
		font-size: 0.85rem;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.9);
	}

	/* ─── Formate (Akzent-Top-Bar-Karten) ─── */
	.formats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.format {
		background: var(--kn-surface);
		border: 1px solid var(--kn-line);
		border-top: 3px solid var(--kn-accent);
		border-radius: 4px 4px 16px 16px;
		padding: 22px 24px;
		box-shadow: var(--shadow-card);
	}
	.format-k {
		display: block;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--kn-muted);
	}
	.format h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--text-heading);
		margin: 6px 0 6px;
	}
	.format p {
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--kn-graphite);
	}

	/* ─── Lehre (Tint-Band) ─── */
	.lehre {
		padding: 60px 0;
		background: var(--bg-section-alt);
		border-bottom: 1px solid var(--kn-line);
	}
	.lehre-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 34px;
		align-items: center;
	}
	.lehre-text {
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--kn-graphite);
		margin-top: 4px;
	}
	.lehre blockquote {
		font-family: var(--ff-serif);
		font-style: italic;
		font-weight: 600;
		font-size: clamp(1.15rem, 2.6vw, 1.45rem);
		line-height: 1.4;
		color: var(--text-heading);
	}
	.lehre-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
		margin-top: 36px;
	}
	.lehre-item {
		display: flex;
		flex-direction: column;
		gap: 3px;
		background: var(--kn-surface);
		border: 1px solid var(--kn-line);
		border-top: 3px solid var(--kn-accent);
		border-radius: 4px 4px 14px 14px;
		padding: 16px 18px;
		box-shadow: var(--shadow-card);
	}
	.lehre-item-role {
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--kn-accent-strong);
	}
	.lehre-item b {
		font-family: var(--ff-serif);
		font-size: 1.02rem;
		font-weight: 700;
		color: var(--text-heading);
		line-height: 1.25;
	}
	.lehre-item-org {
		font-size: 0.82rem;
		color: var(--kn-graphite);
	}

	/* ─── Auftritte ─── */
	.next-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 26px;
	}
	.next {
		display: flex;
		align-items: stretch;
		gap: 22px;
		flex-wrap: wrap;
		background: var(--kn-surface);
		border: 1px solid var(--kn-line);
		border-left: 3px solid var(--kn-accent);
		border-radius: 16px;
		padding: 22px 26px;
		box-shadow: var(--shadow-card);
	}
	.next-img {
		width: 188px;
		align-self: stretch;
		min-height: 132px;
		object-fit: cover;
		border-radius: 10px;
		flex-shrink: 0;
	}
	.next-info {
		flex: 1;
		min-width: 220px;
	}
	.next-cta {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
	.next-k {
		display: block;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--kn-accent-strong);
		margin-bottom: 4px;
	}
	.next b {
		font-family: var(--ff-serif);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--text-heading);
	}
	.next-when {
		font-size: 0.82rem;
		color: var(--kn-muted);
		margin-top: 4px;
	}
	.next-desc {
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--kn-graphite);
		margin-top: 10px;
		max-width: 62ch;
	}
	.next-desc :global(p) {
		margin: 0 0 6px;
	}
	.next-desc :global(p:last-child) {
		margin-bottom: 0;
	}
	.next-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px;
	}
	.next-tags span {
		font-size: 0.72rem;
		color: var(--kn-graphite);
		border: 1px solid var(--kn-line);
		border-radius: 100px;
		padding: 3px 11px;
		background: var(--bg-section-alt);
	}
	.past {
		border-top: 1px solid var(--kn-line);
	}
	.prow {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 4px;
		border-bottom: 1px solid var(--kn-line);
		font-size: 0.88rem;
	}
	.prow-img {
		width: 46px;
		height: 46px;
		object-fit: cover;
		border-radius: 8px;
		flex-shrink: 0;
	}
	.prow .d {
		width: 92px;
		flex-shrink: 0;
		font-size: 0.78rem;
		color: var(--kn-muted);
	}
	.prow-txt {
		flex: 1;
		color: var(--text-primary);
		line-height: 1.5;
	}
	.prow-txt b {
		font-weight: 600;
	}
	.prow a {
		color: var(--kn-accent-strong);
		font-weight: 600;
		text-decoration: none;
		font-size: 0.8rem;
		white-space: nowrap;
	}

	/* ─── CTA ─── */
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
			color-mix(in srgb, var(--kn-ink) 74%, #6b7280) 0%,
			var(--kn-ink) 60%,
			#14090b 118%
		);
		color: #fff;
		box-shadow: 0 26px 54px -36px rgba(10, 8, 8, 0.45);
	}
	.ctacard.light {
		background: var(--kn-surface);
		border: 1px solid var(--kn-line);
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
		color: var(--kn-graphite);
	}

	/* ─── Post-Event (Petrol, QR-Ziel) ─── */
	.postevent {
		padding: 60px 0;
		background: radial-gradient(
			120% 130% at 82% 0%,
			color-mix(in srgb, var(--kn-accent) 68%, #d9f2f0) 0%,
			var(--kn-accent) 58%,
			var(--kn-accent-strong) 118%
		);
		color: #fff;
	}
	.postevent h2 {
		color: #fff;
	}
	.pe-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
		margin-top: 24px;
	}
	.pe-card {
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 14px;
		padding: 20px 22px;
		text-decoration: none;
		color: #fff;
		display: block;
		transition: border-color 0.2s, transform 0.2s;
	}
	.pe-card:not(.pe-card-static):hover {
		border-color: rgba(255, 255, 255, 0.6);
		transform: translateY(-3px);
	}
	.pe-card b {
		display: block;
		font-size: 0.95rem;
		color: #fff;
		margin-bottom: 4px;
	}
	.pe-card span {
		font-size: 0.82rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.72);
	}

	/* ─── Responsive ─── */
	@media (max-width: 860px) {
		.hero-lead,
		.lehre-row {
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
	}
	@media (max-width: 760px) {
		.talks,
		.formats,
		.cta2,
		.pe-grid,
		.lehre-list {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.wrap {
			padding: 0 18px;
		}
		.next-img {
			width: 100%;
			height: 150px;
		}
	}
</style>
