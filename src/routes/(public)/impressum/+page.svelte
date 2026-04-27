<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>Impressum — Break the Box</title>
	<meta name="description" content={m.meta_impressum_description()} />
</svelte:head>

<div class="legal-page">
	<nav class="legal-nav">
		<a href={localizeHref('/')} class="legal-nav-brand">
			<img src="/box.svg" alt="Break the Box" width="32" height="32" />
			<span>Break the Box</span>
		</a>
		<a href={localizeHref('/')} class="legal-nav-back">&larr; Zur Hauptseite</a>
	</nav>

	<article class="legal-content">
		<h1>Impressum</h1>

		<section>
			<h2>Kontakt</h2>
			<p>
				<strong>Break the Box GmbH</strong><br />
				Brigitte Hulliger<br />
				Mülibüüne 4<br />
				3422 Kirchberg<br />
				Schweiz
			</p>
			<p>
				E-Mail: <a href="mailto:info@breakthebox.ch">info@breakthebox.ch</a><br />
				Telefon: <a href="tel:+41763092088">+41 76 309 20 88</a>
			</p>
		</section>

		<section>
			<h2>Unternehmensangaben</h2>
			<p>
				Rechtsform: Gesellschaft mit beschränkter Haftung (GmbH)<br />
				UID: CHE-381.454.659<br />
				Handelsregister: Kanton Bern
			</p>
		</section>

		<section>
			<h2>Vertretungsberechtigte Person</h2>
			<p>Brigitte Hulliger, Geschäftsführerin</p>
		</section>

		<section>
			<h2>Haftungsausschluss</h2>
			<p>
				Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt. Die Break the Box GmbH übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte.
			</p>
			<p>
				Die Nutzung der Inhalte der Website erfolgt auf eigene Gefahr. Beiträge Dritter sind als solche gekennzeichnet. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.
			</p>
		</section>

		<section>
			<h2>Urheberrecht</h2>
			<p>
				Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der Break the Box GmbH.
			</p>
		</section>
	</article>

	<footer class="legal-footer">
		<a href={localizeHref('/')}>&larr; Zurück zur Hauptseite</a>
	</footer>
</div>

<style>
	.legal-page {
		max-width: 780px;
		margin: 0 auto;
		padding: 0 24px 80px;
	}

	.legal-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		margin-bottom: var(--space-xl);
	}

	.legal-nav-brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--text-heading);
	}

	.legal-nav-back {
		font-size: 0.85rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color var(--t-fast);
	}

	.legal-nav-back:hover {
		color: var(--btb-steel);
	}

	.legal-content h1 {
		font-size: 2rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: var(--space-xl);
	}

	.legal-content h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-heading);
		margin: 2rem 0 0.75rem;
	}

	.legal-content p {
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--text-primary);
		margin: 0.75rem 0;
	}

	.legal-content a {
		color: var(--btb-teal);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.legal-content section {
		margin-bottom: var(--space-lg);
	}

	.legal-footer {
		margin-top: var(--space-2xl);
		padding-top: var(--space-xl);
		border-top: 1px solid var(--border);
	}

	.legal-footer a {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
		transition: color var(--t-fast);
	}

	.legal-footer a:hover {
		color: var(--btb-steel-hover);
	}
</style>
