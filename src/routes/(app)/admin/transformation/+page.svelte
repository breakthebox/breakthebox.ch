<script lang="ts">
	import type { TransformationContent } from '$lib/types/content';
	import AdminAccordionItem from '$lib/components/ui/AdminAccordionItem.svelte';

	let { data, form } = $props();
	let content = $state<TransformationContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	// Ein offener Index pro Liste (Single-Open-Accordion).
	let expMirror = $state<number | null>(null);
	let expSteps = $state<number | null>(0);
	let expCase = $state<number | null>(null);
	let expBound = $state<number | null>(null);
	let expFaq = $state<number | null>(null);

	// Leere Einträge (Tags, Erstgespräch-Schritte) erst beim Speichern trimmen.
	function cleaned(): TransformationContent {
		const c = structuredClone($state.snapshot(content)) as TransformationContent;
		c.steps.items = c.steps.items.map((s) => ({
			...s,
			tags: (s.tags ?? []).map((t) => t.trim()).filter(Boolean)
		}));
		c.contact.steps = (c.contact.steps ?? []).map((t) => t.trim()).filter(Boolean);
		return c;
	}
	let serialized = $derived(JSON.stringify(cleaned()));

	function move<T>(arr: T[], i: number, dir: -1 | 1): number {
		const t = i + dir;
		if (t < 0 || t >= arr.length) return i;
		[arr[i], arr[t]] = [arr[t], arr[i]];
		return t;
	}

	function tagsFromText(v: string): string[] {
		return v.split('\n');
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
	<title>Transformation — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Transformation</h1>
		<p class="page-subtitle">Die Service-Seite «Transformation» — Hero, Spiegel-Situationen, Drei-Stufen-Treppe, Wirkung, Beweis, Abgrenzung, Erstgespräch, FAQ und die MissGovern-Personalisierung. Jede Sektion lässt sich ein- und ausklappen. In Feldern mit dem Hinweis setzt <code class="hint-code">**Wort**</code> ein Wort in der Akzentfarbe.</p>
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
				<div class="field"><label class="field-label" for="h-title">Titel <span class="field-hint">**Wort** = Akzent</span></label><input id="h-title" type="text" class="field-input" bind:value={content.hero.title} /></div>
				<div class="field"><label class="field-label" for="h-sub">Subline</label><textarea id="h-sub" class="field-textarea" rows="3" bind:value={content.hero.subline}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="h-c1">Button primär</label><input id="h-c1" type="text" class="field-input" bind:value={content.hero.ctaPrimary} /></div>
					<div class="field"><label class="field-label" for="h-c2">Button sekundär</label><input id="h-c2" type="text" class="field-input" bind:value={content.hero.ctaSecondary} /></div>
				</div>
			</div>
		</details>

		<!-- Spiegel -->
		<details class="card">
			<summary class="card-head"><h2>Spiegel-Situationen</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="m-kick">Kicker</label><input id="m-kick" type="text" class="field-input" bind:value={content.mirror.kicker} /></div>
				<div class="field"><label class="field-label" for="m-title">Titel</label><input id="m-title" type="text" class="field-input" bind:value={content.mirror.title} /></div>
				<div class="field"><label class="field-label" for="m-lead">Lead</label><textarea id="m-lead" class="field-textarea" rows="2" bind:value={content.mirror.lead}></textarea></div>

				<div class="items">
					{#each content.mirror.situations as sit, i}
						<AdminAccordionItem
							index={i}
							total={content.mirror.situations.length}
							title={sit.quote || 'Neue Situation'}
							expanded={expMirror === i}
							removeLabel="Situation löschen"
							ontoggle={() => (expMirror = expMirror === i ? null : i)}
							onmoveup={() => (expMirror = move(content.mirror.situations, i, -1))}
							onmovedown={() => (expMirror = move(content.mirror.situations, i, 1))}
							onremove={() => content.mirror.situations.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="mq-{i}">Frage im Raum</label><textarea id="mq-{i}" class="field-textarea" rows="3" bind:value={sit.quote}></textarea></div>
							<div class="field"><label class="field-label" for="ma-{i}">Antwort / Einstieg <span class="field-hint">**Wort** = Akzent</span></label><input id="ma-{i}" type="text" class="field-input" bind:value={sit.answer} /></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.mirror.situations.push({ quote: '', answer: '' }); expMirror = content.mirror.situations.length - 1; }}>+ Situation hinzufügen</button>
			</div>
		</details>

		<!-- Treppe -->
		<details class="card">
			<summary class="card-head"><h2>Drei Stufen</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="s-kick">Kicker</label><input id="s-kick" type="text" class="field-input" bind:value={content.steps.kicker} /></div>
				<div class="field"><label class="field-label" for="s-title">Titel</label><input id="s-title" type="text" class="field-input" bind:value={content.steps.title} /></div>
				<div class="field"><label class="field-label" for="s-claim">Claim-Zeile <span class="field-hint">**Wort** = Akzent</span></label><textarea id="s-claim" class="field-textarea" rows="2" bind:value={content.steps.claim}></textarea></div>

				<div class="items">
					{#each content.steps.items as step, i}
						<AdminAccordionItem
							index={i}
							total={content.steps.items.length}
							title={step.title || 'Neue Stufe'}
							subtitle={step.no ? `${step.no} · ${step.durationTag}` : undefined}
							expanded={expSteps === i}
							removeLabel="Stufe löschen"
							ontoggle={() => (expSteps = expSteps === i ? null : i)}
							onmoveup={() => (expSteps = move(content.steps.items, i, -1))}
							onmovedown={() => (expSteps = move(content.steps.items, i, 1))}
							onremove={() => content.steps.items.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="sn-{i}">Nummer</label><input id="sn-{i}" type="text" class="field-input" bind:value={step.no} placeholder="01" /></div>
								<div class="field"><label class="field-label" for="sdt-{i}">Dauer-Tag <span class="field-hint">unter der Nummer</span></label><input id="sdt-{i}" type="text" class="field-input" bind:value={step.durationTag} placeholder="Tage" /></div>
							</div>
							<div class="field-row">
								<div class="field"><label class="field-label" for="st-{i}">Titel</label><input id="st-{i}" type="text" class="field-input" bind:value={step.title} /></div>
								<div class="field"><label class="field-label" for="sq-{i}">Frage</label><input id="sq-{i}" type="text" class="field-input" bind:value={step.question} /></div>
							</div>
							<div class="field"><label class="field-label" for="sd-{i}">Beschreibung</label><textarea id="sd-{i}" class="field-textarea" rows="3" bind:value={step.description}></textarea></div>
							<div class="field"><label class="field-label" for="stags-{i}">Themen-Tags <span class="field-hint">ein Tag pro Zeile</span></label><textarea id="stags-{i}" class="field-textarea" rows="4" value={step.tags.join('\n')} oninput={(e) => (step.tags = tagsFromText(e.currentTarget.value))}></textarea></div>
							<div class="field-row">
								<div class="field"><label class="field-label" for="sr-{i}">Ergebnis</label><input id="sr-{i}" type="text" class="field-input" bind:value={step.result} /></div>
								<div class="field"><label class="field-label" for="sdur-{i}">Dauer</label><input id="sdur-{i}" type="text" class="field-input" bind:value={step.duration} /></div>
							</div>
							<div class="field"><label class="field-label" for="se-{i}">Ausgangs-Zeile</label><input id="se-{i}" type="text" class="field-input" bind:value={step.exit} /></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.steps.items.push({ no: '', durationTag: '', title: '', question: '', description: '', tags: [], result: '', duration: '', exit: '' }); expSteps = content.steps.items.length - 1; }}>+ Stufe hinzufügen</button>
			</div>
		</details>

		<!-- Wirkung -->
		<details class="card">
			<summary class="card-head"><h2>Wirkung</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="i-kick">Kicker</label><input id="i-kick" type="text" class="field-input" bind:value={content.impact.kicker} /></div>
				<div class="field"><label class="field-label" for="i-big">Grosse Aussage <span class="field-hint">*Text* = kursiv im Akzent</span></label><textarea id="i-big" class="field-textarea" rows="3" bind:value={content.impact.big}></textarea></div>
				<div class="field"><label class="field-label" for="i-small">Ergänzung</label><textarea id="i-small" class="field-textarea" rows="3" bind:value={content.impact.small}></textarea></div>
			</div>
		</details>

		<!-- Beweis -->
		<details class="card">
			<summary class="card-head"><h2>Beweis / Case</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="p-kick">Kicker</label><input id="p-kick" type="text" class="field-input" bind:value={content.proof.kicker} /></div>
				<div class="field"><label class="field-label" for="p-title">Titel</label><input id="p-title" type="text" class="field-input" bind:value={content.proof.title} /></div>
				<div class="field"><label class="field-label" for="p-lead">Lead</label><textarea id="p-lead" class="field-textarea" rows="2" bind:value={content.proof.lead}></textarea></div>
				<div class="field"><label class="field-label" for="p-cl">Case-Label <span class="field-hint">Branche / Einordnung</span></label><input id="p-cl" type="text" class="field-input" bind:value={content.proof.caseLabel} /></div>

				<h3 class="sub">Timeline</h3>
				<div class="items">
					{#each content.proof.caseRows as row, i}
						<AdminAccordionItem
							index={i}
							total={content.proof.caseRows.length}
							title={row.month || 'Neuer Schritt'}
							subtitle={row.tag || undefined}
							expanded={expCase === i}
							removeLabel="Schritt löschen"
							ontoggle={() => (expCase = expCase === i ? null : i)}
							onmoveup={() => (expCase = move(content.proof.caseRows, i, -1))}
							onmovedown={() => (expCase = move(content.proof.caseRows, i, 1))}
							onremove={() => content.proof.caseRows.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="cm-{i}">Monat / Zeitpunkt</label><input id="cm-{i}" type="text" class="field-input" bind:value={row.month} /></div>
								<div class="field"><label class="field-label" for="ct-{i}">Tag <span class="field-hint">optional, z.B. «Stufe 1»</span></label><input id="ct-{i}" type="text" class="field-input" bind:value={row.tag} /></div>
							</div>
							<div class="field"><label class="field-label" for="cx-{i}">Text <span class="field-hint">**Wort** = Akzent</span></label><textarea id="cx-{i}" class="field-textarea" rows="3" bind:value={row.text}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.proof.caseRows.push({ month: '', text: '', tag: '' }); expCase = content.proof.caseRows.length - 1; }}>+ Timeline-Schritt hinzufügen</button>

				<h3 class="sub">MissGovern-Karte</h3>
				<div class="field"><label class="field-label" for="mg-title">Titel</label><input id="mg-title" type="text" class="field-input" bind:value={content.proof.missgovern.title} /></div>
				<div class="field"><label class="field-label" for="mg-text">Text</label><textarea id="mg-text" class="field-textarea" rows="2" bind:value={content.proof.missgovern.text}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="mg-cta">Button-Label</label><input id="mg-cta" type="text" class="field-input" bind:value={content.proof.missgovern.cta} /></div>
					<div class="field"><label class="field-label" for="mg-url">Link zur Simulation <span class="field-hint">optional</span></label><input id="mg-url" type="text" class="field-input" bind:value={content.proof.missgovern.url} placeholder="https://…" /></div>
				</div>
			</div>
		</details>

		<!-- Abgrenzung -->
		<details class="card">
			<summary class="card-head"><h2>Abgrenzung</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="b-kick">Kicker</label><input id="b-kick" type="text" class="field-input" bind:value={content.boundaries.kicker} /></div>
				<div class="field"><label class="field-label" for="b-title">Titel</label><input id="b-title" type="text" class="field-input" bind:value={content.boundaries.title} /></div>
				<div class="field"><label class="field-label" for="b-lead">Lead</label><textarea id="b-lead" class="field-textarea" rows="2" bind:value={content.boundaries.lead}></textarea></div>

				<div class="items">
					{#each content.boundaries.items as item, i}
						<AdminAccordionItem
							index={i}
							total={content.boundaries.items.length}
							title={item.title || 'Neuer Punkt'}
							expanded={expBound === i}
							removeLabel="Punkt löschen"
							ontoggle={() => (expBound = expBound === i ? null : i)}
							onmoveup={() => (expBound = move(content.boundaries.items, i, -1))}
							onmovedown={() => (expBound = move(content.boundaries.items, i, 1))}
							onremove={() => content.boundaries.items.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="bt-{i}">Titel</label><input id="bt-{i}" type="text" class="field-input" bind:value={item.title} /></div>
							<div class="field"><label class="field-label" for="bd-{i}">Beschreibung</label><textarea id="bd-{i}" class="field-textarea" rows="2" bind:value={item.desc}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.boundaries.items.push({ title: '', desc: '' }); expBound = content.boundaries.items.length - 1; }}>+ Punkt hinzufügen</button>
			</div>
		</details>

		<!-- Erstgespräch -->
		<details class="card">
			<summary class="card-head"><h2>Erstgespräch</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="ct-kick">Kicker</label><input id="ct-kick" type="text" class="field-input" bind:value={content.contact.kicker} /></div>
				<div class="field"><label class="field-label" for="ct-title">Titel</label><input id="ct-title" type="text" class="field-input" bind:value={content.contact.title} /></div>
				<div class="field"><label class="field-label" for="ct-lead">Lead</label><input id="ct-lead" type="text" class="field-input" bind:value={content.contact.lead} /></div>

				<h3 class="sub">Ablauf-Schritte</h3>
				{#each content.contact.steps as _, i}
					<div class="row-inline">
						<span class="row-n">{i + 1}</span>
						<input type="text" class="field-input" bind:value={content.contact.steps[i]} />
						<button type="button" class="icon-btn danger" onclick={() => content.contact.steps.splice(i, 1)} title="Entfernen" aria-label="Schritt entfernen">✕</button>
					</div>
				{/each}
				<button type="button" class="btn-add btn-add-sm" onclick={() => content.contact.steps.push('')}>+ Schritt hinzufügen</button>

				<h3 class="sub">CTA-Box (neben den Schritten)</h3>
				<p class="card-note">Die Box rechts neben den Ablauf-Schritten. Das grosse Kontakt-Band am Seitenende («Bereit, das Seltene möglich zu machen?») kommt site-weit und wird hier nicht bearbeitet.</p>
				<div class="field"><label class="field-label" for="cb-title">Titel</label><input id="cb-title" type="text" class="field-input" bind:value={content.contact.box.title} /></div>
				<div class="field"><label class="field-label" for="cb-text">Text</label><textarea id="cb-text" class="field-textarea" rows="2" bind:value={content.contact.box.text}></textarea></div>
				<div class="field"><label class="field-label" for="cb-mg">Personalisierte Zeile <span class="field-hint">nur bei MissGovern-Ankunft sichtbar · **Wort** = Akzent</span></label><input id="cb-mg" type="text" class="field-input" bind:value={content.contact.box.mgLine} /></div>
			</div>
		</details>

		<!-- FAQ -->
		<details class="card">
			<summary class="card-head"><h2>Häufige Fragen</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
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

		<!-- MissGovern-Banner -->
		<details class="card">
			<summary class="card-head"><h2>MissGovern-Banner (UTM)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<p class="card-note">Erscheint oben auf der Seite, wenn Besucher mit <code>?utm_source=…</code> aus der Simulation kommen.</p>
				<div class="field"><label class="field-label" for="bn-utm">utm_source-Wert</label><input id="bn-utm" type="text" class="field-input" bind:value={content.banner.utmSource} placeholder="missgovern" /></div>
				<div class="field"><label class="field-label" for="bn-text">Banner-Text <span class="field-hint">**Wort** = Akzent</span></label><textarea id="bn-text" class="field-textarea" rows="2" bind:value={content.banner.text}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="bn-cta">Link-Label</label><input id="bn-cta" type="text" class="field-input" bind:value={content.banner.ctaLabel} /></div>
					<div class="field"><label class="field-label" for="bn-href">Link-Ziel</label><input id="bn-href" type="text" class="field-input" bind:value={content.banner.ctaHref} placeholder="#kontakt" /></div>
				</div>
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
	.card-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: -6px 0 0;
	}
	.card-note code {
		font-family: var(--ff-mono);
		font-size: 0.78rem;
		background: var(--bg-elevated);
		padding: 1px 5px;
		border-radius: 4px;
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

	.row-inline {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.row-n {
		width: 26px;
		height: 26px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.78rem;
		font-weight: 700;
		font-family: var(--ff-mono);
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
