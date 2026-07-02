<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import SubpageBrand from '$lib/components/ui/SubpageBrand.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import type { ReferenceProjectsContent } from '$lib/types/content';

	let { data } = $props();
	const content: ReferenceProjectsContent = data.content;

	let flipped = $state(content.items.map(() => false));
	function toggleFlip(i: number) {
		flipped[i] = !flipped[i];
	}
	function onCardKey(e: KeyboardEvent, i: number) {
		// Nur reagieren, wenn die Karte selbst fokussiert ist — sonst würde Enter
		// auf einem Link dessen Navigation blockieren und die Karte flippen.
		if (e.target !== e.currentTarget) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleFlip(i);
		}
	}
</script>

<svelte:head>
	<title>Referenzprojekte — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Ausgewählte Referenzprojekte von Brigitte Hulliger — Strategie, Governance und Umsetzung aus der Praxis."
	/>
</svelte:head>

<div class="sub">
	<ScrollProgress />
	<header class="subbar">
		<SubpageBrand subtitle="Referenzprojekte" />
		<a href={localizeHref('/')} class="back">← Zur Startseite</a>
	</header>

	<section class="hero">
		<div class="wrap">
			<div class="kick">Referenzprojekte</div>
			<h1>Substanz, die sich zeigen lässt.</h1>
			<p class="intro">
				Eine Auswahl aus Strategie, Governance und Umsetzung — dreh die Karten um für die Details.
			</p>
		</div>
	</section>

	<section class="block">
		<div class="wrap">
			<div class="grid">
				{#each content.items as item, i}
					<div
						class="rcard-flip"
						class:is-flipped={flipped[i]}
						role="button"
						tabindex="0"
						aria-label="{item.title} — Details ansehen"
						onclick={() => toggleFlip(i)}
						onkeydown={(e) => onCardKey(e, i)}
					>
						<div class="rcard-inner">
							<!-- Vorderseite -->
							<div class="rcard-face rcard-front">
								{#if item.image}
									<img src={item.image} alt={item.title} class="rcard-img" loading="lazy" />
								{/if}
								<h3>{item.title}</h3>
								{#if item.subtitle}<span class="rcard-sub">{item.subtitle}</span>{/if}
								<span class="rcard-hint">Details ansehen →</span>
							</div>
							<!-- Rückseite -->
							<div class="rcard-face rcard-back">
								<h3>{item.title}</h3>
								<p>{item.description}</p>
								{#if item.url}
									<a
										class="rcard-link"
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										onclick={(e) => e.stopPropagation()}>Mehr erfahren →</a
									>
								{/if}
								<span class="rcard-hint rcard-hint-back">← zurück</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
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
		padding: 20px 0 70px;
	}

	/* ═══════ Flip-Karten — 2 pro Reihe ═══════ */
	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 22px;
	}
	.rcard-flip {
		perspective: 1400px;
		min-height: 300px;
		cursor: pointer;
		border: none;
		background: none;
		text-align: left;
		border-radius: 16px;
	}
	.rcard-flip:focus-visible {
		outline: 2px solid var(--btb-steel);
		outline-offset: 3px;
	}
	.rcard-inner {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 300px;
		transition: transform 0.55s cubic-bezier(0.4, 0.1, 0.2, 1);
		transform-style: preserve-3d;
	}
	.rcard-flip.is-flipped .rcard-inner {
		transform: rotateY(180deg);
	}
	.rcard-face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		display: flex;
		flex-direction: column;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 28px;
		box-shadow: 0 18px 40px -34px rgba(120, 20, 40, 0.28);
	}
	.rcard-front h3,
	.rcard-back h3 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 1.25rem;
		color: var(--text-heading);
		line-height: 1.2;
	}
	.rcard-img {
		width: 100%;
		height: 130px;
		object-fit: cover;
		border-radius: 8px;
		margin-bottom: 16px;
	}
	.rcard-sub {
		display: block;
		margin-top: 8px;
		font-size: 0.82rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--btb-steel);
	}
	.rcard-hint {
		margin-top: auto;
		padding-top: 18px;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--btb-steel);
	}
	.rcard-back {
		transform: rotateY(180deg);
		overflow-y: auto;
	}
	.rcard-back p {
		margin-top: 12px;
		font-size: 0.92rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}
	.rcard-link {
		display: inline-block;
		margin-top: 14px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
	}
	.rcard-link:hover {
		color: var(--btb-steel-hover);
	}
	.rcard-hint-back {
		color: var(--text-muted);
	}

	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
		}
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
