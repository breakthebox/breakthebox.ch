<script lang="ts">
	import { page } from '$app/state';
	import SiteNav from '$lib/components/ui/SiteNav.svelte';
	import { resolveMenuLinks } from '$lib/utils/menu';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';

	let { data } = $props();
	const navLinks = $derived(
		resolveMenuLinks(data.menu, { currentPath: page.url.pathname, isHome: false })
	);
</script>

<svelte:head>
	<title>Kontakt — Brigitte Hulliger | Break the Box</title>
	<meta
		name="description"
		content="Kontakt zu Brigitte Hulliger, Break the Box GmbH — IT-Strategie, Verwaltungsrat und KI. Per E-Mail oder Telefon."
	/>
</svelte:head>

<div class="sub">
	<SiteNav theme={data.theme} links={navLinks} subtitle="Kontakt" />

	<section class="hero">
		<div class="wrap">
			<div class="kick">Kontakt</div>
			<h1>Lass uns sprechen.</h1>
			<p class="intro">
				Ob Transformations-Mandat, Verwaltungsrat oder Keynote — das Erstgespräch ist unkompliziert und kostenlos. Ich freue mich auf das Gespräch.
			</p>

			<div class="channels">
				<a class="channel" href="mailto:info@breakthebox.ch">
					<span class="channel-label">E-Mail</span>
					<span class="channel-value">info@breakthebox.ch</span>
				</a>
				<a class="channel" href="tel:+41763092088">
					<span class="channel-label">Telefon</span>
					<span class="channel-value">+41 76 309 20 88</span>
				</a>
			</div>

			<p class="org">Break the Box GmbH · Kirchberg / Bern</p>
		</div>
	</section>

	<SiteFooter />
</div>

<style>
	.sub {
		background: var(--bg-page);
		color: var(--text-primary);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.wrap {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 34px;
	}
	.hero {
		flex: 1;
		padding: 72px 0 80px;
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
		font-size: clamp(36px, 5vw, 58px);
		line-height: 1.05;
		color: var(--text-heading);
		margin: 0 0 14px;
	}
	.intro {
		font-size: 16px;
		color: var(--text-secondary);
		max-width: 58ch;
		margin: 0 0 36px;
		line-height: 1.65;
	}
	.channels {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 320px));
		gap: 16px;
	}
	.channel {
		display: flex;
		flex-direction: column;
		gap: 4px;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		padding: 22px 24px;
		text-decoration: none;
		transition: border-color 0.15s, transform 0.15s;
	}
	.channel:hover {
		border-color: var(--btb-steel);
		transform: translateY(-2px);
	}
	.channel-label {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-weight: 700;
		color: var(--btb-steel);
	}
	.channel-value {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(17px, 2vw, 22px);
		color: var(--text-heading);
		word-break: break-word;
	}
	.org {
		margin: 30px 0 0;
		font-size: 13.5px;
		color: var(--text-muted);
	}
	@media (max-width: 640px) {
		.channels {
			grid-template-columns: 1fr;
		}
	}
</style>
