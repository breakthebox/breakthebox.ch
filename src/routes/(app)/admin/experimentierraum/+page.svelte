<script lang="ts">
	import type { ExperimentierraumContent } from '$lib/types/content';
	import AdminAccordionItem from '$lib/components/ui/AdminAccordionItem.svelte';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<ExperimentierraumContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	let expRules = $state<number | null>(null);
	let expBench = $state<number | null>(0);
	let expDiscarded = $state<number | null>(null);

	// Stack-Zeilen erst beim Speichern trimmen.
	function cleaned(): ExperimentierraumContent {
		const c = structuredClone($state.snapshot(content)) as ExperimentierraumContent;
		c.bench.items = c.bench.items.map((e) => ({
			...e,
			stack: (e.stack ?? []).map((x) => x.trim()).filter(Boolean)
		}));
		return c;
	}
	let serialized = $derived(JSON.stringify(cleaned()));

	function move<T>(arr: T[], i: number, dir: -1 | 1): number {
		const t = i + dir;
		if (t < 0 || t >= arr.length) return i;
		[arr[i], arr[t]] = [arr[t], arr[i]];
		return t;
	}
	function fromText(v: string): string[] {
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
	<title>Experimentierraum — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Experimentierraum</h1>
		<p class="page-subtitle">Der redaktionelle Inhalt der Seite «Experimentierraum» — Hero, Raum-Regeln, die Werkbank (Experimente mit Lehrgeld), «Verworfen», Transfer-Zitat und Soft-CTA. In Feldern mit dem Hinweis setzt <code class="hint-code">*Wort*</code> ein Wort in der Akzentfarbe.</p>
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
				<div class="field"><label class="field-label" for="h-title">Titel <span class="field-hint">*Wort* = Akzent</span></label><textarea id="h-title" class="field-textarea" rows="2" bind:value={content.hero.title}></textarea></div>
				<div class="field"><label class="field-label" for="h-sub">Subline</label><textarea id="h-sub" class="field-textarea" rows="4" bind:value={content.hero.subline}></textarea></div>
			</div>
		</details>

		<!-- Regeln des Raums -->
		<details class="card">
			<summary class="card-head"><h2>Regeln des Raums</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<p class="card-note">Die drei Karten unter dem Hero.</p>
				<div class="items">
					{#each content.rules as rule, i}
						<AdminAccordionItem
							index={i}
							total={content.rules.length}
							title={rule.title || 'Neue Regel'}
							subtitle={rule.no || undefined}
							expanded={expRules === i}
							removeLabel="Regel löschen"
							ontoggle={() => (expRules = expRules === i ? null : i)}
							onmoveup={() => (expRules = move(content.rules, i, -1))}
							onmovedown={() => (expRules = move(content.rules, i, 1))}
							onremove={() => content.rules.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="rn-{i}">Nummer <span class="field-hint">z.B. «Regel 01»</span></label><input id="rn-{i}" type="text" class="field-input" bind:value={rule.no} /></div>
								<div class="field"><label class="field-label" for="rt-{i}">Titel</label><input id="rt-{i}" type="text" class="field-input" bind:value={rule.title} /></div>
							</div>
							<div class="field"><label class="field-label" for="rx-{i}">Text</label><textarea id="rx-{i}" class="field-textarea" rows="3" bind:value={rule.text}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.rules.push({ no: `Regel 0${content.rules.length + 1}`, title: '', text: '' }); expRules = content.rules.length - 1; }}>+ Regel hinzufügen</button>
			</div>
		</details>

		<!-- Werkbank -->
		<details class="card">
			<summary class="card-head"><h2>Werkbank (Experimente)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="b-kick">Kicker</label><input id="b-kick" type="text" class="field-input" bind:value={content.bench.kicker} /></div>
				<div class="field"><label class="field-label" for="b-title">Titel</label><input id="b-title" type="text" class="field-input" bind:value={content.bench.title} /></div>
				<div class="field"><label class="field-label" for="b-lead">Lead</label><textarea id="b-lead" class="field-textarea" rows="2" bind:value={content.bench.lead}></textarea></div>

				<div class="items">
					{#each content.bench.items as exp, i}
						<AdminAccordionItem
							index={i}
							total={content.bench.items.length}
							title={exp.name || 'Neues Experiment'}
							subtitle={exp.status || undefined}
							expanded={expBench === i}
							removeLabel="Experiment löschen"
							ontoggle={() => (expBench = expBench === i ? null : i)}
							onmoveup={() => (expBench = move(content.bench.items, i, -1))}
							onmovedown={() => (expBench = move(content.bench.items, i, 1))}
							onremove={() => content.bench.items.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="en-{i}">Name</label><input id="en-{i}" type="text" class="field-input" bind:value={exp.name} /></div>
								<div class="field"><label class="field-label" for="es-{i}">Status <span class="field-hint">z.B. «Live · Bühne & Web»</span></label><input id="es-{i}" type="text" class="field-input" bind:value={exp.status} /></div>
							</div>
							<div class="field"><label class="field-label" for="ew-{i}">Untertitel <span class="field-hint">kursiv im Akzent</span></label><input id="ew-{i}" type="text" class="field-input" bind:value={exp.what} /></div>
							<div class="field"><label class="field-label" for="ed-{i}">Beschreibung</label><textarea id="ed-{i}" class="field-textarea" rows="3" bind:value={exp.desc}></textarea></div>
							<div class="field"><label class="field-label" for="et-{i}">Tech-Tags <span class="field-hint">ein Tag pro Zeile</span></label><textarea id="et-{i}" class="field-textarea" rows="3" value={exp.stack.join('\n')} oninput={(e) => (exp.stack = fromText(e.currentTarget.value))}></textarea></div>
							<div class="field-row">
								<div class="field"><label class="field-label" for="eu-{i}">Link-URL <span class="field-hint">optional</span></label><input id="eu-{i}" type="text" class="field-input" bind:value={exp.url} placeholder="https://…" /></div>
								<div class="field"><label class="field-label" for="el-{i}">Link-Label</label><input id="el-{i}" type="text" class="field-input" bind:value={exp.urlLabel} /></div>
							</div>
							<div class="field"><label class="field-label" for="eg-{i}">Lehrgeld <span class="field-hint">die Lernspalte · *Wort* = Akzent</span></label><textarea id="eg-{i}" class="field-textarea" rows="4" bind:value={exp.lehrgeld}></textarea></div>
							<ImageUpload bind:value={exp.image} section="exp-{i}" label="Bild (optional, als Kartenkopf)" />
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.bench.items.push({ status: 'Live', name: '', what: '', desc: '', stack: [], url: '', urlLabel: '', lehrgeld: '' }); expBench = content.bench.items.length - 1; }}>+ Experiment hinzufügen</button>
			</div>
		</details>

		<!-- Verworfen -->
		<details class="card">
			<summary class="card-head"><h2>Verworfen</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="v-kick">Kicker</label><input id="v-kick" type="text" class="field-input" bind:value={content.discarded.kicker} /></div>
				<div class="field"><label class="field-label" for="v-title">Titel</label><input id="v-title" type="text" class="field-input" bind:value={content.discarded.title} /></div>
				<div class="field"><label class="field-label" for="v-lead">Lead</label><textarea id="v-lead" class="field-textarea" rows="2" bind:value={content.discarded.lead}></textarea></div>

				<div class="items">
					{#each content.discarded.items as item, i}
						<AdminAccordionItem
							index={i}
							total={content.discarded.items.length}
							title={item.title || 'Neuer Fehlversuch'}
							expanded={expDiscarded === i}
							removeLabel="Eintrag löschen"
							ontoggle={() => (expDiscarded = expDiscarded === i ? null : i)}
							onmoveup={() => (expDiscarded = move(content.discarded.items, i, -1))}
							onmovedown={() => (expDiscarded = move(content.discarded.items, i, 1))}
							onremove={() => content.discarded.items.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="vt-{i}">Titel</label><input id="vt-{i}" type="text" class="field-input" bind:value={item.title} /></div>
							<div class="field"><label class="field-label" for="vx-{i}">Text</label><textarea id="vx-{i}" class="field-textarea" rows="3" bind:value={item.text}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.discarded.items.push({ title: '', text: '' }); expDiscarded = content.discarded.items.length - 1; }}>+ Eintrag hinzufügen</button>
			</div>
		</details>

		<!-- Transfer -->
		<details class="card">
			<summary class="card-head"><h2>Transfer (dunkle Zitat-Box)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="t-kick">Kicker</label><input id="t-kick" type="text" class="field-input" bind:value={content.transfer.kicker} /></div>
				<div class="field"><label class="field-label" for="t-quote">Zitat</label><textarea id="t-quote" class="field-textarea" rows="2" bind:value={content.transfer.quote}></textarea></div>
				<div class="field"><label class="field-label" for="t-text">Text <span class="field-hint">[Label](url) = Link</span></label><textarea id="t-text" class="field-textarea" rows="3" bind:value={content.transfer.text}></textarea></div>
			</div>
		</details>

		<!-- Soft CTA -->
		<details class="card">
			<summary class="card-head"><h2>Soft-CTA</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="s-text">Text</label><textarea id="s-text" class="field-textarea" rows="3" bind:value={content.softCta.text}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="s-pl">Button primär — Label</label><input id="s-pl" type="text" class="field-input" bind:value={content.softCta.primaryLabel} /></div>
					<div class="field"><label class="field-label" for="s-ph">Button primär — Ziel</label><input id="s-ph" type="text" class="field-input" bind:value={content.softCta.primaryHref} /></div>
				</div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="s-sl">Button sekundär — Label</label><input id="s-sl" type="text" class="field-input" bind:value={content.softCta.secondaryLabel} /></div>
					<div class="field"><label class="field-label" for="s-sh">Button sekundär — Ziel</label><input id="s-sh" type="text" class="field-input" bind:value={content.softCta.secondaryHref} /></div>
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
		padding: 18px 24px 22px;
		border-top: 1px solid var(--border);
	}
	.card-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0;
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
