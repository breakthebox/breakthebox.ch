<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import SubpageBrand from '$lib/components/ui/SubpageBrand.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import MissBizzyChat from '$lib/components/ui/MissBizzyChat.svelte';
	import type { ExperimentsContent } from '$lib/types/content';

	let { data } = $props();
	const experiments: ExperimentsContent = data.experiments;

	let eightBit = $state(false);
	let toast = $state('');

	$effect(() => {
		// Konsolen-Easter-Egg für Devs
		console.log(
			'%c🍓 Break the Box · Experimentierraum',
			'color:#B11E2C;font-size:15px;font-weight:bold'
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
	<title>{m.exp_page_title()} — Brigitte Hulliger | Break the Box</title>
	<meta name="description" content={m.exp_page_subtitle()} />
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

<div class="sub" class:is-8bit={eightBit}>
	<ScrollProgress />
	{#if toast}
		<div class="eb-toast" role="status">{toast}</div>
	{/if}
	<MissBizzyChat />
	<header class="subbar">
		<SubpageBrand subtitle="Experimentierraum" />
		<a href={localizeHref('/')} class="back">← {m.exp_back()}</a>
	</header>

	<section class="hero">
		<div class="wrap">
			<div class="kick">{m.exp_page_title()}</div>
			<h1>{m.exp_page_subtitle()}</h1>
			<p class="intro">{m.exp_intro()}</p>
		</div>
	</section>

	<section class="block">
		<div class="wrap">
			<h2 class="block-title">{m.exp_platforms_label()}</h2>
			<div class="grid">
				{#each experiments.platforms as p}
					<div class="card">
						{#if p.image}
							<img src={p.image} alt={p.name} class="card-img" loading="lazy" />
						{/if}
						<h3>{p.name}</h3>
						{#if p.sketch}<span class="sketch">{p.sketch}</span>{/if}
						{#each p.desc as para}
							<p>{para}</p>
						{/each}
						{#if p.url}
							<a href={p.url} target="_blank" rel="noopener noreferrer" class="card-link">{m.exp_visit()} →</a>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	{#if experiments.projects.length > 0}
		<section class="block block-alt">
			<div class="wrap">
				<h2 class="block-title">{m.exp_projects_label()}</h2>
				<div class="grid">
					{#each experiments.projects as project}
						<div class="card">
							{#if project.image}
								<img src={project.image} alt={project.name} class="card-img" loading="lazy" />
							{/if}
							<div class="card-head">
								<h3>{project.name}</h3>
								{#if project.status}<span class="status">{project.status}</span>{/if}
							</div>
							{#if project.sketch}<span class="sketch">{project.sketch}</span>{/if}
							<p>{project.desc}</p>
							{#if project.url}
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="card-link">{m.exp_visit()} →</a>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

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
		background: rgba(251, 241, 236, 0.9);
		backdrop-filter: blur(8px);
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
	}
	.back {
		font-size: 0.82rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.15s;
	}
	.back:hover {
		color: var(--btb-steel);
	}
	.hero {
		padding: 70px 0 40px;
	}
	.kick {
		font-family: var(--ff-ui);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--btb-steel);
		margin-bottom: 14px;
	}
	.hero h1 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1.05;
		color: var(--text-heading);
		max-width: 720px;
	}
	.intro {
		margin-top: 18px;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text-secondary);
		max-width: 640px;
	}
	.block {
		padding: 48px 0 60px;
	}
	.block-alt {
		background: var(--bg-section-alt);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}
	.block-title {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 1.6rem;
		color: var(--text-heading);
		margin-bottom: 28px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 22px;
	}
	.card {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 28px;
		box-shadow: 0 18px 40px -34px rgba(120, 20, 40, 0.28);
		display: flex;
		flex-direction: column;
	}
	.card-img {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-radius: 8px;
		margin-bottom: 16px;
		transition: filter 0.12s steps(2);
	}
	/* Pixel-Effekt beim Hover */
	.card:hover .card-img {
		filter: url(#pixelate);
	}

	/* ═══════ 8-BIT-MODUS (Konami-Code) ═══════ */
	.is-8bit .card-img {
		filter: url(#pixelate);
		image-rendering: pixelated;
	}
	.is-8bit .hero h1,
	.is-8bit .block-title,
	.is-8bit .card h3,
	.is-8bit .kick {
		font-family: var(--ff-mono, monospace);
		letter-spacing: 0;
	}
	.is-8bit .sketch {
		font-family: var(--ff-mono, monospace);
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
	@media (prefers-reduced-motion: reduce) {
		.card-img {
			transition: none;
		}
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.card h3 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 1.2rem;
		color: var(--text-heading);
	}
	.status {
		flex-shrink: 0;
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--btb-teal-subtle);
		color: var(--btb-steel);
	}
	.sketch {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1.15rem;
		color: var(--btb-steel);
		margin: 6px 0 10px;
	}
	.card p {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-bottom: 10px;
	}
	.card p:last-of-type {
		margin-bottom: 0;
	}
	.card-link {
		display: inline-block;
		margin-top: auto;
		padding-top: 16px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
		transition: color 0.15s;
	}
	.card-link:hover {
		color: var(--btb-steel-hover);
	}
	@media (max-width: 560px) {
		.wrap {
			padding: 0 18px;
		}
		.subbar {
			padding: 14px 18px;
		}
	}
</style>
