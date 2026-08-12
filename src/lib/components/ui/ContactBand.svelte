<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { buildSiteIdentity } from '$lib/config/site-identity';
	import type { SectionSetting } from '$lib/types/content';

	// Abschluss-Band: dunkle Fläche, grosse Anrede, darunter die Kontaktwege
	// als ruhige Spalten. Die Texte kommen aus der Sektion «Kontakt-Band»
	// (Admin → Sektionen) — sie werden im Root-Layout geladen und gelten
	// dadurch auf der Startseite wie auf jeder Unterseite gleich.
	const cfg = $derived((page.data as { kontakt?: SectionSetting }).kontakt);
	const kick = $derived(cfg?.hideKicker ? '' : cfg?.kicker || m.h_contact_label());
	const ttl = $derived(cfg?.hideTitle ? '' : cfg?.title || m.h_contact_title());
	const lead = $derived(cfg?.hideSubtitle ? '' : cfg?.subtitle || m.h_contact_text());

	const MAIL = 'info@breakthebox.ch';
	const PHONE = '+41 76 309 20 88';
	// LinkedIn kommt aus den Stammdaten, damit es nur an einer Stelle gepflegt wird.
	const LINKEDIN = buildSiteIdentity('').personSameAs[0];
</script>

<section class="contactband" id="kontakt">
	<div class="cb-in">
		{#if kick}<div class="cb-kick">{kick}</div>{/if}
		{#if ttl}<h2 class="cb-title">{ttl}</h2>{/if}
		{#if lead}<p class="cb-lead">{lead}</p>{/if}
		<div class="cb-details">
			<div class="cb-item">
				<span class="cb-label">{m.h_contact_mail()}</span>
				<a href="mailto:{MAIL}">{MAIL}</a>
			</div>
			<div class="cb-item">
				<span class="cb-label">{m.h_contact_phone()}</span>
				<a href="tel:{PHONE.replace(/\s/g, '')}">{PHONE}</a>
			</div>
			<div class="cb-item">
				<span class="cb-label">{m.h_contact_linkedin()}</span>
				<a href={LINKEDIN} target="_blank" rel="noopener noreferrer">Brigitte Hulliger</a>
			</div>
		</div>
	</div>
</section>

<style>
	.contactband {
		/* leichter Verlauf wie bei den übrigen Bändern */
		background: radial-gradient(120% 130% at 80% 0%, var(--inv-top) 0%, var(--inv-bg) 58%, var(--inv-deep) 118%);
		color: #fff;
	}
	.cb-in {
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(64px, 8vw, 110px) 34px clamp(56px, 7vw, 96px);
	}
	.cb-kick {
		font-family: var(--ff-kicker);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--inv-lum);
		margin-bottom: 22px;
	}
	.cb-title {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: clamp(46px, 8vw, 112px);
		line-height: 0.9;
		letter-spacing: -0.03em;
		color: #fff;
		margin: 0;
	}
	.cb-lead {
		font-size: clamp(16px, 1.4vw, 20px);
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.78);
		max-width: 44ch;
		margin: 26px 0 0;
	}
	.cb-details {
		display: flex;
		flex-wrap: wrap;
		gap: 18px clamp(28px, 5vw, 70px);
		margin-top: clamp(34px, 4vw, 46px);
		padding-top: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.28);
	}
	.cb-label {
		display: block;
		font-family: var(--ff-kicker);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-size: 10px;
		font-weight: 600;
		color: var(--inv-lum);
		margin-bottom: 7px;
	}
	.cb-item a {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(17px, 1.4vw, 21px);
		letter-spacing: -0.01em;
		color: #fff;
		text-decoration: none;
		transition: color 0.2s;
	}
	.cb-item a:hover {
		color: var(--inv-lum);
	}
	@media (max-width: 560px) {
		.cb-in {
			padding: 48px 18px 42px;
		}
		.cb-details {
			flex-direction: column;
			gap: 18px;
		}
	}
</style>
