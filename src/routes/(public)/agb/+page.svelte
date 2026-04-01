<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>Allgemeine Geschäftsbedingungen — Break the Box</title>
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
		<h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
		<p class="legal-intro">Stand: April 2026</p>

		<section>
			<h2>1. Geltungsbereich</h2>
			<p>
				Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Geschäftsbeziehungen zwischen der Break the Box GmbH (nachfolgend «Anbieterin») und ihren Kundinnen und Kunden (nachfolgend «Auftraggebende»). Abweichende Bedingungen bedürfen der schriftlichen Zustimmung der Anbieterin.
			</p>
		</section>

		<section>
			<h2>2. Leistungen</h2>
			<p>
				Die Anbieterin erbringt Beratungsleistungen in den Bereichen IT-Strategie, Digitalisierung, IT-Governance, KI-Beratung sowie Lehre und Workshops. Der genaue Leistungsumfang wird im jeweiligen Angebot oder Vertrag festgelegt.
			</p>
		</section>

		<section>
			<h2>3. Angebote und Vertragsschluss</h2>
			<p>
				Angebote der Anbieterin sind freibleibend und unverbindlich, sofern sie nicht ausdrücklich als verbindlich gekennzeichnet sind. Ein Vertrag kommt zustande durch schriftliche Auftragsbestätigung oder durch Beginn der Leistungserbringung.
			</p>
		</section>

		<section>
			<h2>4. Honorare und Zahlungsbedingungen</h2>
			<p>
				Die Honorare richten sich nach dem vereinbarten Angebot. Sofern nicht anders vereinbart, gelten folgende Bedingungen:
			</p>
			<ul>
				<li>Rechnungen sind innert 30 Tagen netto zahlbar.</li>
				<li>Bei Verzug wird ein Verzugszins von 5% p.a. berechnet.</li>
				<li>Reise- und Auslagenkosten werden separat in Rechnung gestellt, sofern vorgängig vereinbart.</li>
				<li>Alle Preise verstehen sich exkl. MwSt., sofern nicht anders angegeben.</li>
			</ul>
		</section>

		<section>
			<h2>5. Mitwirkungspflichten</h2>
			<p>
				Die Auftraggebenden stellen der Anbieterin rechtzeitig alle für die Leistungserbringung erforderlichen Unterlagen, Informationen und Zugänge zur Verfügung. Verzögerungen durch fehlende Mitwirkung gehen nicht zu Lasten der Anbieterin.
			</p>
		</section>

		<section>
			<h2>6. Geistiges Eigentum</h2>
			<p>
				Sämtliche Arbeitsergebnisse, die im Rahmen eines Auftrags erstellt werden, gehen nach vollständiger Bezahlung in das Eigentum der Auftraggebenden über — mit Ausnahme von Methoden, Frameworks und Werkzeugen, die zum allgemeinen Know-how der Anbieterin gehören.
			</p>
			<p>
				Die Anbieterin behält sich das Recht vor, die Zusammenarbeit in anonymisierter Form als Referenz zu verwenden, sofern keine anderslautende Vereinbarung besteht.
			</p>
		</section>

		<section>
			<h2>7. Vertraulichkeit</h2>
			<p>
				Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei nicht an Dritte weiterzugeben und ausschliesslich für die Zwecke des Auftrags zu verwenden. Diese Pflicht besteht auch nach Beendigung des Vertragsverhältnisses fort.
			</p>
		</section>

		<section>
			<h2>8. Haftung</h2>
			<p>
				Die Anbieterin haftet für direkte Schäden, die durch grobe Fahrlässigkeit oder Vorsatz verursacht werden. Die Haftung für indirekte Schäden, entgangenen Gewinn und Folgeschäden ist ausgeschlossen. Die Haftung ist in jedem Fall auf die Höhe des jeweiligen Auftragshonorars beschränkt.
			</p>
		</section>

		<section>
			<h2>9. Kündigung</h2>
			<p>
				Beide Parteien können laufende Aufträge unter Einhaltung einer Frist von 30 Tagen schriftlich kündigen. Bereits erbrachte Leistungen werden in Rechnung gestellt. Bei wichtigem Grund ist eine fristlose Kündigung möglich.
			</p>
		</section>

		<section>
			<h2>10. Anwendbares Recht und Gerichtsstand</h2>
			<p>
				Es gilt ausschliesslich schweizerisches Recht. Gerichtsstand ist Bern, Schweiz.
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
