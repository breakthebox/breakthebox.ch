<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>Datenschutzerklärung — Break the Box</title>
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
		<h1>Datenschutzerklärung</h1>
		<p class="legal-intro">Stand: April 2026</p>

		<section>
			<h2>1. Verantwortliche Stelle</h2>
			<p>
				<strong>Break the Box GmbH</strong><br />
				Brigitte Hulliger<br />
				Bernstrasse 130<br />
				3072 Ostermundigen<br />
				Schweiz
			</p>
			<p>E-Mail: <a href="mailto:hello@breakthebox.ch">hello@breakthebox.ch</a></p>
		</section>

		<section>
			<h2>2. Grundsätze der Datenverarbeitung</h2>
			<p>
				Wir verarbeiten personenbezogene Daten im Einklang mit dem Schweizer Datenschutzgesetz (DSG) und, soweit anwendbar, der EU-Datenschutz-Grundverordnung (DSGVO). Wir erheben nur Daten, die für die Nutzung unserer Website und unserer Dienstleistungen erforderlich sind.
			</p>
		</section>

		<section>
			<h2>3. Erfasste Daten</h2>
			<h3>3.1 Beim Besuch der Website</h3>
			<p>
				Bei jedem Zugriff auf unsere Website werden automatisch folgende Daten erfasst:
			</p>
			<ul>
				<li>IP-Adresse (anonymisiert)</li>
				<li>Datum und Uhrzeit des Zugriffs</li>
				<li>Aufgerufene Seite</li>
				<li>Browsertyp und -version</li>
				<li>Betriebssystem</li>
			</ul>
			<p>
				Diese Daten werden ausschliesslich für die technische Bereitstellung der Website und zur Sicherstellung der Systemsicherheit verwendet. Eine Zuordnung zu einzelnen Personen findet nicht statt.
			</p>

			<h3>3.2 Blog-Statistiken</h3>
			<p>
				Für die Anzeige von Besucherzahlen auf Blogbeiträgen wird ein anonymisierter Hash aus IP-Adresse und User-Agent erstellt. Dieser Hash lässt keinen Rückschluss auf einzelne Personen zu und wird nicht mit anderen Daten verknüpft.
			</p>

			<h3>3.3 Kontaktaufnahme</h3>
			<p>
				Wenn Sie uns per E-Mail oder Telefon kontaktieren, werden die von Ihnen mitgeteilten Daten (Name, E-Mail-Adresse, Inhalt der Anfrage) zum Zweck der Bearbeitung Ihrer Anfrage gespeichert. Diese Daten werden nicht ohne Ihre Einwilligung weitergegeben.
			</p>
		</section>

		<section>
			<h2>4. Authentifizierung</h2>
			<p>
				Für den geschützten Bereich unserer Website nutzen wir Auth0 als Authentifizierungsdienst. Bei der Anmeldung werden folgende Daten verarbeitet:
			</p>
			<ul>
				<li>E-Mail-Adresse</li>
				<li>Name</li>
				<li>Profilbild (sofern vom Anbieter bereitgestellt)</li>
			</ul>
			<p>
				Auth0 wird von Okta, Inc. betrieben. Weitere Informationen finden Sie in der <a href="https://auth0.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Auth0</a>.
			</p>
		</section>

		<section>
			<h2>5. Cookies</h2>
			<p>
				Unsere Website verwendet nur technisch notwendige Cookies:
			</p>
			<ul>
				<li><strong>Session-Cookie:</strong> Für die Aufrechterhaltung Ihrer Anmeldesitzung im geschützten Bereich.</li>
			</ul>
			<p>
				Wir verwenden keine Tracking-Cookies, keine Analyse-Tools von Drittanbietern und kein Remarketing.
			</p>
		</section>

		<section>
			<h2>6. Hosting</h2>
			<p>
				Unsere Website wird auf einem dedizierten Server in der Schweiz/Europa gehostet. Die Datenübertragung erfolgt SSL-verschlüsselt.
			</p>
		</section>

		<section>
			<h2>7. KI-Verarbeitung</h2>
			<p>
				Im Administrationsbereich nutzen wir KI-Dienste (Anthropic Claude) für die Unterstützung bei der Texterstellung und SEO-Analyse. Blog-Inhalte, die zur KI-Verarbeitung übermittelt werden, enthalten keine personenbezogenen Daten von Besucherinnen und Besuchern.
			</p>
		</section>

		<section>
			<h2>8. Ihre Rechte</h2>
			<p>Sie haben das Recht auf:</p>
			<ul>
				<li>Auskunft über Ihre gespeicherten Daten</li>
				<li>Berichtigung unrichtiger Daten</li>
				<li>Löschung Ihrer Daten</li>
				<li>Einschränkung der Verarbeitung</li>
				<li>Datenübertragbarkeit</li>
				<li>Widerspruch gegen die Verarbeitung</li>
			</ul>
			<p>
				Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter <a href="mailto:hello@breakthebox.ch">hello@breakthebox.ch</a>.
			</p>
		</section>

		<section>
			<h2>9. Änderungen</h2>
			<p>
				Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Die aktuelle Version ist auf dieser Seite verfügbar.
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
		margin-bottom: 0.5rem;
	}

	.legal-intro {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: var(--space-xl);
	}

	.legal-content h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-heading);
		margin: 2rem 0 0.75rem;
	}

	.legal-content h3 {
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--text-heading);
		margin: 1.25rem 0 0.5rem;
	}

	.legal-content p {
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--text-primary);
		margin: 0.75rem 0;
	}

	.legal-content ul {
		margin: 0.75rem 0;
		padding-left: 1.5rem;
	}

	.legal-content li {
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--text-primary);
		margin: 0.25rem 0;
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
