<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import SubpageBrand from '$lib/components/ui/SubpageBrand.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';

	const punkte = [
		{
			title: 'Die unbequemen Fragen',
			text: 'Ich stelle die Fragen, die im Raum fehlen — bevor sie teuer werden. Betriebswirtschaft auf GL-Niveau, Governance und digitale Urteilskraft. Kein Ja-Sager.'
		},
		{
			title: 'In Vorleistung',
			text: 'Ich gehe in Vorleistung und bleibe dran, bis es stimmt. Vorlagen, die entscheidungsreif sind; Traktanden, die Wirkung haben — nicht Technik-Show.'
		},
		{
			title: 'Substanz statt Hype',
			text: 'Ich baue KI-Systeme selbst und betreibe sie im Alltag. Empfehlungen aus Erprobtem, nicht aus Annahmen — das bewahrt Gremien vor teuren Fehlentscheiden.'
		}
	];

	const mandate = [
		{ org: 'Nexplore AG', role: 'Verwaltungsratspräsidentin' },
		{ org: 'GVB Gebäudeversicherung Bern', role: 'Verwaltungsrätin' },
		{ org: 'AKB/IVBE', role: 'Verwaltungsrätin' }
	];
</script>

<svelte:head>
	<title>Verwaltungsrat — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Digitale Urteilskraft dauerhaft im Gremium: Brigitte Hulliger als Verwaltungsrätin — IT und KI auf der Wirkungsseite, Verantwortung nach OR 716a."
	/>
</svelte:head>

<div class="sub">
	<ScrollProgress />
	<header class="subbar">
		<SubpageBrand subtitle="Verwaltungsrat" />
		<a href={localizeHref('/')} class="back">← Zur Startseite</a>
	</header>

	<section class="hero">
		<div class="wrap">
			<div class="kick">VR- / Aufsichtsmandat</div>
			<h1>Digitale Urteilskraft im Gremium.</h1>
			<p class="intro">
				Die Oberleitung der Gesellschaft ist unübertragbar (OR 716a) — auch dort, wo es um IT und KI geht. Genau dort setze ich an: dauerhaft im Gremium, nicht als Projekt. IT auf der Wirkungsseite, nicht als Kostenblock.
			</p>
		</div>
	</section>

	<section class="block">
		<div class="wrap">
			<div class="cards">
				{#each punkte as p}
					<div class="card">
						<h3>{p.title}</h3>
						<p>{p.text}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="block block-alt">
		<div class="wrap">
			<div class="grouplbl">Aktuelle Mandate</div>
			<div class="mandate">
				{#each mandate as md}
					<div class="mandat">
						<span class="mandat-org">{md.org}</span>
						<span class="mandat-role">{md.role}</span>
					</div>
				{/each}
			</div>
			<p class="note">
				Dazu Dozentin an der Berner Fachhochschule — und im <a href={localizeHref('/experimentierraum')}>Experimentierraum</a> baue ich selbst, worüber andere nur lesen.
			</p>
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
		padding: 64px 0 34px;
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
		max-width: 64ch;
		margin: 0;
		line-height: 1.65;
	}
	.block {
		padding: 26px 0 56px;
	}
	.block-alt {
		background: var(--bg-section-alt);
		padding: 44px 0 56px;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}
	.card {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		padding: 26px 26px 28px;
	}
	.card h3 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 21px;
		margin: 0 0 10px;
		color: var(--text-heading);
	}
	.card p {
		font-size: 14px;
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0;
	}
	.grouplbl {
		font-family: var(--ff-ui);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 11px;
		font-weight: 700;
		color: var(--btb-steel);
		margin-bottom: 16px;
	}
	.mandate {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
	}
	.mandat {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 18px 20px;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.mandat-org {
		font-weight: 700;
		font-size: 15px;
		color: var(--text-heading);
	}
	.mandat-role {
		font-size: 13px;
		color: var(--text-secondary);
	}
	.note {
		font-size: 14px;
		color: var(--text-secondary);
		margin: 20px 0 0;
		max-width: 64ch;
	}
	.note a {
		color: var(--btb-steel);
		font-weight: 600;
		text-decoration: none;
	}
	.note a:hover {
		text-decoration: underline;
	}
	@media (max-width: 820px) {
		.cards,
		.mandate {
			grid-template-columns: 1fr;
		}
	}
</style>
