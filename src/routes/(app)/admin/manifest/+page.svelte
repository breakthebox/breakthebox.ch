<script lang="ts">
	import type { ManifestContent } from '$lib/types/content';

	let { data, form } = $props();
	let content = $state<ManifestContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	function addThesis() {
		content.theses.push({ text: '', note: '' });
	}
	function removeThesis(i: number) {
		if (!confirm('Diese These wirklich löschen?')) return;
		content.theses.splice(i, 1);
	}
	function move(i: number, dir: -1 | 1) {
		const t = i + dir;
		if (t < 0 || t >= content.theses.length) return;
		[content.theses[i], content.theses[t]] = [content.theses[t], content.theses[i]];
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
	<title>Manifest — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Manifest</h1>
		<p class="page-subtitle">Provokante Thesen für die Scroll-Seite «Mein Manifest». <span class="hint-inline">**doppelte Sternchen** = rot · Zeilenumbruch = neue Zeile</span></p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<h2 class="group-title">Intro</h2>
		<div class="block">
			<div class="field">
				<label class="field-label" for="kicker">Kicker (kleine Zeile oben)</label>
				<input id="kicker" type="text" class="field-input" bind:value={content.kicker} placeholder="z.B. Klartext · ein Manifest" />
			</div>
			<div class="field">
				<label class="field-label" for="title">Titel</label>
				<textarea id="title" class="field-textarea" bind:value={content.title} rows="2"></textarea>
			</div>
			<div class="field">
				<label class="field-label" for="subtitle">Untertitel</label>
				<textarea id="subtitle" class="field-textarea" bind:value={content.subtitle} rows="2"></textarea>
			</div>
		</div>

		<h2 class="group-title">Thesen</h2>
		<div class="items">
			{#each content.theses as thesis, i}
				<div class="item-card">
					<div class="item-head">
						<span class="item-num">{i + 1}</span>
						<span class="item-title">{thesis.text ? thesis.text.replace(/\*\*/g, '').split('\n')[0] : 'Neue These'}</span>
						<div class="item-actions">
							<button type="button" class="icon-btn" onclick={() => move(i, -1)} disabled={i === 0} aria-label="Nach oben">↑</button>
							<button type="button" class="icon-btn" onclick={() => move(i, 1)} disabled={i === content.theses.length - 1} aria-label="Nach unten">↓</button>
							<button type="button" class="icon-btn icon-btn-danger" onclick={() => removeThesis(i)} aria-label="Löschen">&times;</button>
						</div>
					</div>
					<div class="field">
						<label class="field-label">These (gross)</label>
						<textarea class="field-textarea" bind:value={thesis.text} rows="2" placeholder="z.B. IT ist keine Kostenstelle.&#10;Sie ist eine **Wirkungsfrage**."></textarea>
					</div>
					<div class="field">
						<label class="field-label">Positionierung (optional)</label>
						<textarea class="field-textarea" bind:value={thesis.note} rows="3" placeholder="Erläuternder Absatz…"></textarea>
					</div>
				</div>
			{/each}
		</div>
		<button type="button" class="btn-add" onclick={addThesis}>+ These hinzufügen</button>

		<h2 class="group-title">Abschluss-Banner (rot)</h2>
		<div class="block">
			<div class="field">
				<label class="field-label" for="ckicker">Kicker (kleine Zeile oben)</label>
				<input id="ckicker" type="text" class="field-input" bind:value={content.closingKicker} placeholder="z.B. neugierig. unabhängig. fundiert." />
			</div>
			<div class="field">
				<label class="field-label" for="ctitle">Titel</label>
				<textarea id="ctitle" class="field-textarea" bind:value={content.closingTitle} rows="2"></textarea>
			</div>
			<p class="block-note">Die drei Spalten (Experimentierraum · VR-Mandate · Fundament) werden automatisch aus «Experimentierraum» und «Über mich» befüllt.</p>
		</div>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</button>
		</div>
	</form>
</div>

<style>
	.editor-page {
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
	.hint-inline {
		color: var(--text-muted);
		font-size: 0.82rem;
	}
	.group-title {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-heading);
		margin: var(--space-lg) 0 var(--space-md);
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
	.block {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		padding: 22px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.block-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		line-height: 1.5;
	}
	.items {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: var(--space-md);
	}
	.item-card {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		padding: 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.item-head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.item-num {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.82rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	.item-title {
		flex: 1;
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--text-heading);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.item-actions {
		display: flex;
		gap: 4px;
	}
	.icon-btn {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: var(--bg-surface);
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.15s;
	}
	.icon-btn:hover:not(:disabled) {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.icon-btn-danger:hover:not(:disabled) {
		border-color: var(--color-error);
		color: var(--color-error);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
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
		margin-top: var(--space-xl);
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
</style>
