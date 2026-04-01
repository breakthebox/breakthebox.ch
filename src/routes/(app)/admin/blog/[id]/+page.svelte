<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { generateSlug } from '$lib/utils/slug';
	import BlockEditor from '$lib/components/editor/BlockEditor.svelte';
	import AiAssistPanel from '$lib/components/editor/AiAssistPanel.svelte';
	import type { BlogContentBlocks } from '$lib/types/content';

	let { data } = $props();

	let title = $state(data.post?.title ?? '');
	let slug = $state(data.post?.slug ?? '');
	let contentBlocks = $state<BlogContentBlocks | null>(
		(data.post?.contentBlocks as BlogContentBlocks | null) ?? null
	);
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
	let seoScore = $state<number | null>(data.post?.seoScore ?? null);
	let seoOpen = $state(false);
	let aiOpen = $state(true);
	let saving = $state(false);

	let uploading = $state<Record<string, boolean>>({});
	let slugManuallyEdited = $state(false);

	// Auto-generate slug from title
	function onTitleChange() {
		if (data.isNew && !slugManuallyEdited) {
			slug = generateSlug(title);
		}
	}

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

	function handleHeaderDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (file?.type.startsWith('image/')) {
			uploadFile('header', file, (url) => (headerImage = url));
		}
	}

	function handleHeaderInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			uploadFile('header', file, (url) => (headerImage = url));
		}
	}

	function handleSubmit(e: SubmitEvent) {
		saving = true;
	}

	let viewCount = $derived(data.viewCount ?? 0);
</script>

<div class="editor-page">
	<form method="POST" action="?/save" class="editor-layout" onsubmit={handleSubmit}>
		<!-- Hidden fields for content blocks -->
		<input type="hidden" name="contentBlocks" value={contentBlocks ? JSON.stringify(contentBlocks) : ''} />
		<input type="hidden" name="content" value="" />
		<input type="hidden" name="seoScore" value={seoScore ?? ''} />

		<!-- Main Column -->
		<div class="editor-main">
			<div class="editor-header">
				<h1>{data.isNew ? m.blog_new_post() : m.blog_edit_post()}</h1>
				{#if !data.isNew && viewCount > 0}
					<span class="view-count" title={m.blog_views_label()}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
						{viewCount} {m.blog_views()}
					</span>
				{/if}
			</div>

			<!-- Title -->
			<div class="field">
				<label for="title">{m.blog_title_label()}</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					oninput={onTitleChange}
					placeholder="Titel des Blogposts"
					required
				/>
			</div>

			<!-- Slug -->
			<div class="field">
				<label for="slug">{m.blog_slug_label()}</label>
				<input
					type="text"
					id="slug"
					name="slug"
					bind:value={slug}
					oninput={onSlugInput}
					placeholder="url-slug"
				/>
			</div>

			<!-- Block Editor -->
			<div class="field">
				<label>{m.blog_content_label()}</label>
				<BlockEditor bind:content={contentBlocks} />
			</div>
		</div>

		<!-- Sidebar -->
		<div class="editor-sidebar">
			<!-- Actions -->
			<div class="sidebar-section actions-section">
				<button type="submit" class="btn-primary" disabled={saving}>
					{#if saving}
						<span class="spinner"></span>
					{/if}
					{m.blog_save()}
				</button>
				{#if status === 'draft'}
					<button
						type="submit"
						class="btn-secondary"
						disabled={saving}
						onclick={() => (status = 'published')}
					>
						{m.blog_save_publish()}
					</button>
				{/if}
				<a href={localizeHref('/admin/blog')} class="btn-ghost">
					{m.blog_back_to_list()}
				</a>
			</div>

			<!-- Status -->
			<div class="sidebar-section">
				<label for="status">{m.blog_status_label()}</label>
				<select id="status" name="status" bind:value={status}>
					<option value="draft">{m.blog_status_draft()}</option>
					<option value="published">{m.blog_status_published()}</option>
					<option value="scheduled">{m.blog_status_scheduled()}</option>
				</select>
				<div class="field-sm">
					<label for="publishDate">{m.blog_publish_date_label()}</label>
					<input type="datetime-local" id="publishDate" name="publishDate" bind:value={publishDate} />
				</div>
			</div>

			<!-- Header Image -->
			<div class="sidebar-section">
				<label>{m.blog_header_image_label()}</label>
				{#if headerImage}
					<div class="image-preview">
						<img src={headerImage} alt="Header" />
						<div class="image-actions">
							<label class="btn-sm">
								{m.blog_change_image?.() ?? 'Ändern'}
								<input type="file" accept="image/*" hidden onchange={handleHeaderInput} />
							</label>
							<button type="button" class="btn-sm btn-danger" onclick={() => (headerImage = '')}>
								{m.blog_remove_image?.() ?? 'Entfernen'}
							</button>
						</div>
					</div>
				{:else}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="dropzone"
						ondrop={handleHeaderDrop}
						ondragover={(e) => e.preventDefault()}
					>
						{#if uploading['header']}
							<span class="spinner"></span>
							<span>Wird hochgeladen...</span>
						{:else}
							<label class="dropzone-label">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
								<span>Bild hochladen oder hierhin ziehen</span>
								<input type="file" accept="image/*" hidden onchange={handleHeaderInput} />
							</label>
						{/if}
					</div>
				{/if}
				<input type="hidden" name="headerImage" value={headerImage} />
			</div>

			<!-- Excerpt -->
			<div class="sidebar-section">
				<label for="excerpt">{m.blog_excerpt_label()}</label>
				<textarea id="excerpt" name="excerpt" bind:value={excerpt} rows="3" placeholder="Kurzer Teaser-Text..."></textarea>
			</div>

			<!-- Tags -->
			<div class="sidebar-section">
				<label for="tags">{m.blog_tags_label()}</label>
				<input type="text" id="tags" name="tags" bind:value={tagsString} placeholder="KI, Strategie, Governance" />
				<span class="hint">{m.blog_tags_hint()}</span>
			</div>

			<!-- AI Assist -->
			<div class="sidebar-section">
				<button type="button" class="section-toggle" onclick={() => (aiOpen = !aiOpen)}>
					<span>{m.blog_ai_section()}</span>
					<span class="toggle-icon" class:open={aiOpen}>▸</span>
				</button>
				{#if aiOpen}
					<div class="section-content">
						<AiAssistPanel
							{title}
							{contentBlocks}
							{metaTitle}
							bind:metaDescription
							bind:seoScore
						/>
					</div>
				{/if}
			</div>

			<!-- SEO Details -->
			<div class="sidebar-section">
				<button type="button" class="section-toggle" onclick={() => (seoOpen = !seoOpen)}>
					<span>{m.blog_seo_section()}</span>
					<span class="toggle-icon" class:open={seoOpen}>▸</span>
				</button>
				{#if seoOpen}
					<div class="section-content">
						<div class="field-sm">
							<label for="metaTitle">{m.blog_meta_title_label()}</label>
							<input type="text" id="metaTitle" name="metaTitle" bind:value={metaTitle} />
							<span class="hint">{m.blog_meta_title_hint()}</span>
						</div>
						<div class="field-sm">
							<label for="metaDescription">{m.blog_meta_description_label()}</label>
							<textarea id="metaDescription" name="metaDescription" bind:value={metaDescription} rows="3"></textarea>
							<span class="hint">{m.blog_meta_description_hint()}</span>
						</div>
						<div class="field-sm">
							<label for="ogImage">{m.blog_og_image_label()}</label>
							<input type="text" id="ogImage" name="ogImage" bind:value={ogImage} />
							<span class="hint">{m.blog_og_image_hint()}</span>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</form>
</div>

<style>
	.editor-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 1.5rem;
		align-items: start;
	}

	@media (max-width: 1024px) {
		.editor-layout {
			grid-template-columns: 1fr;
		}
	}

	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.editor-header h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-heading, #0f172a);
	}

	.view-count {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
	}

	.editor-main {
		min-width: 0;
	}

	.field {
		margin-bottom: 1rem;
	}

	.field label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text, #334155);
		margin-bottom: 0.375rem;
	}

	.field input[type='text'],
	.field textarea {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font-size: 0.9375rem;
		background: var(--color-surface, #fff);
		transition: border-color 0.15s;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: var(--color-primary, #0f766e);
		box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.1);
	}

	/* Sidebar */
	.editor-sidebar {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: sticky;
		top: 1rem;
	}

	.sidebar-section {
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		padding: 0.75rem;
		background: var(--color-surface, #fff);
	}

	.sidebar-section label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text, #334155);
		margin-bottom: 0.375rem;
	}

	.sidebar-section input[type='text'],
	.sidebar-section textarea,
	.sidebar-section select {
		width: 100%;
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font-size: 0.8125rem;
		background: var(--color-surface, #fff);
	}

	.sidebar-section input:focus,
	.sidebar-section textarea:focus,
	.sidebar-section select:focus {
		outline: none;
		border-color: var(--color-primary, #0f766e);
	}

	.hint {
		font-size: 0.6875rem;
		color: var(--color-text-muted, #94a3b8);
		margin-top: 0.25rem;
		display: block;
	}

	.field-sm {
		margin-top: 0.5rem;
	}

	.field-sm label {
		font-size: 0.75rem;
	}

	/* Section toggles */
	.section-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		color: var(--color-heading, #0f172a);
	}

	.toggle-icon {
		transition: transform 0.2s;
	}

	.toggle-icon.open {
		transform: rotate(90deg);
	}

	.section-content {
		margin-top: 0.75rem;
	}

	/* Buttons */
	.actions-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.btn-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		width: 100%;
		padding: 0.625rem;
		background: var(--color-primary, #0f766e);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		width: 100%;
		padding: 0.5rem;
		background: transparent;
		color: var(--color-primary, #0f766e);
		border: 1px solid var(--color-primary, #0f766e);
		border-radius: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-primary, #0f766e);
		color: white;
	}

	.btn-ghost {
		display: block;
		text-align: center;
		padding: 0.375rem;
		font-size: 0.8125rem;
		color: var(--color-text-muted, #64748b);
		text-decoration: none;
		transition: color 0.15s;
	}

	.btn-ghost:hover {
		color: var(--color-text, #334155);
	}

	/* Image upload */
	.image-preview {
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.image-preview img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 0.375rem;
	}

	.image-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.btn-sm {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn-sm:hover {
		background: var(--color-surface-hover, #f8fafc);
	}

	.btn-danger {
		color: var(--color-error, #dc2626);
		border-color: var(--color-error, #dc2626);
	}

	.btn-danger:hover {
		background: var(--color-error, #dc2626);
		color: white;
	}

	.dropzone {
		border: 2px dashed var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		padding: 1rem;
		text-align: center;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.dropzone:hover {
		border-color: var(--color-primary, #0f766e);
	}

	.dropzone-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
		cursor: pointer;
		color: var(--color-text-muted, #64748b);
		font-size: 0.8125rem;
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
