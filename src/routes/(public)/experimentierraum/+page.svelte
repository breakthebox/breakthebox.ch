<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { renderMarkdown, renderMarkdownBlock } from '$lib/utils/markdown';
	import SiteNav from '$lib/components/ui/SiteNav.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import type { ExperimentierraumContent } from '$lib/types/content';

	let { data } = $props();
	const c: ExperimentierraumContent = data.content;

	// Nav-Links zeigen auf die Startseiten-Sektionen (Unterseite).
	const home = localizeHref('/');
	const navLinks = [
		{ href: `${home}#angebot`, label: m.nav_services() },
		{ href: `${home}#about`, label: m.nav_about() },
		{ href: localizeHref('/impulse'), label: m.nav_blog() }
	];

	let eightBit = $state(false);
	let toast = $state('');

	$effect(() => {
		// Konsolen-Easter-Egg für Devs
		console.log(
			'%c🍓 Break the Box · Experimentierraum',
			'color:#0f7c82;font-size:15px;font-weight:bold'
		);
		console.log(
			'%cDu liest die Konsole? Dann sind wir uns sympathisch. Schreib mir: info@breakthebox.ch',
			'color:#8A6E6F;font-size:12px'
		);
		console.log('%cTipp: Konami-Code  ↑ ↑ ↓ ↓ ← → ← → B A', 'color:#5BB8E6;font-size:12px');

		// Konami-Code → 8-Bit-Modus
		const seq = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
		let pos = 0;
		function onKey(e: KeyboardEvent) {
			const k = e.key.toLowerCase();
			if (k === seq[pos]) {
				pos++;
			} else {
				pos = k === seq[0] ? 1 : 0;
			}
			if (pos === seq.length) {
				pos = 0;
				eightBit = !eightBit;
				toast = eightBit ? '🕹️ 8-Bit-Modus aktiviert' : '8-Bit-Modus deaktiviert';
				setTimeout(() => (toast = ''), 2600);
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<svelte:head>
	<title>Experimentierraum — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Die Werkstatt statt Portfolio: eigene Plattformen, KI-Agenten und Infrastruktur — self-hosted, nicht kommerziell, ehrlich dokumentiert. Ich empfehle nichts, was ich nicht selbst gebaut habe."
	/>
</svelte:head>

<!-- Pixel-Filter (Easter-Egg / Hover) -->
<svg width="0" height="0" style="position: absolute" aria-hidden="true">
	<filter id="pixelate" x="0" y="0">
		<feFlood x="2" y="2" height="1" width="1" />
		<feComposite width="7" height="7" />
		<feTile result="a" />
		<feComposite in="SourceGraphic" in2="a" operator="in" />
		<feMorphology operator="dilate" radius="3.5" />
	</filter>
</svg>

<div class="exp" class:is-8bit={eightBit}>
	<ScrollProgress />

	{#if toast}
		<div class="eb-toast" role="status">{toast}</div>
	{/if}

	<SiteNav theme={data.theme} links={navLinks} subtitle="Experimentierraum" />

	<!-- ═══════ Hero ═══════ -->
	<header class="hero">
		<div class="wrap">
			<span class="kick">{c.hero.kicker}</span>
			<div class="hero-lead">
				<h1 class="md">{@html renderMarkdown(c.hero.title)}</h1>
				<div class="hero-side">
					<p class="sub">{c.hero.subline}</p>
				</div>
			</div>

			{#if c.rules.length}
				<div class="rules">
					{#each c.rules as rule}
						<div class="rule">
							<span class="rn">{rule.no}</span>
							<b>{rule.title}</b>
							<p>{rule.text}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- ═══════ Werkbank ═══════ -->
	<section class="block">
		<div class="wrap">
			<span class="kick">{c.bench.kicker}</span>
			<h2>{c.bench.title}</h2>
			<p class="lead">{c.bench.lead}</p>

			<div class="bench">
				{#each c.bench.items as exp}
					<article class="wb">
						{#if exp.image}
							<div class="wb-img"><img src={exp.image} alt={exp.name} loading="lazy" /></div>
						{/if}
						<div class="wb-body">
							{#if exp.status}<span class="status">{exp.status}</span>{/if}
							<h3>{exp.name}</h3>
							{#if exp.what}<p class="what">{exp.what}</p>{/if}
							<p class="desc">{exp.desc}</p>
							{#if exp.stack?.length}
								<div class="stack">
									{#each exp.stack as tech}<span>{tech}</span>{/each}
								</div>
							{/if}
							{#if exp.url}
								<a class="visit" href={exp.url} target="_blank" rel="noopener noreferrer">
									{exp.urlLabel || exp.url} →
								</a>
							{/if}
						</div>
						{#if exp.lehrgeld}
							<div class="learn">
								<span class="ll">Lehrgeld</span>
								<p class="md">{@html renderMarkdown(exp.lehrgeld)}</p>
							</div>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ Verworfen ═══════ -->
	{#if c.discarded.items.length}
		<section class="failed">
			<div class="wrap">
				<span class="kick">{c.discarded.kicker}</span>
				<h2>{c.discarded.title}</h2>
				<p class="lead">{c.discarded.lead}</p>
				<div class="dgrid">
					{#each c.discarded.items as item}
						<article class="dcard">
							<div class="dcard-top">
								<span class="dcard-x" aria-hidden="true">✕</span>
								<span class="dcard-tag">Eingestellt</span>
							</div>
							<h3 class="dcard-t">{item.title}</h3>
							<div class="dcard-d md">{@html renderMarkdownBlock(item.text)}</div>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- ═══════ Transfer (dunkle Zitat-Box) ═══════ -->
	<section class="transfer">
		<div class="wrap">
			<span class="kick kick-light">{c.transfer.kicker}</span>
			<blockquote>{c.transfer.quote}</blockquote>
			<p class="small md">{@html renderMarkdown(c.transfer.text)}</p>
		</div>
	</section>

	<!-- ═══════ Soft CTA ═══════ -->
	<section class="soft">
		<div class="wrap">
			<p>{c.softCta.text}</p>
			<div class="soft-cta">
				<a class="btn" href={c.softCta.primaryHref}>{c.softCta.primaryLabel} →</a>
				<a class="btn ghost" href={c.softCta.secondaryHref}>{c.softCta.secondaryLabel}</a>
			</div>
		</div>
	</section>

	<ContactBand />
	<SiteFooter />
</div>

<style>
	.exp {
		--exp-accent: var(--btb-steel);
		--exp-accent-strong: var(--btb-steel-hover);
		--exp-accent-soft: var(--btb-teal-light);
		--exp-ink: var(--text-heading);
		--exp-paper: var(--bg-page);
		--exp-surface: var(--bg-surface);
		--exp-line: var(--border);
		--exp-muted: var(--text-muted);
		--exp-graphite: var(--text-secondary);

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
		color: var(--exp-accent-strong);
		font-weight: 700;
	}
	.md :global(em) {
		color: var(--exp-accent-strong);
		font-style: normal;
	}

	/* ─── Section-Grundlagen ─── */
	.block {
		padding: 64px 0;
		border-bottom: 1px solid var(--exp-line);
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
		color: var(--exp-accent);
		margin-bottom: 16px;
	}
	.lead {
		color: var(--exp-graphite);
		font-size: 0.97rem;
		line-height: 1.7;
		max-width: 62ch;
		margin-bottom: 32px;
	}

	/* ─── Hero ─── */
	.hero {
		padding: 72px 0 60px;
		border-bottom: 1px solid var(--exp-line);
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
		font-size: clamp(2.1rem, 5.2vw, 3.2rem);
		line-height: 1.1;
		max-width: 20ch;
		color: var(--text-heading);
	}
	.hero-side {
		padding-left: 20px;
		border-left: 3px solid var(--exp-accent);
	}
	.hero .sub {
		color: var(--exp-graphite);
		font-size: 1.02rem;
		line-height: 1.6;
		max-width: 46ch;
		margin: 0;
	}

	/* ─── Regeln des Raums ─── */
	.rules {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-top: 40px;
	}
	.rule {
		background: var(--exp-surface);
		border: 1px solid var(--exp-line);
		border-top: 3px solid var(--exp-accent);
		border-radius: 4px 4px 16px 16px;
		padding: 20px 22px;
		box-shadow: var(--shadow-card);
	}
	.rule .rn {
		font-family: var(--ff-ui);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--exp-muted);
	}
	.rule b {
		display: block;
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--text-heading);
		margin: 6px 0 6px;
	}
	.rule p {
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--exp-graphite);
	}

	/* ─── Werkbank (2-Spalten-Karten) ─── */
	.bench {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 22px;
	}
	.wb {
		display: flex;
		flex-direction: column;
		min-width: 0;
		background: var(--exp-surface);
		border: 1px solid var(--exp-line);
		border-radius: 16px;
		overflow: hidden;
		box-shadow: var(--shadow-card);
	}
	.wb-img {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-bottom: 1px solid var(--exp-line);
	}
	.wb-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: filter 0.12s steps(2), transform 0.4s ease;
	}
	.wb:hover .wb-img img {
		transform: scale(1.03);
	}
	.wb-body {
		display: flex;
		flex-direction: column;
		padding: 26px 28px 22px;
	}
	.status {
		display: inline-block;
		font-family: var(--ff-ui);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--exp-accent-strong);
		background: var(--btb-steel-subtle);
		border: 1px solid color-mix(in srgb, var(--exp-accent) 30%, transparent);
		border-radius: 100px;
		padding: 4px 12px;
		margin-bottom: 12px;
	}
	.status::before {
		content: '● ';
	}
	.wb h3 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.35rem;
		color: var(--text-heading);
		margin-bottom: 3px;
	}
	.wb .what {
		font-family: var(--ff-serif);
		font-style: italic;
		font-size: 0.95rem;
		color: var(--exp-accent-strong);
		margin-bottom: 10px;
	}
	.wb .desc {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-primary);
	}
	.stack {
		display: flex;
		gap: 7px;
		flex-wrap: wrap;
		margin-top: 14px;
	}
	.stack span {
		font-family: var(--ff-ui);
		font-size: 0.68rem;
		color: var(--exp-graphite);
		border: 1px solid var(--exp-line);
		border-radius: 100px;
		padding: 3px 11px;
		background: var(--bg-section-alt);
	}
	.visit {
		display: inline-block;
		margin-top: 14px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--exp-accent-strong);
		text-decoration: none;
		transition: color 0.15s;
	}
	.visit:hover {
		color: var(--exp-accent);
	}
	.learn {
		margin-top: auto;
		border-top: 1px solid color-mix(in srgb, var(--exp-accent) 18%, transparent);
		background: var(--bg-section-alt);
		padding: 18px 28px 20px;
	}
	.learn .ll {
		display: inline-block;
		font-family: var(--ff-ui);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--exp-accent-strong);
		margin-bottom: 8px;
	}
	.learn .ll::before {
		content: '→ ';
	}
	.learn p {
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--text-primary);
	}

	/* ─── Verworfen ─── */
	.failed {
		padding: 64px 0;
		background: var(--bg-section-alt);
		border-bottom: 1px solid var(--exp-line);
	}
	.dgrid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 18px;
	}
	.dcard {
		display: flex;
		flex-direction: column;
		background: var(--exp-surface);
		border: 1px solid var(--exp-line);
		border-radius: 16px;
		padding: 26px 28px;
		box-shadow: var(--shadow-card);
	}
	.dcard-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}
	.dcard-x {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--bg-section-alt);
		border: 1px solid var(--exp-line);
		color: var(--exp-muted);
		font-size: 0.85rem;
	}
	.dcard-tag {
		font-family: var(--ff-ui);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--exp-muted);
	}
	.dcard-t {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.15rem;
		line-height: 1.3;
		color: var(--text-heading);
		margin-bottom: 10px;
	}
	.dcard-d {
		font-size: 0.88rem;
		line-height: 1.65;
		color: var(--exp-graphite);
	}
	.dcard-d :global(p) {
		margin-bottom: 8px;
	}
	.dcard-d :global(p:last-child) {
		margin-bottom: 0;
	}

	/* ─── Transfer (dunkle Zitat-Box wie die Haltungs-Box) ─── */
	.transfer {
		padding: 64px 0;
		background: radial-gradient(
			120% 130% at 18% 0%,
			color-mix(in srgb, var(--exp-ink) 74%, #6b7280) 0%,
			var(--exp-ink) 60%,
			#14090b 118%
		);
		border-bottom: 1px solid var(--exp-line);
	}
	.kick-light {
		color: var(--exp-accent-soft);
	}
	.transfer blockquote {
		font-family: var(--ff-serif);
		font-style: italic;
		font-weight: 600;
		font-size: clamp(1.25rem, 3vw, 1.7rem);
		line-height: 1.4;
		max-width: 34ch;
		color: #fff;
	}
	.transfer .small {
		color: rgba(255, 255, 255, 0.78);
		font-size: 0.9rem;
		line-height: 1.7;
		max-width: 58ch;
		margin-top: 18px;
	}
	.transfer .small :global(a) {
		color: var(--exp-accent-soft);
		font-weight: 600;
		text-decoration: none;
	}
	.transfer .small :global(a:hover) {
		text-decoration: underline;
	}

	/* ─── Soft CTA ─── */
	.soft {
		padding: 64px 0;
		text-align: center;
	}
	.soft p {
		color: var(--exp-graphite);
		font-size: 1rem;
		line-height: 1.7;
		max-width: 52ch;
		margin: 0 auto 24px;
	}
	.soft-cta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
	}
	.btn {
		display: inline-block;
		background: var(--exp-accent);
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
		background: var(--exp-accent-strong);
	}
	.btn.ghost {
		background: transparent;
		border: 1.5px solid var(--exp-accent);
		color: var(--exp-accent-strong);
	}
	.btn.ghost:hover {
		background: var(--btb-steel-subtle);
	}

	/* ─── 8-Bit-Modus (Konami-Code) ─── */
	.is-8bit .wb-img img {
		filter: url(#pixelate);
		image-rendering: pixelated;
	}
	.is-8bit .hero h1,
	.is-8bit h2,
	.is-8bit .wb h3,
	.is-8bit .rule b,
	.is-8bit .kick {
		font-family: var(--ff-mono, monospace);
		letter-spacing: 0;
	}
	.eb-toast {
		position: fixed;
		top: 18px;
		left: 50%;
		transform: translateX(-50%);
		z-index: var(--z-toast, 2000);
		background: var(--text-heading);
		color: #fff;
		font-family: var(--ff-mono, monospace);
		font-size: 0.85rem;
		font-weight: 600;
		padding: 10px 18px;
		border-radius: 8px;
		box-shadow: 0 12px 30px -12px rgba(0, 0, 0, 0.5);
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
			max-width: 52ch;
		}
	}
	@media (max-width: 780px) {
		.bench {
			grid-template-columns: 1fr;
		}
		.rules {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.wrap {
			padding: 0 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wb-img img {
			transition: none;
		}
	}
</style>
