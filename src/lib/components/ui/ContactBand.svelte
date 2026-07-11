<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	// Optionale Overrides aus der Sektions-Konfiguration (leer = Standardtexte).
	let { title, text }: { title?: string; text?: string } = $props();
</script>

<section class="contactband" id="kontakt">
	<div class="cb-in">
		<div>
			<h2 class="cb-title">{title || m.h_contact_title()}</h2>
			<div class="cb-ci">
				{text || m.h_contact_text()}
				<a href="mailto:info@breakthebox.ch">info@breakthebox.ch</a> ·
				<a href="tel:+41763092088">+41 76 309 20 88</a>
			</div>
		</div>
		<a class="cb-round" href="mailto:info@breakthebox.ch">{m.h_hero_cta()} →</a>
	</div>
</section>

<style>
	.contactband {
		background: var(--bg-section-alt);
	}
	.cb-in {
		max-width: 1180px;
		margin: 0 auto;
		padding: 60px 34px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		flex-wrap: wrap;
	}
	.cb-title {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: clamp(28px, 3.6vw, 42px);
		line-height: 1.04;
		max-width: 560px;
		color: var(--text-heading);
	}
	.cb-ci {
		margin-top: 14px;
		color: var(--text-secondary);
		font-size: 14px;
	}
	.cb-ci a {
		color: var(--btb-steel);
	}
	.cb-round {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 6px;
		width: 118px;
		height: 118px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--btb-steel);
		color: #fff;
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 11px;
		line-height: 1.2;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: none;
		transition: background 0.2s, transform 0.2s;
	}
	.cb-round:hover {
		background: var(--btb-steel-hover);
		transform: translateY(-2px);
	}
	@media (max-width: 560px) {
		.cb-in {
			padding: 38px 18px;
			flex-direction: column;
			align-items: flex-start;
			gap: 18px;
		}
	}
</style>
