<script lang="ts">
	let {
		value = $bindable(),
		section = '',
		label = 'Karten-Bild'
	}: {
		value: string | undefined;
		section: string;
		label?: string;
	} = $props();

	let uploading = $state(false);
	let error = $state('');
	let dragover = $state(false);

	async function uploadFile(file: File) {
		uploading = true;
		error = '';

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('section', section);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({ message: 'Upload fehlgeschlagen.' }));
				throw new Error(data.message ?? `Fehler ${response.status}`);
			}

			const data = await response.json();
			value = data.url;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload fehlgeschlagen.';
		} finally {
			uploading = false;
		}
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragover = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) uploadFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragover = true;
	}

	function handleDragLeave() {
		dragover = false;
	}

	function removeImage() {
		value = '';
	}
</script>

<div class="image-upload">
	<label class="image-upload-label">{label}</label>

	{#if value}
		<div class="image-preview">
			<img src={value} alt="Header-Bild Vorschau" />
			<div class="image-preview-actions">
				<button type="button" class="btn-change" onclick={() => document.getElementById(`file-${section}`)?.click()}>
					Ändern
				</button>
				<button type="button" class="btn-remove-img" onclick={removeImage}>
					Entfernen
				</button>
			</div>
		</div>
	{:else}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="image-dropzone"
			class:dragover
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			onclick={() => document.getElementById(`file-${section}`)?.click()}
		>
			{#if uploading}
				<div class="dropzone-content">
					<div class="upload-spinner"></div>
					<span>Wird hochgeladen...</span>
				</div>
			{:else}
				<div class="dropzone-content">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<rect x="4" y="6" width="24" height="20" rx="3" />
						<circle cx="11" cy="14" r="3" />
						<path d="M28 22l-6-6-10 10" />
						<path d="M20 6v-2m0 0l-3 3m3-3l3 3" />
					</svg>
					<span>Bild hierher ziehen oder <strong>klicken</strong></span>
					<span class="dropzone-hint">JPG, PNG, WebP, SVG — max. 5 MB</span>
				</div>
			{/if}
		</div>
	{/if}

	<input
		id="file-{section}"
		type="file"
		accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
		class="file-input-hidden"
		onchange={handleFileInput}
	/>

	{#if error}
		<div class="upload-error">{error}</div>
	{/if}
</div>

<style>
	.image-upload {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.image-upload-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	/* ─── Dropzone ─── */
	.image-dropzone {
		border: 2px dashed var(--border);
		border-radius: var(--radius-card);
		padding: 32px 24px;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s;
		background: var(--bg-page);
	}
	.image-dropzone:hover,
	.image-dropzone.dragover {
		border-color: var(--btb-teal);
		background: rgba(91, 191, 186, 0.04);
	}
	.dropzone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: var(--text-muted);
		font-size: 0.88rem;
	}
	.dropzone-content strong {
		color: var(--btb-steel);
	}
	.dropzone-hint {
		font-size: 0.75rem;
		color: var(--text-muted);
		opacity: 0.7;
	}

	/* ─── Preview ─── */
	.image-preview {
		position: relative;
		border-radius: var(--radius-card);
		overflow: hidden;
		border: 1.5px solid var(--border);
		background: var(--bg-page);
	}
	.image-preview img {
		width: 100%;
		height: 180px;
		object-fit: cover;
		display: block;
	}
	.image-preview-actions {
		display: flex;
		gap: 8px;
		padding: 10px 12px;
		background: var(--bg-surface);
		border-top: 1px solid var(--border);
	}
	.btn-change,
	.btn-remove-img {
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		font-size: 0.78rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
		border: 1.5px solid var(--border);
		background: var(--bg-page);
		color: var(--text-secondary);
	}
	.btn-change:hover {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.btn-remove-img:hover {
		border-color: var(--color-error);
		color: var(--color-error);
		background: rgba(251, 113, 133, 0.06);
	}

	/* ─── Hidden Input ─── */
	.file-input-hidden {
		display: none;
	}

	/* ─── Error ─── */
	.upload-error {
		font-size: 0.8rem;
		color: var(--color-error);
		padding: 6px 0;
	}

	/* ─── Spinner ─── */
	.upload-spinner {
		width: 24px;
		height: 24px;
		border: 2.5px solid var(--border);
		border-top-color: var(--btb-teal);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
