<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import { getMenuTarget } from '$lib/config/menu-targets';
	import type { HeroEditorial } from '$lib/types/content';

	// Editorial-Hero: Split — Text links, vollflächiges Bild rechts, das bis an
	// den Seitenrand läuft. Zwei CTAs: ein gefüllter zum Kontakt, ein ruhiger
	// auf ein Ziel aus der Menü-Registry.
	let { content, image }: { content: HeroEditorial; image: string } = $props();

	// Der Hero steht nur auf der Startseite — Section-Ziele bleiben lokale Anker.
	function targetHref(id: string): string {
		const t = getMenuTarget(id);
		if (!t) return '';
		return t.kind === 'section' ? (t.anchor ?? '') : localizeHref(t.path ?? '/');
	}
	const secondaryHref = $derived(targetHref(content.ctaSecondaryTarget));
	const heroImage = $derived(content.image || image);
</script>

<header class="ehero">
	<div class="etext">
		{#if content.kicker}<div class="ekick">{content.kicker}</div>{/if}
		<h1 class="ehero-h1">{content.title}</h1>
		<p class="ehero-sub">{content.sub}</p>
		<div class="ecta">
			<a class="ebtn solid" href="#kontakt">{content.ctaPrimary}</a>
			{#if content.ctaSecondary && secondaryHref}
				<a class="ebtn ghost" href={secondaryHref}>{content.ctaSecondary}</a>
			{/if}
		</div>
	</div>
	<div class="eshot">
		<div class="eframe" aria-hidden="true"></div>
		<img src={heroImage} alt="" fetchpriority="high" decoding="async" />
		{#if content.imageCaption || content.imageKicker}
			<div class="elab">
				{#if content.imageKicker}<b>{content.imageKicker}</b>{/if}
				{#if content.imageCaption}<span>{content.imageCaption}</span>{/if}
				{#if content.imageMeta}<i>{content.imageMeta}</i>{/if}
			</div>
		{/if}
	</div>
</header>

<style>
	.ehero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: min(78vh, 660px);
		background: var(--cream);
		border-bottom: 1px solid var(--line);
	}
	.etext {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: clamp(48px, 6vw, 88px) clamp(26px, 4vw, 56px) clamp(48px, 6vw, 78px) max(34px, calc((100vw - 1180px) / 2 + 34px));
	}
	.ekick {
		font-family: var(--ff-kicker);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 11px;
		font-weight: 600;
		color: var(--red);
		margin-bottom: 26px;
	}
	.ehero-h1 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(38px, 5vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.02em;
		color: var(--ink);
		max-width: 14ch;
		/* Zeilenumbrüche aus dem Admin (Textarea) werden übernommen */
		white-space: pre-line;
		margin: 0;
	}
	.ehero-sub {
		font-size: clamp(16px, 1.4vw, 19px);
		line-height: 1.5;
		color: var(--dim);
		max-width: 36ch;
		margin: 28px 0 34px;
	}
	.ecta {
		display: flex;
		gap: 13px;
		flex-wrap: wrap;
	}
	.ebtn {
		display: inline-flex;
		align-items: center;
		font-family: var(--sans);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 14px 26px;
		border: 1px solid var(--red);
		border-radius: calc(6px * var(--round));
		transition: background 0.2s, color 0.2s, border-color 0.2s;
	}
	.ebtn.solid {
		background: var(--red);
		color: #fff;
	}
	.ebtn.solid:hover {
		background: var(--redd);
		border-color: var(--redd);
	}
	.ebtn.ghost {
		background: transparent;
		color: var(--redd);
	}
	.ebtn.ghost:hover {
		background: var(--pink);
	}

	/* ─── Bild: vollflächig bis an die Aussenkante ─── */
	.eshot {
		position: relative;
		overflow: hidden;
		min-height: 320px;
		background: linear-gradient(160deg, var(--cream2) 0%, var(--pink) 100%);
	}
	.eshot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	/* Eingerückter Innenrahmen — die Bildkante des Editorial-Looks. */
	.eframe {
		position: absolute;
		inset: 13px;
		border: 1px solid rgba(255, 255, 255, 0.32);
		border-radius: calc(6px * var(--round));
		pointer-events: none;
		z-index: 2;
	}
	.elab {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 2;
		padding: 15px 17px;
		max-width: 94%;
	}
	.elab b {
		display: block;
		width: max-content;
		font-family: var(--ff-kicker);
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		color: #fff;
		background: var(--red);
		border-radius: calc(3px * var(--round));
		padding: 5px 9px;
		margin-bottom: 8px;
	}
	.elab span {
		display: block;
		font-family: var(--serif);
		font-weight: 600;
		font-size: 15.5px;
		line-height: 1.2;
		color: #fff;
		text-shadow: 0 1px 14px rgba(0, 0, 0, 0.45);
	}
	.elab i {
		display: block;
		font-family: var(--ff-kicker);
		font-style: normal;
		font-size: 9.5px;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.82);
		margin-top: 6px;
	}

	@media (max-width: 900px) {
		.ehero {
			grid-template-columns: 1fr;
			min-height: 0;
		}
		.etext {
			padding: 44px 22px 38px;
		}
		.eshot {
			height: 58vh;
		}
	}
</style>
