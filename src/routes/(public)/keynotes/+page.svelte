<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import SubpageBrand from '$lib/components/ui/SubpageBrand.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import { renderMarkdownBlock } from '$lib/utils/markdown';
	import type { KeynotesContent, KeynoteItem } from '$lib/types/content';

	let { data } = $props();
	const content: KeynotesContent = data.content;

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

	const upcoming = content.items.filter(isUpcoming).sort((a, b) => ts(a.date) - ts(b.date));
	const past = content.items.filter((a) => !isUpcoming(a)).sort((a, b) => ts(b.date) - ts(a.date));
</script>

<svelte:head>
	<title>Keynotes — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Keynotes, Panels und Workshops von Brigitte Hulliger — KI, Governance und digitale Urteilskraft. Termine und Themen."
	/>
</svelte:head>

<div class="sub">
	<ScrollProgress />
	<header class="subbar">
		<SubpageBrand subtitle="Keynotes" />
		<a href={localizeHref('/')} class="back">← Zur Startseite</a>
	</header>

	<section class="hero">
		<div class="wrap">
			<div class="kick">Bühne</div>
			<h1>Keynotes, Panels &amp; Workshops.</h1>
			<p class="intro">
				KI, Governance und digitale Urteilskraft — Themen, über die ich nicht nur spreche, sondern die ich selbst baue und verantworte. Komm vorbei, wenn Du sie live sehen willst.
			</p>
		</div>
	</section>

	<section class="block">
		<div class="wrap">
			<div class="grouplbl">Als Nächstes</div>
			{#if upcoming.length > 0}
				<div class="ev-list">
					{#each upcoming as a}
						<article class="ev-card">
							<div class="ev-img">
								{#if a.image}<img src={a.image} alt={a.title} loading="lazy" decoding="async" />{/if}
								<div class="ev-datechip">
									<span class="d">{toDate(a.date)?.getDate() ?? ''}</span>
									<span class="mo">{toDate(a.date) ? MONTHS_SHORT_DE[toDate(a.date)!.getMonth()] : ''}</span>
								</div>
							</div>
							<div class="ev-body">
								{#if metaLine(a)}<div class="ev-ev">{metaLine(a)}</div>{/if}
								<h3>{a.title}</h3>
								<div class="ev-meta">
									<span>{fmtRange(a)}</span>
									{#if a.location}<span>· {a.location}</span>{/if}
								</div>
								{#if a.desc}<div class="ev-desc">{@html renderMarkdownBlock(a.desc)}</div>{/if}
								{#if a.tags.length > 0}
									<div class="ev-tags">
										{#each a.tags.slice(0, 4) as tag}<span class="ptag">{tag}</span>{/each}
									</div>
								{/if}
								{#if a.url}<a class="btn" href={a.url} target="_blank" rel="noopener noreferrer">Programm &amp; Anmeldung →</a>{/if}
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="ev-empty">
					<p>Aktuell ist kein öffentlicher Auftritt geplant. Du planst einen Anlass und suchst eine Keynote zu KI, Governance oder digitaler Urteilskraft?</p>
					<a class="ev-empty-cta" href={localizeHref('/kontakt')}>Anfrage stellen →</a>
				</div>
			{/if}

			{#if past.length > 0}
				<div class="grouplbl grouplbl-past">Rückblick</div>
				<div class="past-row">
					{#each past as a}
						{#snippet pastInner()}
							<div class="past-mini">
								<span class="mo">{toDate(a.date) ? MONTHS_SHORT_DE[toDate(a.date)!.getMonth()] : ''}</span>
								<span class="yr">{toDate(a.date)?.getFullYear() ?? ''}</span>
							</div>
							<div class="past-txt">
								{#if a.event}<div class="past-ev">{a.event}</div>{/if}
								<div class="past-title">{a.title}</div>
								{#if a.location || a.format}<div class="past-loc">{[a.location, a.format].filter((x) => x?.trim()).join(' · ')}</div>{/if}
							</div>
						{/snippet}
						{#if a.blogSlug}
							<a class="past-card past-card-link" href={localizeHref(`/impulse/${a.blogSlug}`)}>{@render pastInner()}</a>
						{:else if a.url}
							<a class="past-card past-card-link" href={a.url} target="_blank" rel="noopener noreferrer">{@render pastInner()}</a>
						{:else}
							<div class="past-card">{@render pastInner()}</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<ContactBand />
	<SiteFooter />
</div>

<style>
	.sub {
		background: var(--bg-page);
		color: var(--text-primary);
		min-height: 100vh;
	}
	.wrap {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 34px;
	}
	.subbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 34px;
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg-page) 90%, transparent);
		backdrop-filter: blur(8px);
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
	}
	.back {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
	}
	.back:hover {
		color: var(--btb-steel);
	}
	.hero {
		padding: 64px 0 30px;
	}
	.kick {
		font-family: var(--ff-ui);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--btb-steel);
		margin-bottom: 14px;
	}
	h1 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(32px, 4.4vw, 52px);
		line-height: 1.05;
		color: var(--text-heading);
		margin: 0 0 14px;
	}
	.intro {
		font-size: 16px;
		color: var(--text-secondary);
		max-width: 62ch;
		margin: 0;
	}
	.block {
		padding: 26px 0 70px;
	}
	.grouplbl {
		font-family: var(--ff-ui);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 11px;
		font-weight: 700;
		color: var(--btb-steel);
		margin: 26px 0 14px;
	}
	.grouplbl-past {
		margin-top: 44px;
	}

	/* Kommende Auftritte */
	.ev-list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.ev-card {
		display: grid;
		grid-template-columns: 240px 1fr;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		overflow: hidden;
	}
	.ev-img {
		position: relative;
		background: var(--bg-elevated);
		min-height: 170px;
	}
	.ev-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		position: absolute;
		inset: 0;
	}
	.ev-datechip {
		position: absolute;
		top: 12px;
		left: 12px;
		background: var(--bg-surface);
		border-radius: var(--radius-sm);
		padding: 6px 10px;
		text-align: center;
		box-shadow: var(--shadow-card);
	}
	.ev-datechip .d {
		display: block;
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 20px;
		line-height: 1.05;
		color: var(--text-heading);
	}
	.ev-datechip .mo {
		display: block;
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
	}
	.ev-body {
		padding: 22px 26px;
	}
	.ev-ev {
		font-size: 11.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
		color: var(--btb-steel);
		margin-bottom: 6px;
	}
	.ev-body h3 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 24px;
		margin: 0 0 8px;
		color: var(--text-heading);
	}
	.ev-meta {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		font-size: 13.5px;
		color: var(--text-secondary);
		margin-bottom: 10px;
	}
	.ev-desc {
		font-size: 14px;
		color: var(--text-secondary);
		line-height: 1.6;
	}
	.ev-desc :global(p) {
		margin: 0 0 8px;
	}
	.ev-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 12px 0 4px;
	}
	.ptag {
		font-size: 11px;
		font-weight: 500;
		padding: 4px 10px;
		border-radius: 4px;
		background: var(--bg-elevated);
		color: var(--btb-teal-dark);
	}
	.btn {
		display: inline-flex;
		margin-top: 12px;
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 12px 22px;
		border-radius: 6px;
		background: var(--btb-steel);
		color: #fff;
		text-decoration: none;
		transition: background 0.2s;
	}
	.btn:hover {
		background: var(--btb-steel-hover);
	}
	.ev-empty {
		border: 1px dashed var(--border);
		border-radius: var(--radius-card);
		background: var(--bg-surface);
		padding: 28px 30px;
	}
	.ev-empty p {
		font-size: 14.5px;
		color: var(--text-secondary);
		max-width: 62ch;
		margin: 0 0 10px;
	}
	.ev-empty-cta {
		font-weight: 600;
		font-size: 14px;
		color: var(--btb-steel);
		text-decoration: none;
	}

	/* Rückblick */
	.past-row {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}
	.past-card {
		display: flex;
		gap: 14px;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 16px 18px;
		background: var(--bg-surface);
		color: inherit;
		text-decoration: none;
	}
	.past-card-link:hover {
		border-color: var(--btb-steel);
	}
	.past-mini {
		text-align: center;
		flex-shrink: 0;
		min-width: 44px;
	}
	.past-mini .mo {
		display: block;
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 17px;
		color: var(--text-heading);
	}
	.past-mini .yr {
		display: block;
		font-size: 11px;
		color: var(--text-muted);
	}
	.past-ev {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		color: var(--btb-steel);
	}
	.past-title {
		font-weight: 600;
		font-size: 14.5px;
		color: var(--text-heading);
	}
	.past-loc {
		font-size: 12.5px;
		color: var(--text-muted);
	}

	@media (max-width: 720px) {
		.ev-card {
			grid-template-columns: 1fr;
		}
		.ev-img {
			min-height: 150px;
		}
	}
</style>
