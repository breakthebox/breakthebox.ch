<script lang="ts">
	import type { MediaContent } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<MediaContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);
	let uploadValue = $state<string | undefined>('');

	function genId() {
		return crypto.randomUUID();
	}
	function fileName(url: string): string {
		return decodeURIComponent(url.split('/').pop() ?? 'Bild').replace(/\.[a-z0-9]+$/i, '');
	}

	// Neu hochgeladenes Bild in die Bibliothek übernehmen.
	$effect(() => {
		const url = uploadValue;
		if (!url) return;
		uploadValue = '';
		content.library = [...content.library, { id: genId(), url, name: fileName(url) }];
	});

	function removeImage(id: string) {
		if (!confirm('Bild aus der Mediathek entfernen? Zuweisungen (z.B. in Themes) werden beim Speichern gelöst.')) return;
		content.library = content.library.filter((img) => img.id !== id);
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
	<title>Mediathek — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Mediathek</h1>
		<p class="page-subtitle">Gemeinsame Bild-Bibliothek. Die Bilder stehen überall zur Auswahl, wo Slots zugewiesen werden (z.B. Hero- und Pillar-Bilder in den <a href="/admin/themes">Themes</a>).</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<div class="item-card">
			<div class="card-head">
				<h2 class="card-title">Bilder</h2>
				<span class="muted">{content.library.length} Bild(er)</span>
			</div>
			<div class="lib-upload">
				<ImageUpload bind:value={uploadValue} section="theme-lib" label="Bild hinzufügen" />
			</div>
			{#if content.library.length > 0}
				<div class="lib-grid">
					{#each content.library as img (img.id)}
						<div class="lib-item">
							<img src={img.url} alt={img.name} />
							<input class="lib-name" type="text" bind:value={img.name} aria-label="Bildname" />
							<button type="button" class="icon-btn icon-btn-danger" onclick={() => removeImage(img.id)} title="Entfernen" aria-label="Bild entfernen">&times;</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="muted">Noch keine Bilder in der Mediathek.</p>
			{/if}
		</div>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</button>
		</div>
	</form>
</div>

<style>
	.editor-page {
		max-width: 900px;
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
	.page-subtitle a {
		color: var(--btb-steel);
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
	.item-card {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		padding: 20px 24px;
		margin-bottom: var(--space-lg);
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}
	.card-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-heading);
		margin: 0;
	}
	.muted {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.lib-upload {
		max-width: 420px;
		margin-bottom: 16px;
	}
	.lib-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 12px;
	}
	.lib-item {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--bg-page);
		display: flex;
		flex-direction: column;
	}
	.lib-item img {
		width: 100%;
		height: 100px;
		object-fit: contain;
		background: repeating-conic-gradient(var(--bg-elevated) 0% 25%, var(--bg-surface) 0% 50%) 50% / 16px 16px;
	}
	.lib-name {
		border: none;
		border-top: 1px solid var(--border);
		padding: 6px 8px;
		font-size: 0.78rem;
		background: var(--bg-surface);
		color: var(--text-primary);
		min-width: 0;
	}
	.lib-name:focus {
		outline: none;
	}
	.lib-item .icon-btn {
		align-self: flex-end;
		margin: 4px;
	}
	.icon-btn {
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		background: var(--bg-surface);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.8rem;
	}
	.icon-btn-danger:hover {
		border-color: var(--color-error);
		color: var(--color-error);
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
</style>
