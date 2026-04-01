<script lang="ts">
	import { browser } from '$app/environment';
	import type { BlogContentBlocks } from '$lib/types/content';
	import { createEditorTools } from './block-tools';

	let {
		content = $bindable<BlogContentBlocks | null>(null),
		placeholder = 'Beginne zu schreiben oder klicke auf + für einen neuen Block...'
	}: {
		content?: BlogContentBlocks | null;
		placeholder?: string;
	} = $props();

	let editorContainer: HTMLDivElement;
	let editorInstance: import('@editorjs/editorjs').default | null = $state(null);
	let isReady = $state(false);

	async function uploadImage(file: File): Promise<{ success: boolean; file: { url: string } }> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('section', 'blog-content');

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.url) {
				return { success: true, file: { url: data.url } };
			}
			return { success: false, file: { url: '' } };
		} catch {
			return { success: false, file: { url: '' } };
		}
	}

	$effect(() => {
		if (!browser || !editorContainer) return;

		let editor: import('@editorjs/editorjs').default | null = null;

		(async () => {
			const EditorJS = (await import('@editorjs/editorjs')).default;
			const tools = await createEditorTools(uploadImage);

			editor = new EditorJS({
				holder: editorContainer,
				tools,
				data: content ?? undefined,
				placeholder,
				inlineToolbar: ['bold', 'italic', 'link', 'inlineCode'],
				onChange: async (api) => {
					const outputData = await api.saver.save();
					content = outputData as BlogContentBlocks;
				},
				onReady: () => {
					isReady = true;
				}
			});

			editorInstance = editor;
		})();

		return () => {
			if (editor && typeof editor.destroy === 'function') {
				editor.destroy();
				editor = null;
				editorInstance = null;
				isReady = false;
			}
		};
	});

	export function getEditor() {
		return editorInstance;
	}
</script>

<div class="block-editor" class:is-ready={isReady}>
	{#if !isReady}
		<div class="editor-loading">
			<div class="loading-spinner"></div>
			<span>Editor wird geladen...</span>
		</div>
	{/if}
	<div bind:this={editorContainer} class="editor-container"></div>
</div>

<style>
	.block-editor {
		position: relative;
		min-height: 400px;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		background: var(--color-surface, #fff);
	}

	.editor-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 2rem;
		color: var(--color-text-muted, #64748b);
	}

	.loading-spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--color-border, #e2e8f0);
		border-top-color: var(--color-primary, #0f766e);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.editor-container {
		padding: 1rem 0;
	}

	/* Editor.js overrides */
	.block-editor :global(.ce-block__content) {
		max-width: 100%;
		padding: 0 1.5rem;
	}

	.block-editor :global(.ce-toolbar__content) {
		max-width: 100%;
	}

	.block-editor :global(.ce-toolbar__plus) {
		color: var(--color-primary, #0f766e);
	}

	.block-editor :global(.ce-toolbar__settings-btn) {
		color: var(--color-text-muted, #64748b);
	}

	.block-editor :global(.ce-block--focused) {
		background: var(--color-surface-hover, #f8fafc);
	}

	.block-editor :global(.ce-paragraph) {
		font-size: 1rem;
		line-height: 1.75;
	}

	.block-editor :global(.ce-header) {
		font-weight: 700;
	}

	.block-editor :global(.cdx-quote__text) {
		border-left: 3px solid var(--color-primary, #0f766e);
		padding-left: 1rem;
		font-style: italic;
	}

	.block-editor :global(.image-tool__image-picture img) {
		border-radius: 0.5rem;
	}

	.block-editor :global(.ce-code__textarea) {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		border-radius: 0.375rem;
	}
</style>
