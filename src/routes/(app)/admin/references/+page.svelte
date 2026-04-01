<script lang="ts">
	import type { ReferencesContent } from '$lib/types/content';

	let { data, form } = $props();

	let content = $state<ReferencesContent>(structuredClone(data.content));
	let saving = $state(false);
	let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	$effect(() => {
		if (form?.success) {
			feedback = { type: 'success', message: 'Referenzen gespeichert.' };
			clearFeedback();
		} else if (form?.error) {
			feedback = { type: 'error', message: form.error as string };
			clearFeedback();
		}
	});

	function clearFeedback() {
		setTimeout(() => { feedback = null; }, 3000);
	}

	function addClient() {
		content.clients = [
			...content.clients,
			{ name: '', sortOrder: content.clients.length }
		];
	}

	function removeClient(index: number) {
		content.clients = content.clients.filter((_, i) => i !== index);
		reindex();
	}

	function moveUp(index: number) {
		if (index <= 0) return;
		const items = [...content.clients];
		[items[index - 1], items[index]] = [items[index], items[index - 1]];
		content.clients = items;
		reindex();
	}

	function moveDown(index: number) {
		if (index >= content.clients.length - 1) return;
		const items = [...content.clients];
		[items[index], items[index + 1]] = [items[index + 1], items[index]];
		content.clients = items;
		reindex();
	}

	function reindex() {
		content.clients.forEach((c, i) => c.sortOrder = i);
	}

	function handleSubmit() {
		saving = true;
	}

	let uploading = $state<Record<string, boolean>>({});
	let expanded = $state<Record<number, boolean>>({});

	function toggleExpanded(index: number) {
		expanded[index] = !expanded[index];
	}

	async function uploadLogo(index: number, file: File) {
		const key = `ref-${index}`;
		uploading[key] = true;
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('section', `ref-${content.clients[index].name || index}`);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			if (!res.ok) {
				const err = await res.json();
				feedback = { type: 'error', message: err.message ?? 'Upload fehlgeschlagen.' };
				return;
			}
			const { url } = await res.json();
			content.clients[index].logoUrl = url;
		} catch {
			feedback = { type: 'error', message: 'Upload fehlgeschlagen.' };
		} finally {
			uploading[key] = false;
		}
	}

	function handleLogoChange(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadLogo(index, file);
	}
</script>

<svelte:head>
	<title>Kunden & Partner — Admin</title>
</svelte:head>

<div class="ref-page">
	<div class="ref-header">
		<a href="/admin" class="ref-back">&larr; Zurück</a>
		<h1>Kunden & Partner</h1>
		<p class="ref-subtitle">Verwalte die Liste der Referenz-Kunden und -Partner.</p>
	</div>

	{#if feedback}
		<div class="ref-feedback ref-feedback--{feedback.type}">
			{feedback.message}
		</div>
	{/if}

	<form method="POST" onsubmit={handleSubmit}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />


		<div class="ref-list">
			{#each content.clients as client, i (i)}
				<div class="ref-item" class:ref-item--expanded={expanded[i]}>
					<div class="ref-item-row">
						<span class="ref-index">{i + 1}</span>

						{#if client.logoUrl}
							<img src={client.logoUrl} alt="" class="ref-logo-thumb" />
						{/if}

						<input
							type="text"
							class="ref-input"
							bind:value={client.name}
							placeholder="Kundenname"
							required
						/>

						<div class="ref-actions">
							<button
								type="button"
								class="ref-btn ref-btn--expand"
								onclick={() => toggleExpanded(i)}
								title={expanded[i] ? 'Zuklappen' : 'Details bearbeiten'}
							>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
									{#if expanded[i]}
										<path d="M4 10l4-4 4 4" />
									{:else}
										<path d="M4 6l4 4 4-4" />
									{/if}
								</svg>
							</button>
							<button
								type="button"
								class="ref-btn ref-btn--move"
								onclick={() => moveUp(i)}
								disabled={i === 0}
								title="Nach oben"
							>&#9650;</button>
							<button
								type="button"
								class="ref-btn ref-btn--move"
								onclick={() => moveDown(i)}
								disabled={i === content.clients.length - 1}
								title="Nach unten"
							>&#9660;</button>
							<button
								type="button"
								class="ref-btn ref-btn--remove"
								onclick={() => removeClient(i)}
								title="Entfernen"
							>&times;</button>
						</div>
					</div>

					{#if expanded[i]}
						<div class="ref-details">
							<div class="ref-detail-field">
								<label for="ref-url-{i}">Website-URL</label>
								<input
									id="ref-url-{i}"
									type="url"
									class="ref-detail-input"
									bind:value={client.websiteUrl}
									placeholder="https://example.com"
								/>
							</div>
							<div class="ref-detail-field">
								<label>Logo</label>
								<div class="ref-logo-area">
									{#if client.logoUrl}
										<div class="ref-logo-preview">
											<img src={client.logoUrl} alt={client.name} />
											<button
												type="button"
												class="ref-logo-remove"
												onclick={() => { client.logoUrl = null; }}
												title="Logo entfernen"
											>&times;</button>
										</div>
									{/if}
									<label class="ref-logo-upload" class:uploading={uploading[`ref-${i}`]}>
										<input
											type="file"
											accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
											onchange={(e) => handleLogoChange(e, i)}
											hidden
										/>
										{#if uploading[`ref-${i}`]}
											Hochladen…
										{:else}
											{client.logoUrl ? 'Ersetzen' : 'Logo hochladen'}
										{/if}
									</label>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<button type="button" class="ref-add" onclick={addClient}>
			+ Kunde hinzufügen
		</button>

		<div class="ref-footer">
			<button type="submit" class="ref-save" disabled={saving}>
				{saving ? 'Speichern...' : 'Speichern'}
			</button>
		</div>
	</form>
</div>

<style>
	/* ═══════ PAGE ═══════ */
	.ref-page {
		max-width: 720px;
	}

	/* ═══════ HEADER ═══════ */
	.ref-header {
		margin-bottom: var(--space-xl);
	}
	.ref-back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--btb-steel);
		text-decoration: none;
		margin-bottom: var(--space-md);
		transition: color 0.15s;
	}
	.ref-back:hover {
		color: var(--btb-steel-hover);
	}
	.ref-header h1 {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.ref-subtitle {
		font-size: 0.88rem;
		color: var(--text-secondary);
	}

	/* ═══════ FEEDBACK ═══════ */
	.ref-feedback {
		padding: 10px 16px;
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: var(--space-lg);
	}
	.ref-feedback--success {
		background: rgba(52, 211, 153, 0.12);
		color: #059669;
		border: 1px solid rgba(52, 211, 153, 0.3);
	}
	.ref-feedback--error {
		background: rgba(251, 113, 133, 0.12);
		color: #e11d48;
		border: 1px solid rgba(251, 113, 133, 0.3);
	}

	/* ═══════ LIST ═══════ */
	.ref-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: var(--space-md);
	}

	/* ═══════ ITEM ═══════ */
	.ref-item {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		transition: border-color 0.15s, box-shadow 0.15s;
		overflow: hidden;
	}
	.ref-item:hover {
		border-color: var(--btb-steel-subtle);
		box-shadow: var(--shadow-card);
	}
	.ref-item--expanded {
		border-color: var(--btb-steel-subtle);
	}
	.ref-item-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
	}
	.ref-logo-thumb {
		width: 28px;
		height: 28px;
		object-fit: contain;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.ref-index {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--text-muted);
		background: var(--bg-elevated);
		border-radius: 6px;
		flex-shrink: 0;
	}

	.ref-input {
		flex: 1;
		padding: 8px 12px;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
		background: transparent;
		border: 1px solid transparent;
		border-radius: 6px;
		outline: none;
		transition: border-color 0.15s, background 0.15s;
		font-family: var(--ff-ui);
	}
	.ref-input:focus {
		border-color: var(--btb-steel);
		background: var(--bg-page);
	}
	.ref-input::placeholder {
		color: var(--text-muted);
	}

	/* ═══════ ITEM ACTIONS ═══════ */
	.ref-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}

	.ref-btn {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg-surface);
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.7rem;
		transition: all 0.15s;
		padding: 0;
	}
	.ref-btn:hover:not(:disabled) {
		background: var(--bg-elevated);
		color: var(--text-primary);
		border-color: var(--btb-steel-subtle);
	}
	.ref-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.ref-btn--remove {
		font-size: 1rem;
		color: var(--text-muted);
	}
	.ref-btn--remove:hover:not(:disabled) {
		color: var(--color-error);
		border-color: rgba(251, 113, 133, 0.3);
		background: rgba(251, 113, 133, 0.08);
	}

	/* ═══════ EXPAND BUTTON ═══════ */
	.ref-btn--expand {
		color: var(--text-muted);
	}
	.ref-btn--expand:hover:not(:disabled) {
		color: var(--btb-steel);
	}

	/* ═══════ DETAILS PANEL ═══════ */
	.ref-details {
		padding: 12px 16px 16px;
		border-top: 1px solid var(--border);
		background: var(--bg-elevated);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.ref-detail-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.ref-detail-field label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.ref-detail-input {
		padding: 8px 12px;
		border: 1.5px solid var(--border);
		border-radius: 6px;
		font-size: 0.85rem;
		font-family: var(--ff-ui);
		color: var(--text-primary);
		background: var(--bg-page);
		transition: border-color 0.15s;
	}
	.ref-detail-input:focus {
		outline: none;
		border-color: var(--btb-steel);
	}

	/* ═══════ LOGO UPLOAD ═══════ */
	.ref-logo-area {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.ref-logo-preview {
		position: relative;
		width: 80px;
		height: 48px;
		border: 1px solid var(--border);
		border-radius: 6px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
	}
	.ref-logo-preview img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.ref-logo-remove {
		position: absolute;
		top: 2px;
		right: 2px;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.5);
		border: none;
		color: #fff;
		font-size: 0.7rem;
		cursor: pointer;
		line-height: 1;
	}
	.ref-logo-remove:hover {
		background: var(--color-error);
	}
	.ref-logo-upload {
		display: inline-flex;
		align-items: center;
		padding: 6px 14px;
		background: var(--bg-page);
		color: var(--text-secondary);
		border: 1.5px dashed var(--border);
		border-radius: 6px;
		font-size: 0.78rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: all 0.15s;
	}
	.ref-logo-upload:hover {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.ref-logo-upload.uploading {
		opacity: 0.6;
		pointer-events: none;
	}

	/* ═══════ ADD BUTTON ═══════ */
	.ref-add {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 20px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--btb-steel);
		background: transparent;
		border: 1.5px dashed var(--border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s;
		font-family: var(--ff-ui);
		width: 100%;
		justify-content: center;
	}
	.ref-add:hover {
		border-color: var(--btb-steel);
		background: var(--btb-steel-subtle);
	}

	/* ═══════ FOOTER ═══════ */
	.ref-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: var(--space-xl);
		padding-top: var(--space-lg);
		border-top: 1px solid var(--border);
	}
	.ref-save {
		padding: 10px 32px;
		font-size: 0.9rem;
		font-weight: 700;
		color: #fff;
		background: var(--btb-steel);
		border: none;
		border-radius: var(--radius-button);
		cursor: pointer;
		transition: background 0.15s, box-shadow 0.15s;
		font-family: var(--ff-ui);
	}
	.ref-save:hover:not(:disabled) {
		background: var(--btb-steel-hover);
		box-shadow: 0 2px 8px rgba(82, 122, 152, 0.3);
	}
	.ref-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.ref-item {
			padding: 8px 12px;
			gap: 8px;
		}
		.ref-btn--move {
			display: none;
		}
	}
</style>
