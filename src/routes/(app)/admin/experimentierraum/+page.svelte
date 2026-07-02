<script lang="ts">
	import type { ExperimentsContent } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<ExperimentsContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	function addPlatform() {
		content.platforms.push({ key: 'platform-' + (content.platforms.length + 1), name: '', sketch: '', desc: [''], url: '', image: '' });
	}
	function removePlatform(i: number) {
		if (!confirm('Diese Plattform wirklich löschen?')) return;
		content.platforms.splice(i, 1);
	}
	function movePlatform(i: number, dir: -1 | 1) {
		const t = i + dir;
		if (t < 0 || t >= content.platforms.length) return;
		[content.platforms[i], content.platforms[t]] = [content.platforms[t], content.platforms[i]];
	}
	function addParagraph(pi: number) {
		content.platforms[pi].desc.push('');
	}
	function removeParagraph(pi: number, j: number) {
		content.platforms[pi].desc.splice(j, 1);
	}

	function addProject() {
		content.projects.push({ key: 'project-' + (content.projects.length + 1), name: '', sketch: '', desc: '', status: '', url: '', image: '' });
	}
	function removeProject(i: number) {
		if (!confirm('Dieses Projekt wirklich löschen?')) return;
		content.projects.splice(i, 1);
	}
	function moveProject(i: number, dir: -1 | 1) {
		const t = i + dir;
		if (t < 0 || t >= content.projects.length) return;
		[content.projects[i], content.projects[t]] = [content.projects[t], content.projects[i]];
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
		<p class="page-subtitle">Plattformen und laufende Projekte für die Subseite «Experimentierraum».</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<h2 class="group-title">Plattformen</h2>
		<div class="items">
			{#each content.platforms as p, i}
				<div class="item-card">
					<div class="item-head">
						<span class="item-num">{i + 1}</span>
						<span class="item-title">{p.name || 'Neue Plattform'}</span>
						<div class="item-actions">
							<button type="button" class="icon-btn" onclick={() => movePlatform(i, -1)} disabled={i === 0} aria-label="Nach oben">↑</button>
							<button type="button" class="icon-btn" onclick={() => movePlatform(i, 1)} disabled={i === content.platforms.length - 1} aria-label="Nach unten">↓</button>
							<button type="button" class="icon-btn icon-btn-danger" onclick={() => removePlatform(i)} aria-label="Löschen">&times;</button>
						</div>
					</div>
					<div class="field-row">
						<div class="field"><label class="field-label" for="pn-{i}">Name</label><input id="pn-{i}" type="text" class="field-input" bind:value={p.name} /></div>
						<div class="field"><label class="field-label" for="ps-{i}">Sketch-Notiz</label><input id="ps-{i}" type="text" class="field-input" bind:value={p.sketch} /></div>
					</div>
					<div class="field">
							<label class="field-label">Beschreibung <span class="field-hint">ein oder mehrere Abschnitte</span></label>
							{#each p.desc as _para, j}
								<div class="para-row">
									<textarea class="field-textarea" bind:value={p.desc[j]} rows="2" placeholder="Abschnitt {j + 1}…"></textarea>
									{#if p.desc.length > 1}
										<button type="button" class="icon-btn icon-btn-danger" onclick={() => removeParagraph(i, j)} aria-label="Abschnitt löschen">&times;</button>
									{/if}
								</div>
							{/each}
							<button type="button" class="btn-add-sm" onclick={() => addParagraph(i)}>+ Abschnitt</button>
						</div>
					<div class="field-row">
						<div class="field"><label class="field-label" for="pu-{i}">Link</label><input id="pu-{i}" type="text" class="field-input" bind:value={p.url} placeholder="https://…" /></div>
						<div class="field field-full"><ImageUpload bind:value={p.image} section="platform-logo-{i}" label="Logo / Bild" /></div>
					</div>
				</div>
			{/each}
		</div>
		<button type="button" class="btn-add" onclick={addPlatform}>+ Plattform hinzufügen</button>

		<h2 class="group-title">Projekte in Arbeit</h2>
		<div class="items">
			{#each content.projects as p, i}
				<div class="item-card">
					<div class="item-head">
						<span class="item-num">{i + 1}</span>
						<span class="item-title">{p.name || 'Neues Projekt'}</span>
						<div class="item-actions">
							<button type="button" class="icon-btn" onclick={() => moveProject(i, -1)} disabled={i === 0} aria-label="Nach oben">↑</button>
							<button type="button" class="icon-btn" onclick={() => moveProject(i, 1)} disabled={i === content.projects.length - 1} aria-label="Nach unten">↓</button>
							<button type="button" class="icon-btn icon-btn-danger" onclick={() => removeProject(i)} aria-label="Löschen">&times;</button>
						</div>
					</div>
					<div class="field-row">
						<div class="field"><label class="field-label" for="jn-{i}">Name</label><input id="jn-{i}" type="text" class="field-input" bind:value={p.name} /></div>
						<div class="field"><label class="field-label" for="jst-{i}">Status</label><input id="jst-{i}" type="text" class="field-input" bind:value={p.status} placeholder="z.B. Laufend" /></div>
					</div>
					<div class="field"><label class="field-label" for="js-{i}">Sketch-Notiz</label><input id="js-{i}" type="text" class="field-input" bind:value={p.sketch} /></div>
					<div class="field"><label class="field-label" for="jd-{i}">Beschreibung</label><textarea id="jd-{i}" class="field-textarea" bind:value={p.desc} rows="2"></textarea></div>
					<div class="field-row">
						<div class="field"><label class="field-label" for="ju-{i}">Link</label><input id="ju-{i}" type="text" class="field-input" bind:value={p.url} placeholder="https://…" /></div>
						<div class="field field-full"><ImageUpload bind:value={p.image} section="project-image-{i}" label="Bild (optional)" /></div>
					</div>
				</div>
			{/each}
		</div>
		<button type="button" class="btn-add" onclick={addProject}>+ Projekt hinzufügen</button>

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
		flex: 1;
	}
	.field-row {
		display: flex;
		gap: 14px;
	}
	.field-row:has(.field-full) {
		flex-wrap: wrap;
	}
	.field-full {
		flex: 1 1 100%;
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
	.para-row {
		display: flex;
		gap: 8px;
		align-items: flex-start;
		margin-bottom: 8px;
	}
	.para-row .field-textarea {
		flex: 1;
	}
	.btn-add-sm {
		align-self: flex-start;
		padding: 6px 12px;
		border: 1px dashed var(--btb-steel);
		border-radius: var(--radius-sm);
		background: none;
		color: var(--btb-steel);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-add-sm:hover {
		background: var(--btb-steel-subtle);
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
		margin-bottom: var(--space-xl);
	}
	.btn-add:hover {
		background: var(--btb-steel-subtle);
	}
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
