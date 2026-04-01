<script lang="ts">
	import type { AboutContent, AboutRole } from '$lib/types/content';

	let { data, form } = $props();

	let content = $state<AboutContent>(structuredClone(data.content));
	let saving = $state(false);
	let successMessage = $state('');

	// ─── Texts ───
	function addText() {
		content.texts = [...content.texts, ''];
	}
	function removeText(index: number) {
		content.texts = content.texts.filter((_, i) => i !== index);
	}

	// ─── Qualifications ───
	function addQualification() {
		content.qualifications = [...content.qualifications, ''];
	}
	function removeQualification(index: number) {
		content.qualifications = content.qualifications.filter((_, i) => i !== index);
	}

	// ─── Roles ───
	function addRole() {
		content.roles = [...content.roles, { title: '', org: '' }];
	}
	function removeRole(index: number) {
		content.roles = content.roles.filter((_, i) => i !== index);
	}

	// ─── Form submission ───
	let jsonPayload = $derived(JSON.stringify(content));

	function handleSubmit() {
		saving = true;
		successMessage = '';
	}

	$effect(() => {
		if (form?.success) {
			successMessage = 'Änderungen gespeichert.';
			saving = false;
			setTimeout(() => { successMessage = ''; }, 3000);
		}
		if (form?.error) {
			saving = false;
		}
	});
</script>

<svelte:head>
	<title>Über mich bearbeiten — Admin — Break the Box</title>
</svelte:head>

<div class="about-editor">
	<!-- Header -->
	<div class="editor-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M11 4L6 9l5 5"/>
			</svg>
			Zurück
		</a>
		<h1>Über mich</h1>
		<p class="editor-subtitle">Texte, Qualifikationen und Rollen für die «Über mich»-Sektion bearbeiten.</p>
	</div>

	<!-- Feedback -->
	{#if successMessage}
		<div class="feedback feedback-success">{successMessage}</div>
	{/if}
	{#if form?.error}
		<div class="feedback feedback-error">{form.error}</div>
	{/if}

	<form method="POST" onsubmit={handleSubmit}>
		<input type="hidden" name="content" value={jsonPayload} />

		<!-- ═══════ Texte ═══════ -->
		<section class="editor-section">
			<div class="section-header">
				<div>
					<h2>Texte</h2>
					<p class="section-desc">Die Absätze der «Über mich»-Sektion. Mindestens ein Abschnitt ist erforderlich.</p>
				</div>
				<button type="button" class="btn-add" onclick={addText}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
					Absatz hinzufügen
				</button>
			</div>

			<div class="items-list">
				{#each content.texts as text, i}
					<div class="item-card">
						<div class="item-card-header">
							<span class="item-label">Absatz {i + 1}</span>
							{#if content.texts.length > 1}
								<button type="button" class="btn-remove" onclick={() => removeText(i)}>
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>
								</button>
							{/if}
						</div>
						<textarea
							class="field-textarea"
							rows="4"
							placeholder="Textabschnitt eingeben..."
							bind:value={content.texts[i]}
						></textarea>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══════ Qualifikationen ═══════ -->
		<section class="editor-section">
			<div class="section-header">
				<div>
					<h2>Qualifikationen</h2>
					<p class="section-desc">Ausbildungen und Zertifikate.</p>
				</div>
				<button type="button" class="btn-add" onclick={addQualification}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
					Hinzufügen
				</button>
			</div>

			<div class="items-list">
				{#each content.qualifications as qual, i}
					<div class="item-row">
						<input
							type="text"
							class="field-input"
							placeholder="z.B. BSc Informatik"
							bind:value={content.qualifications[i]}
						/>
						<button type="button" class="btn-remove" onclick={() => removeQualification(i)}>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>
						</button>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══════ Rollen ═══════ -->
		<section class="editor-section">
			<div class="section-header">
				<div>
					<h2>Rollen</h2>
					<p class="section-desc">Aktuelle Mandate und Funktionen.</p>
				</div>
				<button type="button" class="btn-add" onclick={addRole}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
					Rolle hinzufügen
				</button>
			</div>

			<div class="items-list">
				{#each content.roles as role, i}
					<div class="item-card">
						<div class="item-card-header">
							<span class="item-label">Rolle {i + 1}</span>
							<button type="button" class="btn-remove" onclick={() => removeRole(i)}>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>
							</button>
						</div>
						<div class="role-fields">
							<div class="field-group">
								<label class="field-label">Titel</label>
								<input
									type="text"
									class="field-input"
									placeholder="z.B. Vizepräsidentin VR"
									bind:value={content.roles[i].title}
								/>
							</div>
							<div class="field-group">
								<label class="field-label">Organisation</label>
								<input
									type="text"
									class="field-input"
									placeholder="z.B. Nexplore AG"
									bind:value={content.roles[i].org}
								/>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- ═══════ Video-Label ═══════ -->
		<section class="editor-section">
			<div class="section-header">
				<div>
					<h2>Video-Label</h2>
					<p class="section-desc">Beschriftung des Video-Buttons.</p>
				</div>
			</div>
			<input
				type="text"
				class="field-input"
				placeholder="z.B. mein CV in 2 Minuten"
				bind:value={content.videoLabel}
			/>
		</section>

		<!-- ═══════ Save ═══════ -->
		<div class="editor-actions">
			<button type="submit" class="btn-save" disabled={saving}>
				{#if saving}
					Speichern...
				{:else}
					Änderungen speichern
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	/* ═══════ Layout ═══════ */
	.about-editor {
		max-width: 800px;
	}

	/* ═══════ Header ═══════ */
	.editor-header {
		margin-bottom: 32px;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: 16px;
		transition: color var(--t-fast);
	}
	.back-link:hover {
		color: var(--btb-steel);
	}
	.editor-header h1 {
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.editor-subtitle {
		font-size: 0.92rem;
		color: var(--text-secondary);
	}

	/* ═══════ Feedback ═══════ */
	.feedback {
		padding: 12px 16px;
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		font-weight: 500;
		margin-bottom: 24px;
	}
	.feedback-success {
		background: rgba(43, 138, 120, 0.1);
		color: var(--btb-teal);
		border: 1px solid rgba(43, 138, 120, 0.2);
	}
	.feedback-error {
		background: rgba(251, 113, 133, 0.1);
		color: var(--color-error);
		border: 1px solid rgba(251, 113, 133, 0.2);
	}

	/* ═══════ Sections ═══════ */
	.editor-section {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card-lg);
		padding: 28px;
		margin-bottom: 20px;
	}
	.section-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 20px;
	}
	.section-header h2 {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-heading);
		margin-bottom: 2px;
	}
	.section-desc {
		font-size: 0.82rem;
		color: var(--text-secondary);
	}

	/* ═══════ Items list ═══════ */
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* ═══════ Item card (text + role) ═══════ */
	.item-card {
		background: var(--bg-page);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 16px;
	}
	.item-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.item-label {
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
	}

	/* ═══════ Item row (qualifications) ═══════ */
	.item-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.item-row .field-input {
		flex: 1;
	}

	/* ═══════ Role fields ═══════ */
	.role-fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	/* ═══════ Fields ═══════ */
	.field-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.field-label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.field-input {
		width: 100%;
		padding: 10px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-surface);
		color: var(--text-primary);
		font-family: var(--ff-ui);
		font-size: 0.88rem;
		transition: border-color var(--t-fast);
		outline: none;
	}
	.field-input:focus {
		border-color: var(--btb-steel);
	}
	.field-textarea {
		width: 100%;
		padding: 10px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-surface);
		color: var(--text-primary);
		font-family: var(--ff-ui);
		font-size: 0.88rem;
		line-height: 1.6;
		resize: vertical;
		transition: border-color var(--t-fast);
		outline: none;
	}
	.field-textarea:focus {
		border-color: var(--btb-steel);
	}

	/* ═══════ Buttons ═══════ */
	.btn-add {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		background: transparent;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-button);
		color: var(--text-secondary);
		font-size: 0.82rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: all var(--t-fast);
		white-space: nowrap;
		flex-shrink: 0;
	}
	.btn-add:hover {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
		background: var(--btb-steel-subtle);
	}

	.btn-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		padding: 0;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		cursor: pointer;
		transition: all var(--t-fast);
		flex-shrink: 0;
	}
	.btn-remove:hover {
		background: rgba(251, 113, 133, 0.1);
		color: var(--color-error);
		border-color: rgba(251, 113, 133, 0.2);
	}

	.btn-save {
		padding: 12px 32px;
		background: var(--btb-teal);
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
		background: var(--btb-teal-dark);
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* ═══════ Actions bar ═══════ */
	.editor-actions {
		display: flex;
		justify-content: flex-end;
		padding-top: 8px;
		margin-top: 8px;
	}

	/* ═══════ Responsive ═══════ */
	@media (max-width: 640px) {
		.section-header {
			flex-direction: column;
			gap: 12px;
		}
		.role-fields {
			grid-template-columns: 1fr;
		}
		.editor-section {
			padding: 20px;
		}
	}
</style>
