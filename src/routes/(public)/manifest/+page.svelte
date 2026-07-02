<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { renderMarkdown } from '$lib/utils/markdown';
	import SubpageBrand from '$lib/components/ui/SubpageBrand.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import type { ManifestContent } from '$lib/types/content';

	let { data } = $props();
	const manifest: ManifestContent = data.manifest;
	const platforms = data.platforms;
	const vrRoles = data.vrRoles;
	const qualifications = data.qualifications;
	const total = manifest.theses.length;

	let current = $state(0);

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}

	$effect(() => {
		// Reveal-Animationen (globale .reveal / .is-visible)
		const revealIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						revealIo.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
		);
		document.querySelectorAll('.reveal').forEach((el) => revealIo.observe(el));

		// Aktive These für den Zähler
		const acts = [...document.querySelectorAll<HTMLElement>('.act[data-idx]')];
		const activeIo = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) current = Number((entry.target as HTMLElement).dataset.idx);
				}
			},
			// Schmales Band in Viewport-Mitte: aktiv, sobald eine These die Mitte kreuzt —
			// unabhängig von der Sektionshöhe (feste 55% würden bei langen Thesen nie greifen).
			{ rootMargin: '-50% 0px -50% 0px' }
		);
		acts.forEach((a) => activeIo.observe(a));

		return () => {
			revealIo.disconnect();
			activeIo.disconnect();
		};
	});
</script>

<svelte:head>
	<title>{m.manifest_page_title()} — Brigitte Hulliger | Break the Box</title>
	<meta name="description" content={manifest.subtitle} />
</svelte:head>

<div class="mani">
	<ScrollProgress />

	<header class="subbar">
		<SubpageBrand subtitle="Manifest" />
		<a href={localizeHref('/')} class="back">← {m.manifest_back()}</a>
	</header>

	<div class="counter"><b>{pad(current)}</b> / {pad(total)}</div>

	<!-- Intro -->
	<section class="act act-intro" data-idx="0">
		<div class="inner reveal-stagger">
			<div class="kick reveal" style="--stagger: 0">{manifest.kicker}</div>
			<h1 class="serif reveal" style="--stagger: 1">{@html renderMarkdown(manifest.title)}</h1>
			<p class="lead reveal" style="--stagger: 2">{manifest.subtitle}</p>
			<div class="hint reveal" style="--stagger: 3"><span class="arr">↓</span> {m.manifest_scroll_hint()}</div>
		</div>
	</section>

	<!-- Thesen -->
	{#each manifest.theses as thesis, i}
		<section class="act" data-idx={i + 1}>
			<div class="inner reveal-stagger">
				<div class="thesis-num reveal" style="--stagger: 0">These {pad(i + 1)}</div>
				<h2 class="serif thesis reveal" style="--stagger: 1">{@html renderMarkdown(thesis.text)}</h2>
				{#if thesis.note}
					<p class="thesis-note reveal" style="--stagger: 2">{@html renderMarkdown(thesis.note)}</p>
				{/if}
			</div>
		</section>
	{/each}

	<!-- Roter Abschluss-Banner -->
	<section class="closing">
		<div class="inner reveal-stagger">
			<div class="kick kick-light reveal" style="--stagger: 0">{manifest.closingKicker}</div>
			<h2 class="serif reveal" style="--stagger: 1">{@html renderMarkdown(manifest.closingTitle)}</h2>

			<div class="proof-grid reveal" style="--stagger: 2">
				<div class="proof-col">
					<div class="proof-h">Eigener Experimentierraum</div>
					{#each platforms as p}
						<p class="proof-item"><strong>{p.name}</strong>{#if p.sketch} — {p.sketch}{/if}</p>
					{/each}
				</div>
				<div class="proof-col">
					<div class="proof-h">Ich sitze, wo entschieden wird</div>
					{#each vrRoles as role}
						<p class="proof-item"><strong>{role.org}</strong> — {role.title}</p>
					{/each}
				</div>
				<div class="proof-col">
					<div class="proof-h">Fundament</div>
					<p class="proof-item">{qualifications.join(' · ')}</p>
				</div>
			</div>

		</div>
	</section>

	<ContactBand />
	<SiteFooter />
</div>

<style>
	.mani {
		background: var(--bg-page);
		color: var(--text-primary);
		overflow-x: hidden;
	}

	/* Top-Bar */
	.subbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 34px;
		z-index: var(--z-sticky);
		mix-blend-mode: multiply;
	}
	.back {
		font-size: 0.8rem;
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

	/* Zähler */
	.counter {
		position: fixed;
		right: 28px;
		bottom: 24px;
		z-index: var(--z-sticky);
		font-family: var(--ff-mono, monospace);
		font-size: 12px;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}
	.counter b {
		color: var(--btb-steel);
	}

	/* Sektionen */
	.act {
		min-height: 88vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 120px 34px;
		border-bottom: 1px solid var(--border);
	}
	.act:nth-child(even) {
		background: var(--bg-section-alt);
	}
	.inner {
		max-width: 900px;
		margin: 0 auto;
		width: 100%;
	}
	.kick {
		font-family: var(--ff-ui);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--btb-steel);
		margin-bottom: 22px;
	}

	/* Intro */
	.act-intro h1 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(2.6rem, 6vw, 5rem);
		line-height: 1.02;
		letter-spacing: -0.01em;
		color: var(--text-heading);
	}
	.act-intro h1 :global(strong) {
		color: var(--btb-steel);
		font-weight: 600;
	}
	.lead {
		margin-top: 24px;
		font-size: clamp(1.05rem, 1.8vw, 1.3rem);
		line-height: 1.6;
		color: var(--text-secondary);
		max-width: 620px;
	}
	.hint {
		margin-top: 44px;
		font-family: var(--ff-sketch);
		font-size: 1.4rem;
		color: var(--btb-steel);
	}
	.arr {
		display: inline-block;
		animation: bob 1.6s ease-in-out infinite;
	}
	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(6px);
		}
	}

	/* Thesen */
	.thesis-num {
		font-family: var(--ff-mono, monospace);
		font-size: 0.82rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--btb-steel);
		margin-bottom: 24px;
	}
	.thesis {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(2.2rem, 5.2vw, 4.2rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
		color: var(--text-heading);
	}
	.thesis :global(strong) {
		color: var(--btb-steel);
		font-weight: 600;
	}
	.thesis-note {
		margin-top: 28px;
		font-size: clamp(1.05rem, 1.8vw, 1.35rem);
		line-height: 1.65;
		color: var(--text-secondary);
		max-width: 680px;
	}
	.thesis-note :global(strong) {
		color: var(--text-heading);
		font-weight: 600;
	}

	/* Roter Abschluss-Banner */
	.closing {
		background: var(--btb-steel);
		color: #fff;
		padding: 110px 34px;
	}
	.closing .kick-light {
		color: #ffd9d4;
	}
	.closing h2 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(2.2rem, 5vw, 4rem);
		line-height: 1.02;
		color: #fff;
	}
	.proof-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 34px;
		margin-top: 44px;
		padding-top: 40px;
		border-top: 1px solid rgba(255, 255, 255, 0.18);
	}
	.proof-h {
		font-family: var(--ff-ui);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.72rem;
		font-weight: 700;
		color: #ffd9d4;
		margin-bottom: 16px;
	}
	.proof-item {
		font-size: 0.95rem;
		line-height: 1.5;
		color: #ffe6e3;
		margin-bottom: 12px;
	}
	.proof-item:last-child {
		margin-bottom: 0;
	}
	.proof-item strong {
		color: #fff;
		font-weight: 600;
	}

	@media (max-width: 760px) {
		.proof-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
	@media (max-width: 560px) {
		.act {
			padding: 96px 20px;
			min-height: 82vh;
		}
		.subbar {
			padding: 14px 20px;
		}
		.closing {
			padding: 80px 20px;
		}
		.counter {
			right: 16px;
			bottom: 16px;
		}
	}
</style>
