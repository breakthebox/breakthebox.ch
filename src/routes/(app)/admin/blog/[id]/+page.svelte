<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { renderMarkdownBlock } from '$lib/utils/markdown';
	import { generateSlug } from '$lib/utils/slug';

	let { data } = $props();

	let title = $state(data.post?.title ?? '');
	let slug = $state(data.post?.slug ?? '');
	let content = $state(data.post?.content ?? '');
	let excerpt = $state(data.post?.excerpt ?? '');
	let headerImage = $state(data.post?.headerImage ?? '');
	let tagsString = $state(data.post?.tags?.join(', ') ?? '');
	let status = $state(data.post?.status ?? 'draft');
	let publishDate = $state(
		data.post?.publishDate
			? new Date(data.post.publishDate).toISOString().slice(0, 16)
			: ''
	);
	let metaTitle = $state(data.post?.metaTitle ?? '');
	let metaDescription = $state(data.post?.metaDescription ?? '');
	let ogImage = $state(data.post?.ogImage ?? '');
	let showPreview = $state(false);
	let seoOpen = $state(false);
	let saving = $state(false);

	let uploading = $state<Record<string, boolean>>({});

	// Auto-generate slug from title
	function onTitleChange() {
		if (data.isNew && !slugManuallyEdited) {
			slug = generateSlug(title);
		}
	}

	let slugManuallyEdited = $state(false);
	function onSlugInput() {
		slugManuallyEdited = true;
	}

	async function uploadFile(key: string, file: File, onSuccess: (url: string) => void) {
		uploading[key] = true;
		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('section', `blog-${key}`);
			const res = await fetch('/api/upload', { method: 'POST', body: fd });
			if (!res.ok) return;
			const { url } = await res.json();
			onSuccess(url);
		} finally {
			uploading[key] = false;
		}
	}

	function handleFileChange(event: Event, key: string, onSuccess: (url: string) => void) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadFile(key, file, onSuccess);
	}

	function handleSubmit() {
		saving = true;
	}

	function submitAndPublish() {
		status = 'published';
		if (!publishDate) {
			publishDate = new Date().toISOString().slice(0, 16);
		}
	}

	$effect(() => {
		onTitleChange();
	});
</script>

<svelte:head>
	<title>{data.isNew ? m.blog_new_post() : m.blog_edit_post()} — Admin — Break the Box</title>
</svelte:head>

<div class="editor">
	<a href="/admin/blog" class="back-link">
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
			<path d="M11 4L6 9l5 5" />
		</svg>
		{m.blog_back_to_list()}
	</a>

	<form method="POST" action="?/save" onsubmit={handleSubmit}>
		<input type="hidden" name="headerImage" value={headerImage} />
		<input type="hidden" name="ogImage" value={ogImage} />

		<div class="editor-layout">
			<!-- ═══════ Main Column ═══════ -->
			<div class="editor-main">
				<div class="field">
					<label for="title">{m.blog_title_label()}</label>
					<input
						id="title"
						name="title"
						type="text"
						class="input input-title"
						bind:value={title}
						placeholder="Titel des Blogposts"
						required
					/>
				</div>

				<div class="field">
					<label for="slug">{m.blog_slug_label()}</label>
					<div class="slug-row">
						<span class="slug-prefix">/blog/</span>
						<input
							id="slug"
							name="slug"
							type="text"
							class="input slug-input"
							bind:value={slug}
							oninput={onSlugInput}
							placeholder="url-slug"
						/>
					</div>
				</div>

				<!-- Editor / Preview Toggle -->
				<div class="field">
					<div class="editor-tabs">
						<button
							type="button"
							class="tab-btn"
							class:active={!showPreview}
							onclick={() => showPreview = false}
						>{m.blog_editor()}</button>
						<button
							type="button"
							class="tab-btn"
							class:active={showPreview}
							onclick={() => showPreview = true}
						>{m.blog_preview()}</button>
					</div>

					{#if showPreview}
						<div class="preview-pane prose">
							{#if content}
								{@html renderMarkdownBlock(content)}
							{:else}
								<p class="preview-empty">Noch kein Inhalt vorhanden.</p>
							{/if}
						</div>
					{:else}
						<textarea
							name="content"
							class="textarea content-editor"
							bind:value={content}
							placeholder="Schreibe deinen Blogpost in Markdown...

# Überschrift

Text mit **fett** und *kursiv*.

> Zitat

- Aufzählung
- Punkt 2

![Bild](url)"
							rows="24"
						></textarea>
					{/if}
				</div>
			</div>

			<!-- ═══════ Sidebar ═══════ -->
			<div class="editor-sidebar">
				<!-- Status -->
				<div class="sidebar-section">
					<div class="field">
						<label for="status">{m.blog_status_label()}</label>
						<select id="status" name="status" class="input" bind:value={status}>
							<option value="draft">{m.blog_status_draft()}</option>
							<option value="published">{m.blog_status_published()}</option>
							<option value="scheduled">{m.blog_status_scheduled()}</option>
						</select>
					</div>

					{#if status === 'published' || status === 'scheduled'}
						<div class="field">
							<label for="publishDate">{m.blog_publish_date_label()}</label>
							<input
								id="publishDate"
								name="publishDate"
								type="datetime-local"
								class="input"
								bind:value={publishDate}
							/>
						</div>
					{/if}
				</div>

				<!-- Header Image -->
				<div class="sidebar-section">
					<div class="field">
						<label>{m.blog_header_image_label()}</label>
						<div class="upload-area">
							{#if headerImage}
								<div class="image-preview">
									<img src={headerImage} alt="Header" />
									<button
										type="button"
										class="btn-remove-img"
										onclick={() => { headerImage = ''; }}
									>&times;</button>
								</div>
							{/if}
							<label class="btn-upload" class:uploading={uploading['header']}>
								<input
									type="file"
									accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
									onchange={(e) => handleFileChange(e, 'header', (url) => { headerImage = url; })}
									hidden
								/>
								{#if uploading['header']}
									Hochladen…
								{:else}
									{headerImage ? 'Ersetzen' : 'Bild hochladen'}
								{/if}
							</label>
						</div>
					</div>
				</div>

				<!-- Excerpt -->
				<div class="sidebar-section">
					<div class="field">
						<label for="excerpt">{m.blog_excerpt_label()}</label>
						<textarea
							id="excerpt"
							name="excerpt"
							class="textarea"
							bind:value={excerpt}
							placeholder="Kurze Zusammenfassung für Vorschaukarten"
							rows="3"
						></textarea>
					</div>
				</div>

				<!-- Tags -->
				<div class="sidebar-section">
					<div class="field">
						<label for="tags">{m.blog_tags_label()}</label>
						<input
							id="tags"
							name="tags"
							type="text"
							class="input"
							bind:value={tagsString}
							placeholder="KI, Strategie, Governance"
						/>
						<span class="field-hint">{m.blog_tags_hint()}</span>
					</div>
				</div>

				<!-- SEO -->
				<details class="sidebar-section seo-details" bind:open={seoOpen}>
					<summary class="seo-summary">{m.blog_seo_section()}</summary>
					<div class="seo-fields">
						<div class="field">
							<label for="metaTitle">{m.blog_meta_title_label()}</label>
							<input
								id="metaTitle"
								name="metaTitle"
								type="text"
								class="input"
								bind:value={metaTitle}
								placeholder={title || 'Titel des Blogposts'}
							/>
							<span class="field-hint">{m.blog_meta_title_hint()}</span>
						</div>
						<div class="field">
							<label for="metaDescription">{m.blog_meta_description_label()}</label>
							<textarea
								id="metaDescription"
								name="metaDescription"
								class="textarea"
								bind:value={metaDescription}
								placeholder={excerpt || 'Kurzbeschreibung für Suchmaschinen'}
								rows="2"
							></textarea>
							<span class="field-hint">{m.blog_meta_description_hint()}</span>
						</div>
						<div class="field">
							<label>{m.blog_og_image_label()}</label>
							<div class="upload-area">
								{#if ogImage}
									<div class="image-preview image-preview-sm">
										<img src={ogImage} alt="OG" />
										<button
											type="button"
											class="btn-remove-img"
											onclick={() => { ogImage = ''; }}
										>&times;</button>
									</div>
								{/if}
								<label class="btn-upload" class:uploading={uploading['og']}>
									<input
										type="file"
										accept="image/jpeg,image/png,image/webp"
										onchange={(e) => handleFileChange(e, 'og', (url) => { ogImage = url; })}
										hidden
									/>
									{#if uploading['og']}
										Hochladen…
									{:else}
										{ogImage ? 'Ersetzen' : 'Bild hochladen'}
									{/if}
								</label>
							</div>
							<span class="field-hint">{m.blog_og_image_hint()}</span>
						</div>
					</div>
				</details>
			</div>
		</div>

		<!-- ═══════ Actions ═══════ -->
		<div class="editor-actions">
			<a href="/admin/blog" class="btn-cancel">Abbrechen</a>
			<div class="actions-right">
				<button type="submit" class="btn-save" disabled={saving}>
					{saving ? 'Speichern…' : m.blog_save()}
				</button>
				{#if status === 'draft'}
					<button
						type="submit"
						class="btn-publish"
						disabled={saving}
						onclick={submitAndPublish}
					>
						{m.blog_save_publish()}
					</button>
				{/if}
			</div>
		</div>
	</form>
</div>

<style>
	/* ═══════ Layout ═══════ */
	.editor {
		max-width: 1100px;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: var(--space-lg);
		transition: color var(--t-fast);
	}
	.back-link:hover { color: var(--btb-steel); }

	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);
	}

	/* ═══════ Main Column ═══════ */
	.editor-main {
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
	.input,
	.textarea {
		padding: 10px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 0.88rem;
		font-family: var(--ff-ui);
		color: var(--text-primary);
		background: var(--bg-surface);
		transition: border-color var(--t-fast), box-shadow var(--t-fast);
	}
	.input:focus,
	.textarea:focus {
		outline: none;
		border-color: var(--btb-steel);
		box-shadow: 0 0 0 3px var(--btb-steel-subtle);
	}
	select.input {
		cursor: pointer;
	}
	.textarea {
		resize: vertical;
		min-height: 80px;
		line-height: 1.6;
	}
	.input-title {
		font-size: 1.3rem;
		font-weight: 700;
		padding: 14px;
	}
	.field-hint {
		font-size: 0.72rem;
		color: var(--text-muted);
	}

	/* ═══════ Slug ═══════ */
	.slug-row {
		display: flex;
		align-items: center;
	}
	.slug-prefix {
		padding: 10px 12px;
		font-size: 0.85rem;
		color: var(--text-muted);
		background: var(--bg-elevated);
		border: 1.5px solid var(--border);
		border-right: none;
		border-radius: var(--radius-sm) 0 0 var(--radius-sm);
	}
	.slug-input {
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		flex: 1;
	}

	/* ═══════ Editor Tabs ═══════ */
	.editor-tabs {
		display: flex;
		gap: 0;
		border-bottom: 2px solid var(--border);
	}
	.tab-btn {
		padding: 8px 20px;
		font-size: 0.82rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		color: var(--text-muted);
		background: none;
		border: none;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: color var(--t-fast), border-color var(--t-fast);
	}
	.tab-btn.active {
		color: var(--btb-steel);
		border-bottom-color: var(--btb-steel);
	}
	.tab-btn:hover:not(.active) {
		color: var(--text-primary);
	}

	/* ═══════ Content Editor ═══════ */
	.content-editor {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
		line-height: 1.7;
		min-height: 500px;
		border-top: none;
		border-radius: 0 0 var(--radius-sm) var(--radius-sm);
	}

	/* ═══════ Preview ═══════ */
	.preview-pane {
		padding: 24px;
		min-height: 500px;
		border: 1.5px solid var(--border);
		border-top: none;
		border-radius: 0 0 var(--radius-sm) var(--radius-sm);
		background: var(--bg-surface);
		overflow-y: auto;
	}
	.preview-empty {
		color: var(--text-muted);
		font-style: italic;
	}

	/* Prose styling for rendered markdown */
	.prose :global(h1) { font-size: 1.5rem; font-weight: 700; margin: 1.5em 0 0.5em; }
	.prose :global(h2) { font-size: 1.25rem; font-weight: 600; margin: 1.3em 0 0.4em; }
	.prose :global(h3) { font-size: 1.1rem; font-weight: 600; margin: 1.2em 0 0.3em; }
	.prose :global(p) { margin: 0.8em 0; line-height: 1.7; }
	.prose :global(ul), .prose :global(ol) { margin: 0.8em 0; padding-left: 1.5em; }
	.prose :global(li) { margin: 0.3em 0; line-height: 1.6; }
	.prose :global(blockquote) {
		border-left: 3px solid var(--btb-teal);
		padding: 8px 16px;
		margin: 1em 0;
		color: var(--text-secondary);
		background: var(--bg-elevated);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}
	.prose :global(code) {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.85em;
		background: var(--bg-elevated);
		padding: 2px 6px;
		border-radius: 3px;
	}
	.prose :global(pre) {
		background: var(--bg-elevated);
		padding: 16px;
		border-radius: var(--radius-sm);
		overflow-x: auto;
		margin: 1em 0;
	}
	.prose :global(pre code) {
		background: none;
		padding: 0;
	}
	.prose :global(img) {
		max-width: 100%;
		border-radius: var(--radius-sm);
		margin: 1em 0;
	}
	.prose :global(a) {
		color: var(--btb-teal);
		text-decoration: underline;
	}
	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2em 0;
	}

	/* ═══════ Sidebar ═══════ */
	.editor-sidebar {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.sidebar-section {
		padding: var(--space-md) 0;
		border-bottom: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.sidebar-section:first-child {
		padding-top: 0;
	}

	/* ═══════ SEO Details ═══════ */
	.seo-details {
		border-bottom: none;
	}
	.seo-summary {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		cursor: pointer;
		padding: 4px 0;
	}
	.seo-summary:hover {
		color: var(--btb-steel);
	}
	.seo-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding-top: var(--space-sm);
	}

	/* ═══════ Upload ═══════ */
	.upload-area {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.image-preview {
		position: relative;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}
	.image-preview img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 180px;
		object-fit: cover;
	}
	.image-preview-sm img {
		max-height: 100px;
	}
	.btn-remove-img {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		line-height: 1;
	}
	.btn-remove-img:hover { background: var(--color-error); }
	.btn-upload {
		display: inline-flex;
		align-items: center;
		padding: 8px 14px;
		background: var(--bg-page);
		color: var(--text-secondary);
		border: 1.5px dashed var(--border);
		border-radius: var(--radius-sm);
		font-size: 0.78rem;
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

	/* ═══════ Actions ═══════ */
	.editor-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-lg);
		border-top: 1px solid var(--border);
	}
	.actions-right {
		display: flex;
		gap: var(--space-sm);
	}
	.btn-cancel {
		font-size: 0.85rem;
		color: var(--text-secondary);
		text-decoration: none;
		padding: 10px 16px;
		transition: color var(--t-fast);
	}
	.btn-cancel:hover { color: var(--text-primary); }
	.btn-save {
		padding: 10px 24px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-size: 0.88rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: background var(--t-fast);
	}
	.btn-save:hover:not(:disabled) { background: var(--btb-steel-hover); }
	.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
	.btn-publish {
		padding: 10px 24px;
		background: #059669;
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-size: 0.88rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		cursor: pointer;
		transition: background var(--t-fast);
	}
	.btn-publish:hover:not(:disabled) { background: #047857; }
	.btn-publish:disabled { opacity: 0.6; cursor: not-allowed; }

	/* ═══════ Responsive ═══════ */
	@media (max-width: 768px) {
		.editor-layout {
			grid-template-columns: 1fr;
		}
		.editor-sidebar {
			order: -1;
		}
	}
</style>
