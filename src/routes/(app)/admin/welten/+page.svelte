<script lang="ts">
	import type { WeltenContent } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<WeltenContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

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
	<title>Die Essenz — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Die Essenz</h1>
		<p class="page-subtitle">Die zwei Welten nebeneinander — Gremium und Experimentierraum. Kicker und Titel der Sektion sowie ihre Position pflegst du unter <a href="/admin/sections">Sektionen</a>.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		{#each [ { key: 'left', label: 'Linke Welt', world: content.left }, { key: 'right', label: 'Rechte Welt', world: content.right } ] as side (side.key)}
			<div class="item-card">
				<h2 class="card-title">{side.label}</h2>
				<div class="field-row">
					<div class="field">
						<label class="field-label" for="{side.key}-kick">Kicker</label>
						<input id="{side.key}-kick" type="text" class="field-input" bind:value={side.world.kicker} />
					</div>
					<div class="field">
						<label class="field-label" for="{side.key}-title">Titel</label>
						<input id="{side.key}-title" type="text" class="field-input" bind:value={side.world.title} />
					</div>
				</div>
				<div class="field">
					<label class="field-label" for="{side.key}-text">Text</label>
					<textarea id="{side.key}-text" class="field-textarea" rows="2" bind:value={side.world.text}></textarea>
				</div>

				<div class="field">
					<span class="field-label">Bild — bevorzugtes Format: Querformat 16:9 (z.B. 1600 × 900 px), leer = Farbfläche</span>
					{#if side.world.image}
						<div class="img-preview">
							<img src={side.world.image} alt={side.world.title} />
							<button type="button" class="img-remove" onclick={() => (side.world.image = '')}>Bild entfernen</button>
						</div>
					{/if}
					<ImageUpload bind:value={side.world.image} section="welten" label="Bild hochladen" />
				</div>
				<label class="check">
					<input type="checkbox" bind:checked={side.world.dark} />
					<span>Bildfläche in Akzentfarbe (statt im hellen Sandton) — sinnvoll für die technische Welt</span>
				</label>

				<div class="field-row">
					<div class="field">
						<label class="field-label" for="{side.key}-ik">Marke im Bild (leer = keine)</label>
						<input id="{side.key}-ik" type="text" class="field-input" bind:value={side.world.imageKicker} />
					</div>
					<div class="field">
						<label class="field-label" for="{side.key}-ic">Bildunterschrift (leer = keine)</label>
						<input id="{side.key}-ic" type="text" class="field-input" bind:value={side.world.imageCaption} />
					</div>
					<div class="field">
						<label class="field-label" for="{side.key}-im">Zusatzzeile</label>
						<input id="{side.key}-im" type="text" class="field-input" bind:value={side.world.imageMeta} />
					</div>
				</div>
			</div>
		{/each}

		<div class="item-card">
			<h2 class="card-title">Klammer unter beiden Welten</h2>
			<p class="hint">Sitzt mittig auf der Abschlusslinie und verbindet die zwei Spalten. Beide Felder leer = keine Klammer.</p>
			<div class="field-row">
				<div class="field">
					<label class="field-label" for="w-cap">Klammer-Zeile</label>
					<input id="w-cap" type="text" class="field-input" bind:value={content.caption} />
				</div>
				<div class="field">
					<label class="field-label" for="w-cap2">Klammer-Zeile Akzent</label>
					<input id="w-cap2" type="text" class="field-input" bind:value={content.captionAccent} />
				</div>
			</div>
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
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 16px;
	}
	.card-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-heading);
		margin: 0;
	}
	.hint {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: -6px 0 0;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.field-row {
		display: flex;
		gap: 12px;
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
	.check {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		font-size: 0.85rem;
		color: var(--text-secondary);
		cursor: pointer;
	}
	.check input {
		margin-top: 3px;
		flex-shrink: 0;
	}
	.img-preview {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.img-preview img {
		width: 120px;
		height: 68px;
		object-fit: cover;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}
	.img-remove {
		border: 1px solid var(--border);
		background: var(--bg-surface);
		color: var(--text-secondary);
		border-radius: var(--radius-sm);
		padding: 6px 12px;
		font-size: 0.8rem;
		cursor: pointer;
	}
	.img-remove:hover {
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
	@media (max-width: 640px) {
		.field-row {
			display: flex;
			flex-direction: column;
		}
	}
</style>
