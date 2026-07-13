<script lang="ts">
	import type { GovernanceContent } from '$lib/types/content';
	import AdminAccordionItem from '$lib/components/ui/AdminAccordionItem.svelte';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<GovernanceContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	let expContrib = $state<number | null>(0);
	let expRows = $state<number | null>(null);
	let expMandate = $state<number | null>(null);
	let expFaq = $state<number | null>(null);

	// Dossier-PDF hochladen/ersetzen
	let dossierUploading = $state(false);
	let dossierError = $state('');
	async function uploadDossier(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		dossierUploading = true;
		dossierError = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('section', 'governance-dossier');
			const res = await fetch('/api/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				const d = await res.json().catch(() => ({ message: 'Upload fehlgeschlagen.' }));
				throw new Error(d.message ?? `Fehler ${res.status}`);
			}
			const d = await res.json();
			content.cta.dark.dossierUrl = d.url;
		} catch (err) {
			dossierError = err instanceof Error ? err.message : 'Upload fehlgeschlagen.';
		} finally {
			dossierUploading = false;
			input.value = '';
		}
	}

	let serialized = $derived(JSON.stringify(content));

	function move<T>(arr: T[], i: number, dir: -1 | 1): number {
		const t = i + dir;
		if (t < 0 || t >= arr.length) return i;
		[arr[i], arr[t]] = [arr[t], arr[i]];
		return t;
	}

	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			saving = false;
			setTimeout(() => (showSuccess = false), 3000);
		}
		if (form?.error) saving = false;
	});
</script>

<svelte:head>
	<title>Governance — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Governance</h1>
		<p class="page-subtitle">Die Dossier-Seite «Governance» (Verwaltungs-, Stiftungs- & Aufsichtsrat) — Hero, Der leere Stuhl, Beiträge, Kompetenz-Matrix, Mandate, Haltung und CTA. Jede Sektion lässt sich ein- und ausklappen. In Feldern mit dem Hinweis setzt <code class="hint-code">**Wort**</code> ein Wort in der Akzentfarbe.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={serialized} />

		<!-- Hero -->
		<details class="card" open>
			<summary class="card-head"><h2>Hero</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="h-kick">Kicker</label><input id="h-kick" type="text" class="field-input" bind:value={content.hero.kicker} /></div>
				<div class="field"><label class="field-label" for="h-title">Titel <span class="field-hint">**Wort** = Akzent</span></label><textarea id="h-title" class="field-textarea" rows="2" bind:value={content.hero.title}></textarea></div>
				<div class="field"><label class="field-label" for="h-sub">Subline <span class="field-hint">**Wort** = Akzent</span></label><textarea id="h-sub" class="field-textarea" rows="3" bind:value={content.hero.subline}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="h-c1">Button primär</label><input id="h-c1" type="text" class="field-input" bind:value={content.hero.ctaPrimary} /></div>
					<div class="field"><label class="field-label" for="h-c2">Button sekundär</label><input id="h-c2" type="text" class="field-input" bind:value={content.hero.ctaSecondary} /></div>
				</div>
			</div>
		</details>

		<!-- Der leere Stuhl -->
		<details class="card">
			<summary class="card-head"><h2>Der leere Stuhl</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="ch-kick">Kicker</label><input id="ch-kick" type="text" class="field-input" bind:value={content.chair.kicker} /></div>
				<div class="field"><label class="field-label" for="ch-big">Grosse Aussage <span class="field-hint">*Text* = kursiv im Akzent</span></label><textarea id="ch-big" class="field-textarea" rows="3" bind:value={content.chair.big}></textarea></div>
				<div class="field"><label class="field-label" for="ch-small">Ergänzung</label><textarea id="ch-small" class="field-textarea" rows="3" bind:value={content.chair.small}></textarea></div>
			</div>
		</details>

		<!-- Beiträge -->
		<details class="card">
			<summary class="card-head"><h2>Was ich an den Tisch bringe</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="co-kick">Kicker</label><input id="co-kick" type="text" class="field-input" bind:value={content.contributions.kicker} /></div>
				<div class="field"><label class="field-label" for="co-title">Titel</label><input id="co-title" type="text" class="field-input" bind:value={content.contributions.title} /></div>
				<div class="field"><label class="field-label" for="co-lead">Lead</label><input id="co-lead" type="text" class="field-input" bind:value={content.contributions.lead} /></div>

				<div class="items">
					{#each content.contributions.items as item, i}
						<AdminAccordionItem
							index={i}
							total={content.contributions.items.length}
							title={item.title || 'Neuer Beitrag'}
							expanded={expContrib === i}
							removeLabel="Beitrag löschen"
							ontoggle={() => (expContrib = expContrib === i ? null : i)}
							onmoveup={() => (expContrib = move(content.contributions.items, i, -1))}
							onmovedown={() => (expContrib = move(content.contributions.items, i, 1))}
							onremove={() => content.contributions.items.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="cot-{i}">Titel</label><input id="cot-{i}" type="text" class="field-input" bind:value={item.title} /></div>
							<div class="field"><label class="field-label" for="cox-{i}">Text</label><textarea id="cox-{i}" class="field-textarea" rows="3" bind:value={item.text}></textarea></div>
							<div class="field-row">
								<div class="field"><label class="field-label" for="coel-{i}">Beispiel-Label <span class="field-hint">z.B. «Im Alltag»</span></label><input id="coel-{i}" type="text" class="field-input" bind:value={item.exampleLabel} /></div>
								<div class="field"><label class="field-label" for="cou-{i}">Link <span class="field-hint">optional — macht Beispiel klickbar</span></label><input id="cou-{i}" type="text" class="field-input" bind:value={item.url} placeholder="https://…" /></div>
							</div>
							<div class="field"><label class="field-label" for="coe-{i}">Beispiel-Text</label><input id="coe-{i}" type="text" class="field-input" bind:value={item.example} /></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.contributions.items.push({ title: '', text: '', exampleLabel: '', example: '', url: '' }); expContrib = content.contributions.items.length - 1; }}>+ Beitrag hinzufügen</button>
			</div>
		</details>

		<!-- Kompetenz-Matrix -->
		<details class="card">
			<summary class="card-head"><h2>Kompetenz-Matrix</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="ma-kick">Kicker</label><input id="ma-kick" type="text" class="field-input" bind:value={content.matrix.kicker} /></div>
				<div class="field"><label class="field-label" for="ma-title">Titel</label><input id="ma-title" type="text" class="field-input" bind:value={content.matrix.title} /></div>
				<div class="field"><label class="field-label" for="ma-lead">Lead</label><input id="ma-lead" type="text" class="field-input" bind:value={content.matrix.lead} /></div>

				<h3 class="sub">Zeilen (Abdeckung 0–3)</h3>
				<div class="items">
					{#each content.matrix.rows as row, i}
						<AdminAccordionItem
							index={i}
							total={content.matrix.rows.length}
							title={row.label || 'Neue Zeile'}
							subtitle={`Abdeckung ${row.level}/3${row.highlight ? ' · hervorgehoben' : ''}`}
							expanded={expRows === i}
							removeLabel="Zeile löschen"
							ontoggle={() => (expRows = expRows === i ? null : i)}
							onmoveup={() => (expRows = move(content.matrix.rows, i, -1))}
							onmovedown={() => (expRows = move(content.matrix.rows, i, 1))}
							onremove={() => content.matrix.rows.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="mrl-{i}">Label</label><input id="mrl-{i}" type="text" class="field-input" bind:value={row.label} /></div>
								<div class="field field-narrow"><label class="field-label" for="mrv-{i}">Abdeckung</label><input id="mrv-{i}" type="number" min="0" max="3" class="field-input" bind:value={row.level} /></div>
							</div>
							<label class="check"><input type="checkbox" bind:checked={row.highlight} /> Als «die Zeile, die oft fehlt» hervorheben</label>
							{#if row.highlight}
								<div class="field"><label class="field-label" for="mrn-{i}">Hervorhebungs-Zusatz</label><input id="mrn-{i}" type="text" class="field-input" bind:value={row.note} placeholder="die Zeile, die oft fehlt" /></div>
							{/if}
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.matrix.rows.push({ label: '', level: 0 }); expRows = content.matrix.rows.length - 1; }}>+ Zeile hinzufügen</button>

				<h3 class="sub">Facts (Ausbildung / Praxis)</h3>
				{#each content.matrix.facts as fact, i}
					<div class="row-inline">
						<input type="text" class="field-input" bind:value={fact.label} placeholder="Label" />
						<input type="text" class="field-input" bind:value={fact.value} placeholder="Wert" />
						<button type="button" class="icon-btn danger" onclick={() => content.matrix.facts.splice(i, 1)} title="Entfernen" aria-label="Fact entfernen">✕</button>
					</div>
				{/each}
				<button type="button" class="btn-add btn-add-sm" onclick={() => content.matrix.facts.push({ label: '', value: '' })}>+ Fact hinzufügen</button>

				<div class="field"><label class="field-label" for="ma-note">Fussnote</label><textarea id="ma-note" class="field-textarea" rows="2" bind:value={content.matrix.note}></textarea></div>
			</div>
		</details>

		<!-- Mandate -->
		<details class="card">
			<summary class="card-head"><h2>Mandate</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="md-kick">Kicker</label><input id="md-kick" type="text" class="field-input" bind:value={content.mandates.kicker} /></div>
				<div class="field"><label class="field-label" for="md-title">Titel</label><input id="md-title" type="text" class="field-input" bind:value={content.mandates.title} /></div>
				<div class="field"><label class="field-label" for="md-lead">Lead</label><input id="md-lead" type="text" class="field-input" bind:value={content.mandates.lead} /></div>

				<div class="items">
					{#each content.mandates.items as mandate, i}
						<AdminAccordionItem
							index={i}
							total={content.mandates.items.length}
							title={mandate.org || 'Neues Mandat'}
							subtitle={mandate.role || undefined}
							expanded={expMandate === i}
							removeLabel="Mandat löschen"
							ontoggle={() => (expMandate = expMandate === i ? null : i)}
							onmoveup={() => (expMandate = move(content.mandates.items, i, -1))}
							onmovedown={() => (expMandate = move(content.mandates.items, i, 1))}
							onremove={() => content.mandates.items.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="mdo-{i}">Organisation</label><input id="mdo-{i}" type="text" class="field-input" bind:value={mandate.org} /></div>
								<div class="field"><label class="field-label" for="mdr-{i}">Rolle</label><input id="mdr-{i}" type="text" class="field-input" bind:value={mandate.role} /></div>
							</div>
							<label class="check"><input type="checkbox" bind:checked={mandate.president} /> Präsidium hervorheben (★ + Akzentlinie)</label>
							<div class="field"><label class="field-label" for="mdd-{i}">Beschreibung <span class="field-hint">bitte inhaltlich verifizieren</span></label><textarea id="mdd-{i}" class="field-textarea" rows="2" bind:value={mandate.desc}></textarea></div>
							<div class="field"><label class="field-label" for="mdw-{i}">Website <span class="field-hint">optional — macht die Organisation klickbar</span></label><input id="mdw-{i}" type="text" class="field-input" bind:value={mandate.website} placeholder="https://…" /></div>
							<ImageUpload bind:value={mandate.logo} section="mandate-{i}" label="Logo (optional)" />
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.mandates.items.push({ org: '', role: 'Verwaltungsrätin', desc: '' }); expMandate = content.mandates.items.length - 1; }}>+ Mandat hinzufügen</button>

				<h3 class="sub">Auswahl-Prinzip</h3>
				<div class="field"><label class="field-label" for="md-pt">Aussage <span class="field-hint">**Wort** = Akzent</span></label><input id="md-pt" type="text" class="field-input" bind:value={content.mandates.principleTitle} /></div>
				<div class="field"><label class="field-label" for="md-px">Erläuterung</label><textarea id="md-px" class="field-textarea" rows="3" bind:value={content.mandates.principleText}></textarea></div>
			</div>
		</details>

		<!-- Haltung -->
		<details class="card">
			<summary class="card-head"><h2>Haltung</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="st-kick">Kicker</label><input id="st-kick" type="text" class="field-input" bind:value={content.stance.kicker} /></div>
				<div class="field"><label class="field-label" for="st-quote">Zitat</label><textarea id="st-quote" class="field-textarea" rows="2" bind:value={content.stance.quote}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="st-ct">Quelle-Text</label><input id="st-ct" type="text" class="field-input" bind:value={content.stance.citeText} /></div>
					<div class="field"><label class="field-label" for="st-cl">Link-Label</label><input id="st-cl" type="text" class="field-input" bind:value={content.stance.citeLinkLabel} /></div>
				</div>
				<div class="field"><label class="field-label" for="st-cu">Link-Ziel</label><input id="st-cu" type="text" class="field-input" bind:value={content.stance.citeUrl} placeholder="/manifest" /></div>
			</div>
		</details>

		<!-- CTA -->
		<details class="card">
			<summary class="card-head"><h2>CTA (zweigleisig)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<h3 class="sub">Dunkle Karte (Findungskommissionen)</h3>
				<div class="field"><label class="field-label" for="cd-t">Titel</label><input id="cd-t" type="text" class="field-input" bind:value={content.cta.dark.title} /></div>
				<div class="field"><label class="field-label" for="cd-x">Text</label><textarea id="cd-x" class="field-textarea" rows="2" bind:value={content.cta.dark.text}></textarea></div>
				<div class="field"><label class="field-label" for="cd-l">Button-Label</label><input id="cd-l" type="text" class="field-input" bind:value={content.cta.dark.ctaLabel} /></div>
				<div class="field">
					<span class="field-label">Dossier-PDF <span class="field-hint">Ziel des Buttons — im Backend ersetzbar</span></span>
					<div class="dossier-box">
						{#if content.cta.dark.dossierUrl}
							<a class="dossier-link" href={content.cta.dark.dossierUrl} target="_blank" rel="noopener noreferrer">Aktuelles PDF ansehen ↗</a>
						{:else}
							<span class="dossier-empty">Kein PDF hinterlegt</span>
						{/if}
						<label class="dossier-upload">
							<input type="file" accept="application/pdf" onchange={uploadDossier} hidden />
							<span class="btn-file">{dossierUploading ? 'Lädt…' : 'PDF ersetzen'}</span>
						</label>
					</div>
					{#if dossierError}<span class="dossier-err">{dossierError}</span>{/if}
				</div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="cd-e">E-Mail</label><input id="cd-e" type="text" class="field-input" bind:value={content.cta.dark.email} /></div>
					<div class="field"><label class="field-label" for="cd-p">Telefon</label><input id="cd-p" type="text" class="field-input" bind:value={content.cta.dark.phone} /></div>
				</div>

				<h3 class="sub">Helle Karte (direkter Austausch)</h3>
				<div class="field"><label class="field-label" for="cl-t">Titel</label><input id="cl-t" type="text" class="field-input" bind:value={content.cta.light.title} /></div>
				<div class="field"><label class="field-label" for="cl-x">Text</label><textarea id="cl-x" class="field-textarea" rows="2" bind:value={content.cta.light.text}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="cl-l">Button-Label</label><input id="cl-l" type="text" class="field-input" bind:value={content.cta.light.ctaLabel} /></div>
					<div class="field"><label class="field-label" for="cl-h">Button-Ziel</label><input id="cl-h" type="text" class="field-input" bind:value={content.cta.light.ctaHref} placeholder="mailto:…" /></div>
				</div>
			</div>
		</details>

		<!-- FAQ -->
		<details class="card">
			<summary class="card-head"><h2>Häufige Fragen</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<p class="card-note">Erscheint als «Kurz beantwortet» und speist die FAQ-Structured-Data (SEO/GEO).</p>
				<div class="items">
					{#each content.faq.items as item, i}
						<AdminAccordionItem
							index={i}
							total={content.faq.items.length}
							title={item.question || 'Neue Frage'}
							expanded={expFaq === i}
							removeLabel="Frage löschen"
							ontoggle={() => (expFaq = expFaq === i ? null : i)}
							onmoveup={() => (expFaq = move(content.faq.items, i, -1))}
							onmovedown={() => (expFaq = move(content.faq.items, i, 1))}
							onremove={() => content.faq.items.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="fq-{i}">Frage</label><input id="fq-{i}" type="text" class="field-input" bind:value={item.question} /></div>
							<div class="field"><label class="field-label" for="fa-{i}">Antwort</label><textarea id="fa-{i}" class="field-textarea" rows="3" bind:value={item.answer}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.faq.items.push({ question: '', answer: '' }); expFaq = content.faq.items.length - 1; }}>+ Frage hinzufügen</button>
			</div>
		</details>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</button>
		</div>
	</form>
</div>

<style>
	.editor-page {
		max-width: 820px;
	}
	.page-header {
		margin-bottom: var(--space-xl);
	}
	.page-header h1 {
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.page-subtitle {
		font-size: 0.92rem;
		color: var(--text-secondary);
	}
	.hint-code {
		font-family: var(--ff-mono);
		font-size: 0.8rem;
		background: var(--bg-elevated);
		padding: 1px 5px;
		border-radius: 4px;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: var(--space-md);
		transition: color 0.15s;
	}
	.back-link:hover {
		color: var(--btb-steel);
	}
	.toast {
		padding: 12px 20px;
		border-radius: var(--radius-sm);
		font-size: 0.88rem;
		font-weight: 500;
		margin-bottom: var(--space-lg);
	}
	.toast-success {
		background: var(--btb-teal-subtle);
		color: var(--btb-teal-dark);
		border: 1px solid var(--btb-teal);
	}
	.toast-error {
		background: rgba(251, 113, 133, 0.1);
		color: #be123c;
		border: 1px solid var(--color-error);
	}

	/* ─── Einklappbare Sektions-Cards ─── */
	.card {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		margin-bottom: 12px;
		overflow: hidden;
	}
	.card[open] {
		border-color: var(--btb-steel);
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 18px 24px;
		cursor: pointer;
		list-style: none;
		user-select: none;
	}
	.card-head::-webkit-details-marker {
		display: none;
	}
	.card-head:hover {
		background: var(--bg-elevated);
	}
	.card-head h2 {
		font-family: var(--ff-serif);
		font-size: 1.2rem;
		color: var(--text-heading);
		margin: 0;
	}
	.card-chevron {
		color: var(--text-muted);
		font-size: 0.9rem;
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.card[open] .card-chevron {
		transform: rotate(180deg);
	}
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 0 24px 22px;
		border-top: 1px solid var(--border);
		padding-top: 18px;
	}
	.sub {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		margin: 8px 0 0;
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.field-narrow {
		flex: 0 0 120px;
	}
	.field-row {
		display: flex;
		gap: 14px;
	}
	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.field-hint {
		font-weight: 400;
		color: var(--text-muted);
		font-size: 0.75rem;
		margin-left: 6px;
	}
	.field-input,
	.field-textarea {
		width: 100%;
		padding: 10px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
		color: var(--text-primary);
		font-size: 0.88rem;
		font-family: var(--ff-ui);
		box-sizing: border-box;
		transition: border-color 0.15s;
	}
	.field-input:focus,
	.field-textarea:focus {
		outline: none;
		border-color: var(--btb-steel);
	}
	.field-textarea {
		resize: vertical;
		line-height: 1.5;
	}
	.check {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--text-secondary);
		cursor: pointer;
	}

	/* Dossier-PDF-Upload */
	.dossier-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		padding: 12px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
	}
	.dossier-link {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
	}
	.dossier-link:hover {
		text-decoration: underline;
	}
	.dossier-empty {
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.dossier-upload {
		cursor: pointer;
	}
	.btn-file {
		display: inline-block;
		padding: 8px 16px;
		border-radius: var(--radius-button);
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		font-size: 0.82rem;
		font-weight: 600;
	}
	.dossier-upload:hover .btn-file {
		background: var(--btb-steel);
		color: #fff;
	}
	.dossier-err {
		font-size: 0.8rem;
		color: var(--color-error);
		margin-top: 6px;
	}

	.row-inline {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.icon-btn {
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		background: var(--bg-surface);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.85rem;
	}
	.icon-btn.danger:hover {
		border-color: var(--color-error);
		color: var(--color-error);
	}

	.btn-add {
		width: 100%;
		padding: 14px;
		border: 1.5px dashed var(--btb-steel);
		border-radius: var(--radius-card);
		background: none;
		color: var(--btb-steel);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-add:hover {
		background: var(--btb-steel-subtle);
	}
	.btn-add-sm {
		padding: 10px;
		font-size: 0.85rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		position: sticky;
		bottom: 0;
		padding: 14px 0;
		background: linear-gradient(transparent, var(--bg-page) 40%);
	}
	.btn-save {
		padding: 12px 32px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-size: 0.92rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-save:hover:not(:disabled) {
		background: var(--btb-steel-hover);
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	@media (max-width: 560px) {
		.field-row {
			flex-direction: column;
		}
	}
</style>
