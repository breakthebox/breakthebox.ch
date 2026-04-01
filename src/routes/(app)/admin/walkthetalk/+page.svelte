<script lang="ts">
	import type { WalkTheTalkContent, Platform } from '$lib/types/content';

	let { data, form } = $props();

	let content = $state<WalkTheTalkContent>(structuredClone(data.content));
	let saving = $state(false);
	let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	$effect(() => {
		if (form?.success) {
			feedback = { type: 'success', message: 'Änderungen gespeichert.' };
			saving = false;
		} else if (form?.error) {
			feedback = { type: 'error', message: form.error };
			saving = false;
		}
	});

	function addPlatform() {
		content.platforms = [
			...content.platforms,
			{
				key: `platform_${Date.now()}`,
				name: '',
				sketch: '',
				desc: '',
				url: '',
				image: ''
			}
		];
	}

	function removePlatform(index: number) {
		content.platforms = content.platforms.filter((_, i) => i !== index);
	}

	function handleSubmit() {
		saving = true;
		feedback = null;
	}

	let uploading = $state<Record<string, boolean>>({});

	async function uploadImage(key: string, file: File, onSuccess: (url: string) => void) {
		uploading[key] = true;
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('section', key);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			if (!res.ok) {
				const err = await res.json();
				feedback = { type: 'error', message: err.message ?? 'Upload fehlgeschlagen.' };
				return;
			}
			const { url } = await res.json();
			onSuccess(url);
		} catch {
			feedback = { type: 'error', message: 'Upload fehlgeschlagen.' };
		} finally {
			uploading[key] = false;
		}
	}

	function handleFileChange(event: Event, key: string, onSuccess: (url: string) => void) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadImage(key, file, onSuccess);
	}
</script>

<svelte:head>
	<title>Walk the Talk bearbeiten — Admin — Break the Box</title>
</svelte:head>

<div class="wtt-editor">
	<div class="editor-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M11 4L6 9l5 5" />
			</svg>
			Zurück zum Dashboard
		</a>
		<h1>Ich verstehe, wovon ich rede</h1>
		<p class="editor-subtitle">KI-Plattformen und Miss Bizzy bearbeiten</p>
	</div>

	<form method="POST" onsubmit={handleSubmit}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<!-- ═══════ Plattformen ═══════ -->
		<section class="editor-section">
			<div class="section-header">
				<h2>Plattformen</h2>
				<button type="button" class="btn-add" onclick={addPlatform}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<path d="M8 3v10M3 8h10" />
					</svg>
					Plattform hinzufügen
				</button>
			</div>

			{#if content.platforms.length === 0}
				<div class="empty-hint">
					Noch keine Plattformen vorhanden. Klicke auf «Plattform hinzufügen», um zu starten.
				</div>
			{/if}

			{#each content.platforms as platform, i}
				<div class="card">
					<div class="card-header">
						<span class="card-number">{i + 1}</span>
						<span class="card-title">{platform.name || 'Neue Plattform'}</span>
						<button
							type="button"
							class="btn-remove"
							onclick={() => removePlatform(i)}
							title="Plattform entfernen"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
								<path d="M4 4l8 8M12 4l-8 8" />
							</svg>
						</button>
					</div>
					<div class="card-body">
						<div class="field-row">
							<div class="field">
								<label for="platform-key-{i}">Key</label>
								<input
									id="platform-key-{i}"
									type="text"
									bind:value={content.platforms[i].key}
									placeholder="z.B. ductivo"
									class="input"
								/>
							</div>
							<div class="field">
								<label for="platform-name-{i}">Name</label>
								<input
									id="platform-name-{i}"
									type="text"
									bind:value={content.platforms[i].name}
									placeholder="z.B. Ductivo"
									class="input"
								/>
							</div>
						</div>
						<div class="field">
							<label for="platform-sketch-{i}">Sketch-Text</label>
							<input
								id="platform-sketch-{i}"
								type="text"
								bind:value={content.platforms[i].sketch}
								placeholder="Kurzer Slogan (wird in Handschrift dargestellt)"
								class="input"
							/>
						</div>
						<div class="field">
							<label for="platform-desc-{i}">Beschreibung</label>
							<textarea
								id="platform-desc-{i}"
								bind:value={content.platforms[i].desc}
								placeholder="Ausführliche Beschreibung der Plattform"
								class="textarea"
								rows="3"
							></textarea>
						</div>
						<div class="field">
							<label for="platform-url-{i}">Link (URL)</label>
							<input
								id="platform-url-{i}"
								type="url"
								bind:value={content.platforms[i].url}
								placeholder="https://example.com"
								class="input"
							/>
						</div>
						<div class="field">
							<label for="platform-image-{i}">Bild</label>
							<div class="upload-area">
								{#if content.platforms[i].image}
									<div class="image-preview">
										<img src={content.platforms[i].image} alt={content.platforms[i].name} />
										<button
											type="button"
											class="btn-remove-image"
											onclick={() => { content.platforms[i].image = ''; }}
											title="Bild entfernen"
										>
											<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
												<path d="M4 4l8 8M12 4l-8 8" />
											</svg>
										</button>
									</div>
								{/if}
								<label class="btn-upload" class:uploading={uploading[`platform-${i}`]}>
									<input
										type="file"
										accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
										onchange={(e) => handleFileChange(e, `platform-${i}`, (url) => { content.platforms[i].image = url; })}
										hidden
									/>
									{#if uploading[`platform-${i}`]}
										Wird hochgeladen…
									{:else}
										{content.platforms[i].image ? 'Bild ersetzen' : 'Bild hochladen'}
									{/if}
								</label>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</section>

		<!-- ═══════ Miss Bizzy ═══════ -->
		<section class="editor-section">
			<div class="section-header">
				<h2>Miss Bizzy</h2>
				<span class="badge-fixed">Immer sichtbar</span>
			</div>

			<div class="card card-highlight">
				<div class="card-body">
					<div class="field">
						<label for="missbizzy-title">Titel</label>
						<input
							id="missbizzy-title"
							type="text"
							bind:value={content.missbizzy.title}
							placeholder="z.B. Miss Bizzy — AI-Agent-Ökosystem"
							class="input"
						/>
					</div>
					<div class="field">
						<label for="missbizzy-sketch">Sketch-Text</label>
						<input
							id="missbizzy-sketch"
							type="text"
							bind:value={content.missbizzy.sketch}
							placeholder="Kurzer Slogan (wird in Handschrift dargestellt)"
							class="input"
						/>
					</div>
					<div class="field">
						<label for="missbizzy-desc">Beschreibung</label>
						<textarea
							id="missbizzy-desc"
							bind:value={content.missbizzy.desc}
							placeholder="Ausführliche Beschreibung von Miss Bizzy"
							class="textarea"
							rows="3"
						></textarea>
					</div>
					<div class="field">
						<label for="missbizzy-url">Link (URL)</label>
						<input
							id="missbizzy-url"
							type="url"
							bind:value={content.missbizzy.url}
							placeholder="https://example.com"
							class="input"
						/>
					</div>
					<div class="field">
						<label>Bild</label>
						<div class="upload-area">
							{#if content.missbizzy.image}
								<div class="image-preview">
									<img src={content.missbizzy.image} alt={content.missbizzy.title} />
									<button
										type="button"
										class="btn-remove-image"
										onclick={() => { content.missbizzy.image = ''; }}
										title="Bild entfernen"
									>
										<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
											<path d="M4 4l8 8M12 4l-8 8" />
										</svg>
									</button>
								</div>
							{/if}
							<label class="btn-upload" class:uploading={uploading['missbizzy']}>
								<input
									type="file"
									accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
									onchange={(e) => handleFileChange(e, 'missbizzy', (url) => { content.missbizzy.image = url; })}
									hidden
								/>
								{#if uploading['missbizzy']}
									Wird hochgeladen…
								{:else}
									{content.missbizzy.image ? 'Bild ersetzen' : 'Bild hochladen'}
								{/if}
							</label>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ═══════ Actions ═══════ -->
		<div class="editor-actions">
			{#if feedback}
				<div class="feedback feedback-{feedback.type}">
					{feedback.message}
				</div>
			{/if}
			<button type="submit" class="btn-save" disabled={saving}>
				{#if saving}
					Speichern…
				{:else}
					Änderungen speichern
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	/* ═══════ Page Layout ═══════ */
	.wtt-editor {
		max-width: 800px;
	}

	/* ═══════ Header ═══════ */
	.editor-header {
		margin-bottom: var(--space-xl);
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
		transition: color var(--t-fast);
	}
	.back-link:hover {
		color: var(--btb-steel);
	}
	.editor-header h1 {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: var(--space-xs);
	}
	.editor-subtitle {
		font-size: 0.88rem;
		color: var(--text-secondary);
	}

	/* ═══════ Sections ═══════ */
	.editor-section {
		margin-bottom: var(--space-2xl);
	}
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-md);
	}
	.section-header h2 {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-heading);
	}

	/* ═══════ Cards ═══════ */
	.card {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		margin-bottom: var(--space-md);
		overflow: hidden;
		transition: border-color var(--t-fast);
	}
	.card:hover {
		border-color: var(--btb-steel-light);
	}
	.card-highlight {
		border-color: var(--btb-teal);
		border-left: 4px solid var(--btb-teal);
	}
	.card-highlight:hover {
		border-color: var(--btb-teal);
	}
	.card-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md) var(--space-lg);
		background: var(--bg-elevated);
		border-bottom: 1px solid var(--border);
	}
	.card-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	.card-title {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--text-heading);
		flex: 1;
	}
	.card-body {
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	/* ═══════ Fields ═══════ */
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.field label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}
	.input,
	.textarea {
		padding: 10px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 0.88rem;
		font-family: var(--ff-ui);
		color: var(--text-primary);
		background: var(--bg-page);
		transition: border-color var(--t-fast), box-shadow var(--t-fast);
	}
	.input:focus,
	.textarea:focus {
		outline: none;
		border-color: var(--btb-steel);
		box-shadow: 0 0 0 3px var(--btb-steel-subtle);
	}
	.textarea {
		resize: vertical;
		min-height: 80px;
		line-height: 1.5;
	}

	/* ═══════ Buttons ═══════ */
	.btn-add {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		border: 1.5px solid transparent;
		border-radius: var(--radius-button);
		font-size: 0.82rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: all var(--t-fast);
	}
	.btn-add:hover {
		background: var(--btb-steel);
		color: #fff;
	}
	.btn-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-sm);
		background: transparent;
		border: 1.5px solid transparent;
		color: var(--text-muted);
		cursor: pointer;
		transition: all var(--t-fast);
	}
	.btn-remove:hover {
		background: rgba(251, 113, 133, 0.1);
		border-color: var(--color-error);
		color: var(--color-error);
	}
	.btn-save {
		padding: 12px 32px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-size: 0.92rem;
		font-weight: 700;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: background var(--t-fast);
	}
	.btn-save:hover:not(:disabled) {
		background: var(--btb-steel-hover);
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* ═══════ Badges ═══════ */
	.badge-fixed {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 3px 10px;
		border-radius: var(--radius-pill);
		background: var(--btb-teal-subtle);
		color: var(--btb-teal);
	}

	/* ═══════ Upload ═══════ */
	.upload-area {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		flex-wrap: wrap;
	}
	.image-preview {
		position: relative;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		overflow: hidden;
		max-width: 240px;
	}
	.image-preview img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}
	.btn-remove-image {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 26px;
		height: 26px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		color: #fff;
		cursor: pointer;
		transition: background var(--t-fast);
	}
	.btn-remove-image:hover {
		background: var(--color-error);
	}
	.btn-upload {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 18px;
		background: var(--bg-page);
		color: var(--text-secondary);
		border: 1.5px dashed var(--border);
		border-radius: var(--radius-sm);
		font-size: 0.82rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: all var(--t-fast);
	}
	.btn-upload:hover {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.btn-upload.uploading {
		opacity: 0.6;
		pointer-events: none;
	}

	/* ═══════ Empty Hint ═══════ */
	.empty-hint {
		padding: var(--space-xl);
		text-align: center;
		color: var(--text-muted);
		font-size: 0.88rem;
		background: var(--bg-surface);
		border: 1.5px dashed var(--border);
		border-radius: var(--radius-card);
	}

	/* ═══════ Actions & Feedback ═══════ */
	.editor-actions {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding-top: var(--space-lg);
		border-top: 1px solid var(--border);
	}
	.feedback {
		font-size: 0.85rem;
		font-weight: 500;
		padding: 8px 16px;
		border-radius: var(--radius-sm);
	}
	.feedback-success {
		background: rgba(52, 211, 153, 0.1);
		color: var(--color-success);
	}
	.feedback-error {
		background: rgba(251, 113, 133, 0.1);
		color: var(--color-error);
	}

	/* ═══════ Responsive ═══════ */
	@media (max-width: 640px) {
		.field-row {
			grid-template-columns: 1fr;
		}
		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
		}
		.editor-actions {
			flex-direction: column;
			align-items: stretch;
		}
		.feedback {
			text-align: center;
		}
	}
</style>
