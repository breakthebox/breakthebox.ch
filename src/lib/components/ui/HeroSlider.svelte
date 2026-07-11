<script lang="ts">
	import type { HeroSlider } from '$lib/types/content';

	let { content }: { content: HeroSlider } = $props();

	// Trenner-Position in % (linke Welt). Begrenzt, damit immer beide Welten sichtbar bleiben.
	let pos = $state(50);
	let dragging = $state(false);
	let interacted = $state(false); // nach erster Interaktion: Hinweis ausblenden
	let panel: HTMLDivElement | undefined = $state();

	const MIN = 12;
	const MAX = 88;

	function clamp(v: number): number {
		return Math.min(MAX, Math.max(MIN, v));
	}
	function posFromEvent(e: PointerEvent): number {
		if (!panel) return pos;
		const rect = panel.getBoundingClientRect();
		return clamp(((e.clientX - rect.left) / rect.width) * 100);
	}
	function onPointerDown(e: PointerEvent) {
		dragging = true;
		interacted = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		pos = posFromEvent(e);
	}
	function onPointerMove(e: PointerEvent) {
		if (dragging) pos = posFromEvent(e);
	}
	function onPointerUp() {
		dragging = false;
	}
	function onKeydown(e: KeyboardEvent) {
		interacted = true;
		if (e.key === 'ArrowLeft') {
			pos = clamp(pos - 5);
			e.preventDefault();
		} else if (e.key === 'ArrowRight') {
			pos = clamp(pos + 5);
			e.preventDefault();
		}
	}
</script>

<header class="whero">
	<!-- ─── Lead: asymmetrisch — Headline links, Tagline + CTA rechts ─── -->
	<div class="lead">
		<h1 class="whero-h1">
			<span class="h1-line">{content.titleLine1}</span><br />
			<span class="em">{content.titleAccent}</span>
		</h1>
		<div class="lead-side">
			<p class="whero-sub">{content.sub}</p>
		</div>
	</div>

	<!-- ─── Zwei-Welten-Panel: volle Breite (Desktop) ─── -->
	<div
		class="worlds"
		class:dragging
		role="group"
		aria-label="Vergleich der zwei Welten"
		bind:this={panel}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<!-- Linke Welt (dunkel), volle Breite unten -->
		<div class="world left">
			{#if content.left.image}
				<div class="world-img" style:background-image="url({content.left.image})"></div>
			{/if}
			<div class="world-body" class:faded={pos < 32}>
				<div class="world-kick">{content.left.kicker}</div>
				<h2 class="world-title">{content.left.title}</h2>
				<p class="world-text">{content.left.text}</p>
			</div>
		</div>
		<!-- Rechte Welt (Akzent), per clip-path freigelegt -->
		<div class="world right" style:clip-path="inset(0 0 0 {pos}%)">
			{#if content.right.image}
				<div class="world-img" style:background-image="url({content.right.image})"></div>
			{/if}
			<div class="world-body" class:faded={pos > 68}>
				<div class="world-kick">{content.right.kicker}</div>
				<h2 class="world-title">{content.right.title}</h2>
				<p class="world-text">{content.right.text}</p>
			</div>
		</div>
		<!-- Trenner + Griff -->
		<div class="divider" style:left="{pos}%" aria-hidden="true"></div>
		<button
			type="button"
			class="handle"
			style:left="{pos}%"
			role="slider"
			aria-label="Trenner zwischen den zwei Welten verschieben"
			aria-valuemin={MIN}
			aria-valuemax={MAX}
			aria-valuenow={Math.round(pos)}
			onkeydown={onKeydown}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
			</svg>
		</button>
		{#if content.hint}
			<div class="drag-hint" class:gone={interacted} style:left="{pos}%" aria-hidden="true">{content.hint}</div>
		{/if}
	</div>

	<!-- ─── Mobile: gestapelte Karten statt Slider ─── -->
	<div class="stack" aria-hidden="false">
		<div class="m-card dark">
			{#if content.left.image}
				<div class="m-img left" style:background-image="url({content.left.image})"></div>
			{/if}
			<div class="world-kick">{content.left.kicker}</div>
			<h2 class="world-title">{content.left.title}</h2>
			<p class="world-text">{content.left.text}</p>
		</div>
		<div class="m-vs" aria-hidden="true"><span>vs</span></div>
		<div class="m-card petrol">
			{#if content.right.image}
				<div class="m-img right" style:background-image="url({content.right.image})"></div>
			{/if}
			<div class="world-kick">{content.right.kicker}</div>
			<h2 class="world-title">{content.right.title}</h2>
			<p class="world-text">{content.right.text}</p>
		</div>
	</div>

	<div class="whero-foot">
		<div class="whero-caption">{content.caption} <span class="em">{content.captionAccent}</span></div>
	</div>
</header>

<style>
	.whero {
		background: var(--cream);
	}

	/* ─── Lead (asymmetrisch: 2 Spalten) ─── */
	/* 2/3 Headline, 1/3 Tagline — die kurze Tagline braucht wenig Platz,
	   die Headline soll möglichst nicht umbrechen. */
	.lead {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 44px;
		align-items: center;
		max-width: 1180px;
		margin: 0 auto;
		padding: 44px 34px 36px;
	}
	.whero-h1 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(34px, 4vw, 58px);
		line-height: 1.05;
		letter-spacing: -0.01em;
		color: var(--ink);
		margin: 0;
	}
	/* Zeilenumbrüche aus dem Admin (Textarea) werden übernommen */
	.h1-line {
		white-space: pre-line;
	}
	.em {
		color: var(--red);
	}
	.lead-side {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
		padding-left: 18px;
		border-left: 3px solid var(--red);
	}
	.whero-sub {
		font-size: 15px;
		line-height: 1.6;
		color: var(--dim);
		max-width: 42ch;
		margin: 0;
	}

	/* ─── Panel (volle Breite) ─── */
	.worlds {
		position: relative;
		height: clamp(420px, 58vh, 580px);
		overflow: hidden;
		touch-action: none;
		cursor: col-resize;
		user-select: none;
		-webkit-user-select: none;
	}
	.world {
		position: absolute;
		inset: 0;
		color: #fff;
	}
	/* Basis-Verläufe; ein gesetztes Bild legt sich als .world-img darüber. */
	.world.left {
		background: radial-gradient(120% 130% at 20% 0%, color-mix(in srgb, var(--ink) 72%, #6b7280) 0%, var(--ink) 58%, #14090b 115%);
	}
	.world.right {
		background: radial-gradient(120% 130% at 80% 0%, color-mix(in srgb, var(--red) 62%, #d9f2f0) 0%, var(--red) 55%, var(--redd) 115%);
	}
	/* Bild: leicht entsättigt + Farbwäsche der jeweiligen Welt (statt Multiply-Schwärzung).
	   Aussen verankert, damit der sichtbare Ausschnitt beim Ziehen stabil bleibt.
	   Empfohlenes Bildformat: Querformat 2:1. */
	.world-img {
		position: absolute;
		inset: 0;
		background-size: cover;
		filter: saturate(0.55);
	}
	.world.left .world-img {
		background-position: left center;
	}
	.world.right .world-img {
		background-position: right center;
	}
	.world-img::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.world.left .world-img::after {
		background: color-mix(in srgb, var(--ink) 45%, transparent);
	}
	.world.right .world-img::after {
		background: color-mix(in srgb, var(--redd) 42%, transparent);
	}
	.world::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(10, 8, 8, 0.62) 0%, rgba(10, 8, 8, 0.12) 45%, rgba(10, 8, 8, 0) 70%);
		pointer-events: none;
	}
	.world-body {
		position: absolute;
		bottom: 34px;
		z-index: 1;
		max-width: min(40%, 440px);
		transition: opacity 0.3s ease;
	}
	.world.left .world-body {
		left: 44px;
		text-align: left;
	}
	.world.right .world-body {
		right: 44px;
		text-align: right;
	}
	.world-body.faded {
		opacity: 0;
	}
	.world-kick {
		font-family: var(--sans);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 11px;
		font-weight: 700;
		color: var(--pink);
		margin-bottom: 10px;
	}
	.world-title {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(24px, 2.6vw, 36px);
		line-height: 1.08;
		margin: 0 0 10px;
	}
	.world-text {
		font-family: var(--sans);
		font-size: 14px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.82);
		margin: 0;
	}

	/* ─── Trenner ─── */
	.divider {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: rgba(255, 255, 255, 0.85);
		transform: translateX(-1px);
		z-index: 2;
		pointer-events: none;
	}
	.handle {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: none;
		background: var(--cream);
		color: var(--ink);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: col-resize;
		z-index: 3;
		box-shadow: 0 6px 18px rgba(10, 8, 8, 0.35);
		transition: transform 0.15s ease;
	}
	.handle svg {
		width: 22px;
		height: 22px;
	}
	.handle:hover,
	.worlds.dragging .handle {
		transform: translate(-50%, -50%) scale(1.08);
	}
	.handle:focus-visible {
		outline: 3px solid var(--red);
		outline-offset: 2px;
	}
	.worlds:not(.dragging) .world.right {
		transition: clip-path 0.15s ease-out;
	}
	.worlds:not(.dragging) .divider,
	.worlds:not(.dragging) .handle {
		transition: left 0.15s ease-out, transform 0.15s ease;
	}
	/* Hinweis direkt unter dem Griff; verschwindet nach der ersten Interaktion. */
	.drag-hint {
		position: absolute;
		top: calc(50% + 44px);
		transform: translateX(-50%);
		z-index: 3;
		font-family: var(--sans);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 10.5px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.75);
		text-shadow: 0 1px 8px rgba(10, 8, 8, 0.6);
		white-space: nowrap;
		pointer-events: none;
		transition: opacity 0.4s ease;
	}
	.worlds:not(.dragging) .drag-hint {
		transition: left 0.15s ease-out, opacity 0.4s ease;
	}
	.drag-hint.gone {
		opacity: 0;
	}

	/* ─── Mobile-Stack (Desktop: versteckt) ─── */
	.stack {
		display: none;
	}
	.m-card {
		position: relative;
		margin: 0 16px;
		border-radius: 14px;
		min-height: 220px;
		padding: 22px 20px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		color: #fff;
		overflow: hidden;
	}
	.m-card.dark {
		background: radial-gradient(130% 140% at 20% 0%, color-mix(in srgb, var(--ink) 72%, #6b7280) 0%, var(--ink) 58%, #14090b 115%);
	}
	.m-card.petrol {
		background: radial-gradient(130% 140% at 80% 0%, color-mix(in srgb, var(--red) 62%, #d9f2f0) 0%, var(--red) 55%, var(--redd) 115%);
	}
	/* Bild auf der Karte: entsättigt + Farbwäsche, unten dunkler für den Text. */
	.m-img {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		filter: saturate(0.55);
	}
	.m-img::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.m-img.left::after {
		background:
			linear-gradient(to top, rgba(10, 8, 8, 0.55), rgba(10, 8, 8, 0.1) 60%),
			color-mix(in srgb, var(--ink) 45%, transparent);
	}
	.m-img.right::after {
		background:
			linear-gradient(to top, rgba(10, 8, 8, 0.55), rgba(10, 8, 8, 0.1) 60%),
			color-mix(in srgb, var(--redd) 42%, transparent);
	}
	.m-card > :not(.m-img) {
		position: relative;
		z-index: 1;
	}
	.m-card .world-title {
		font-size: 22px;
	}
	.m-card .world-text {
		font-size: 12.5px;
	}
	.m-vs {
		position: relative;
		text-align: center;
		margin: -14px 0;
		z-index: 2;
	}
	.m-vs span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--cream);
		border: 2px solid #fff;
		font-family: var(--serif);
		font-weight: 600;
		font-size: 14px;
		color: var(--ink);
		box-shadow: 0 4px 14px rgba(10, 8, 8, 0.25);
	}

	/* ─── Fusszeile ─── */
	.whero-foot {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 20px;
		max-width: 1180px;
		margin: 0 auto;
		padding: 20px 34px 30px;
	}
	.whero-caption {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(18px, 2vw, 22px);
		color: var(--ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.worlds .world.right,
		.worlds .divider,
		.worlds .handle,
		.world-body {
			transition: none;
		}
	}

	/* ─── Mobile: Slider weg, Karten gestapelt ─── */
	@media (max-width: 760px) {
		.lead {
			grid-template-columns: 1fr;
			gap: 20px;
			padding: 32px 22px 26px;
		}
		.worlds {
			display: none;
		}
		.stack {
			display: block;
		}
		.whero-foot {
			justify-content: center;
			padding: 18px 22px 26px;
		}
	}
</style>
