<script lang="ts">
	import type { TestimonialsContent } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';
	import AdminAccordionItem from '$lib/components/ui/AdminAccordionItem.svelte';

	let { data, form } = $props();
	let content = $state<TestimonialsContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);
	let expanded = $state<number | null>(0);

	function toggle(i: number) {
		expanded = expanded === i ? null : i;
	}
	function addItem() {
		content.items.push({ quote: '', author: '', role: '', linkedin: '', photo: '', videoUrl: '' });
		expanded = content.items.length - 1;
	}
	function removeItem(index: number) {
		if (!confirm('Diese Stimme wirklich löschen?')) return;
		content.items.splice(index, 1);
		if (expanded !== null && expanded >= content.items.length) {
			expanded = content.items.length - 1 >= 0 ? content.items.length - 1 : null;
		}
	}
	function move(index: number, dir: -1 | 1) {
		const t = index + dir;
		if (t < 0 || t >= content.items.length) return;
		[content.items[index], content.items[t]] = [content.items[t], content.items[index]];
		if (expanded === index) expanded = t;
		else if (expanded === t) expanded = index;
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
	<title>Stimmen — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Stimmen</h1>
		<p class="page-subtitle">Testimonials aus der Section «Fremdbild statt Eigenlob» — Anzahl, Reihenfolge und Inhalte frei anpassbar.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<div class="items">
			{#each content.items as item, i}
				<AdminAccordionItem
					index={i}
					total={content.items.length}
					title={item.author || 'Neue Stimme'}
					subtitle={item.role || undefined}
					expanded={expanded === i}
					removeLabel="Stimme löschen"
					ontoggle={() => toggle(i)}
					onmoveup={() => move(i, -1)}
					onmovedown={() => move(i, 1)}
					onremove={() => removeItem(i)}
				>
					<div class="field">
						<label class="field-label" for="quote-{i}">Zitat <span class="field-hint">Text mit **doppelten Sternchen** wird rot hervorgehoben</span></label>
						<textarea id="quote-{i}" class="field-textarea" bind:value={item.quote} rows="3" placeholder="z.B. Sie ist **das Bindeglied** zwischen Technik und Business…"></textarea>
					</div>
					<div class="field-row">
						<div class="field">
							<label class="field-label" for="author-{i}">Name</label>
							<input id="author-{i}" type="text" class="field-input" bind:value={item.author} placeholder="z.B. Marcel Zahnd" />
						</div>
						<div class="field">
							<label class="field-label" for="role-{i}">Rolle / Bezug</label>
							<input id="role-{i}" type="text" class="field-input" bind:value={item.role} placeholder="z.B. Co-Dozent" />
						</div>
					</div>
					<div class="field-row">
						<div class="field">
							<label class="field-label" for="li-{i}">LinkedIn-Profil (URL, optional)</label>
							<input id="li-{i}" type="url" class="field-input" bind:value={item.linkedin} placeholder="https://www.linkedin.com/in/…" />
						</div>
						<div class="field">
							<label class="field-label" for="vid-{i}">Video-Statement (YouTube-Link, optional)</label>
							<input id="vid-{i}" type="url" class="field-input" bind:value={item.videoUrl} placeholder="https://youtu.be/…" />
						</div>
					</div>
					<ImageUpload bind:value={item.photo} section="testimonial-{i}" label="Foto (optional)" />
				</AdminAccordionItem>
			{/each}
		</div>

		<button type="button" class="btn-add" onclick={addItem}>+ Stimme hinzufügen</button>

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
		gap: 8px;
		margin-bottom: var(--space-lg);
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
