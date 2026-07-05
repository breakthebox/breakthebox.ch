<script lang="ts">
	import type { PillarsContent } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<PillarsContent>(structuredClone(data.content));
	let saving = $state(false);
	let expandedPillar = $state<number | null>(0);
	let showSuccess = $state(false);

	function togglePillar(index: number) {
		expandedPillar = expandedPillar === index ? null : index;
	}

	function addExample(pillarIndex: number) {
		content.pillars[pillarIndex].examples.push({ label: '', desc: '', url: '' });
	}

	function removeExample(pillarIndex: number, exIndex: number) {
		content.pillars[pillarIndex].examples.splice(exIndex, 1);
	}

	function uniquePillarKey() {
		const keys = new Set(content.pillars.map((p) => p.key));
		let n = content.pillars.length + 1;
		while (keys.has('pillar-' + n)) n++;
		return 'pillar-' + n;
	}

	function addPillar() {
		content.pillars.push({
			key: uniquePillarKey(),
			title: '',
			note: '',
			desc: '',
			tags: [],
			examples: []
		});
		expandedPillar = content.pillars.length - 1;
	}

	function removePillar(index: number) {
		if (!confirm('Diesen Pillar wirklich löschen?')) return;
		content.pillars.splice(index, 1);
		if (expandedPillar !== null && expandedPillar >= content.pillars.length) {
			expandedPillar = content.pillars.length - 1;
		}
	}

	function movePillar(index: number, dir: -1 | 1) {
		const target = index + dir;
		if (target < 0 || target >= content.pillars.length) return;
		const arr = content.pillars;
		[arr[index], arr[target]] = [arr[target], arr[index]];
		if (expandedPillar === index) expandedPillar = target;
		else if (expandedPillar === target) expandedPillar = index;
	}

	function updateTags(pillarIndex: number, value: string) {
		content.pillars[pillarIndex].tags = value
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
	}

	function tagsString(pillarIndex: number): string {
		return content.pillars[pillarIndex].tags.join(', ');
	}

	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			saving = false;
			setTimeout(() => (showSuccess = false), 3000);
		}
		if (form?.error) {
			saving = false;
		}
	});
</script>

<svelte:head>
	<title>Was ich anbiete — Admin — Break the Box</title>
</svelte:head>

<div class="pillars-page">
	<!-- Header -->
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M15 9H3m0 0l5-5M3 9l5 5" />
			</svg>
			Zurück zum Dashboard
		</a>
		<h1>Pillars</h1>
		<p class="page-subtitle">Verwalte deine Pillar-Karten — Anzahl, Reihenfolge und Inhalte frei anpassbar.</p>
	</div>

	<!-- Notifications -->
	{#if showSuccess}
		<div class="toast toast-success">
			Änderungen erfolgreich gespeichert.
		</div>
	{/if}
	{#if form?.error}
		<div class="toast toast-error">
			{form.error}
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		onsubmit={() => { saving = true; }}
	>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<div class="accordion">
			{#each content.pillars as pillar, i}
				<div class="accordion-item" class:expanded={expandedPillar === i}>
					<div class="accordion-header">
						<button type="button" class="accordion-toggle" onclick={() => togglePillar(i)}>
							<span class="pillar-number">{i + 1}</span>
							<div>
								<span class="pillar-title">{pillar.title || 'Neuer Pillar'}</span>
								<span class="pillar-key">{pillar.key}</span>
							</div>
						</button>
						<div class="accordion-actions">
							<button type="button" class="icon-btn" onclick={() => movePillar(i, -1)} disabled={i === 0} title="Nach oben verschieben" aria-label="Nach oben verschieben">↑</button>
							<button type="button" class="icon-btn" onclick={() => movePillar(i, 1)} disabled={i === content.pillars.length - 1} title="Nach unten verschieben" aria-label="Nach unten verschieben">↓</button>
							<button type="button" class="icon-btn icon-btn-danger" onclick={() => removePillar(i)} title="Pillar löschen" aria-label="Pillar löschen">&times;</button>
							<button type="button" class="icon-btn" onclick={() => togglePillar(i)} title="Bearbeiten" aria-label="Bearbeiten">
								<svg
									class="chevron"
									class:chevron-open={expandedPillar === i}
									width="20"
									height="20"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M6 8l4 4 4-4" />
								</svg>
							</button>
						</div>
					</div>

					{#if expandedPillar === i}
						<div class="accordion-body">
							<!-- Karten-Bild — überschreibt das Bild aus dem aktiven Theme -->
							<ImageUpload bind:value={pillar.image} section="pillar-{i}" label="Karten-Bild (überschreibt Theme)" />
							{#if !pillar.image}
								<p class="theme-hint">
									{#if data.themePillarImages[pillar.key]}
										<img src={data.themePillarImages[pillar.key]} alt="" class="theme-hint-thumb" />
										<span>Aktuell wird das <strong>Theme-Bild</strong> angezeigt — lade hier ein Bild hoch, um es nur für diesen Pillar zu überschreiben.</span>
									{:else}
										<span>Kein Theme-Bild gesetzt. Theme-Bilder verwaltest du unter <a href="/admin/themes">Themes</a>.</span>
									{/if}
								</p>
							{/if}

							<div class="field-group">
								<label class="field-label" for="title-{i}">Titel</label>
								<input
									id="title-{i}"
									type="text"
									class="field-input"
									bind:value={pillar.title}
									placeholder="z.B. Strategieberatung & IT-Beratung"
								/>
							</div>

							<div class="field-group">
								<label class="field-label" for="note-{i}">Notiz</label>
								<input
									id="note-{i}"
									type="text"
									class="field-input"
									bind:value={pillar.note}
									placeholder="z.B. mein Kerngeschäft seit über 10 Jahren"
								/>
							</div>

							<div class="field-group">
								<label class="field-label" for="desc-{i}">Beschreibung
									<span class="field-hint">Markdown: **fett**, *kursiv*, [Linktext](https://url.ch)</span>
								</label>
								<textarea
									id="desc-{i}"
									class="field-textarea"
									bind:value={pillar.desc}
									rows="4"
									placeholder="Beschreibungstext... Markdown wird unterstützt."
								></textarea>
							</div>

							<div class="field-group">
								<label class="field-label" for="tags-{i}">Tags (kommagetrennt)</label>
								<input
									id="tags-{i}"
									type="text"
									class="field-input"
									value={tagsString(i)}
									oninput={(e) => updateTags(i, (e.target as HTMLInputElement).value)}
									placeholder="z.B. IT-Strategie, Digitalisierung, KI-Strategie"
								/>
							</div>

							<!-- Subpage-Link -->
							<div class="field-group">
								<label class="field-label" for="subpage-{i}">Subseiten-Link (optional)
									<span class="field-hint">Wenn gesetzt, springt der Pfeil zur Subseite statt die Karte zu flippen — z.B. /experimentierraum</span>
								</label>
								<input
									id="subpage-{i}"
									type="text"
									class="field-input"
									bind:value={pillar.subpageUrl}
									placeholder="z.B. /experimentierraum (leer lassen für Flip zu Beispielen)"
								/>
							</div>

							<!-- Examples -->
							<div class="field-group">
								<label class="field-label">Praxisbeispiele
									<span class="field-hint">Ohne Subseiten-Link: Pfeil flippt die Karte zu diesen Beispielen. Ohne beides: kein Pfeil.</span>
								</label>
								<div class="examples-list">
									{#each pillar.examples as example, j}
										<div class="example-row">
											<div class="example-fields">
												<input
													type="text"
													class="field-input field-input-sm"
													bind:value={example.label}
													placeholder="Label"
												/>
												<input
													type="text"
													class="field-input field-input-sm"
													bind:value={example.desc}
													placeholder="Beschreibung"
												/>
												<input
													type="url"
													class="field-input field-input-sm field-input-url"
													bind:value={example.url}
													placeholder="Link (optional, z.B. /blog/artikel)"
												/>
											</div>
											<button
												type="button"
												class="btn-remove"
												onclick={() => removeExample(i, j)}
												title="Beispiel entfernen"
											>
												&times;
											</button>
										</div>
									{/each}
								</div>
								<button
									type="button"
									class="btn-add-example"
									onclick={() => addExample(i)}
								>
									+ Beispiel hinzufügen
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<button type="button" class="btn-add-pillar" onclick={addPillar}>+ Pillar hinzufügen</button>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>
				{#if saving}
					Speichern...
				{:else}
					Speichern
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	/* ═══════ Page Layout ═══════ */
	.pillars-page {
		max-width: 800px;
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

	/* ═══════ Back Link ═══════ */
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

	/* ═══════ Toast Notifications ═══════ */
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

	/* ═══════ Accordion ═══════ */
	.accordion {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: var(--space-xl);
	}
	.accordion-item {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		overflow: hidden;
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.accordion-item.expanded {
		border-color: var(--btb-steel);
		box-shadow: var(--shadow-card-hover);
	}

	.accordion-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding-right: 14px;
	}
	.accordion-toggle {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px 24px;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;
	}
	.accordion-toggle:hover {
		background: var(--bg-elevated);
	}
	.accordion-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.icon-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: var(--bg-surface);
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.15s;
	}
	.icon-btn:hover:not(:disabled) {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
		background: var(--bg-elevated);
	}
	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.icon-btn-danger:hover:not(:disabled) {
		border-color: var(--color-error);
		color: var(--color-error);
		background: rgba(251, 113, 133, 0.08);
	}
	.btn-add-pillar {
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
		margin-bottom: var(--space-xl);
	}
	.btn-add-pillar:hover {
		background: var(--btb-steel-subtle);
	}

	.pillar-number {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.88rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	.pillar-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-heading);
		display: block;
	}
	.pillar-key {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: var(--ff-mono);
	}

	.chevron {
		color: var(--text-muted);
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.chevron-open {
		transform: rotate(180deg);
	}

	/* ═══════ Accordion Body ═══════ */
	.accordion-body {
		padding: 0 24px 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		border-top: 1px solid var(--border);
		padding-top: 20px;
	}

	/* ═══════ Form Fields ═══════ */
	.field-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
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
	.field-input-url {
		grid-column: 1 / -1;
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
		transition: border-color 0.15s, box-shadow 0.15s;
		box-sizing: border-box;
	}
	.field-input:focus,
	.field-textarea:focus {
		outline: none;
		border-color: var(--btb-steel);
		box-shadow: 0 0 0 3px var(--btb-steel-subtle);
	}
	.field-textarea {
		resize: vertical;
		min-height: 80px;
		line-height: 1.5;
	}
	.field-input-sm {
		padding: 8px 12px;
		font-size: 0.84rem;
	}

	/* ═══════ Examples ═══════ */
	.examples-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.example-row {
		display: flex;
		align-items: flex-start;
		gap: 8px;
	}
	.example-fields {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 8px;
	}

	.btn-remove {
		width: 34px;
		height: 34px;
		border-radius: var(--radius-sm);
		border: 1.5px solid var(--border);
		background: var(--bg-surface);
		color: var(--text-muted);
		font-size: 1.1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.15s;
	}
	.btn-remove:hover {
		border-color: var(--color-error);
		color: var(--color-error);
		background: rgba(251, 113, 133, 0.08);
	}

	.btn-add-example {
		align-self: flex-start;
		padding: 8px 16px;
		border: 1.5px dashed var(--border);
		border-radius: var(--radius-sm);
		background: none;
		color: var(--text-secondary);
		font-size: 0.82rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
		margin-top: 4px;
	}
	.btn-add-example:hover {
		border-color: var(--btb-teal);
		color: var(--btb-teal);
		background: var(--btb-teal-subtle);
	}

	/* ═══════ Save Button ═══════ */
	.form-actions {
		display: flex;
		justify-content: flex-end;
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
		transition: background 0.15s, box-shadow 0.15s;
	}
	.btn-save:hover:not(:disabled) {
		background: var(--btb-steel-hover);
		box-shadow: var(--shadow-card-hover);
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* ═══════ Responsive ═══════ */
	@media (max-width: 640px) {
		.example-fields {
			grid-template-columns: 1fr;
		}
		.accordion-header {
			padding: 16px;
		}
		.accordion-body {
			padding: 0 16px 16px;
			padding-top: 16px;
		}
	}

	.theme-hint {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 8px 0 0;
		font-size: 0.78rem;
		color: var(--text-muted);
		line-height: 1.45;
	}
	.theme-hint-thumb {
		width: 36px;
		height: 36px;
		object-fit: contain;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
		flex-shrink: 0;
	}
	.theme-hint a {
		color: var(--btb-steel);
	}
</style>
