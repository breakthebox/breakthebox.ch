<script lang="ts">
	import type { BlogContentBlocks, EditorBlock } from '$lib/types/content';

	let { content }: { content: BlogContentBlocks } = $props();

	function getBlockText(block: EditorBlock): string {
		const data = block.data as Record<string, unknown>;
		return (data.text as string) ?? '';
	}
</script>

<div class="prose">
	{#each content.blocks as block (block.id)}
		{#if block.type === 'paragraph'}
			<p>{@html getBlockText(block)}</p>
		{:else if block.type === 'header'}
			{@const data = block.data as { text: string; level: number }}
			{#if data.level === 2}
				<h2>{@html data.text}</h2>
			{:else if data.level === 3}
				<h3>{@html data.text}</h3>
			{:else}
				<h4>{@html data.text}</h4>
			{/if}
		{:else if block.type === 'image'}
			{@const data = block.data as { file: { url: string }; caption?: string; withBorder?: boolean; stretched?: boolean; withBackground?: boolean }}
			<figure class="blog-image" class:with-border={data.withBorder} class:stretched={data.stretched} class:with-background={data.withBackground}>
				<img src={data.file.url} alt={data.caption ?? ''} loading="lazy" />
				{#if data.caption}
					<figcaption>{@html data.caption}</figcaption>
				{/if}
			</figure>
		{:else if block.type === 'quote'}
			{@const data = block.data as { text: string; caption?: string }}
			<blockquote>
				<p>{@html data.text}</p>
				{#if data.caption}
					<cite>{@html data.caption}</cite>
				{/if}
			</blockquote>
		{:else if block.type === 'list'}
			{@const data = block.data as { style: string; items: string[] }}
			{#if data.style === 'ordered'}
				<ol>
					{#each data.items as item}
						<li>{@html item}</li>
					{/each}
				</ol>
			{:else}
				<ul>
					{#each data.items as item}
						<li>{@html item}</li>
					{/each}
				</ul>
			{/if}
		{:else if block.type === 'code'}
			{@const data = block.data as { code: string }}
			<pre><code>{data.code}</code></pre>
		{:else if block.type === 'delimiter'}
			<hr />
		{:else if block.type === 'linkButton'}
			{@const data = block.data as { text: string; url: string; style?: string }}
			{#if data.style === 'button'}
				<p>
					<a href={data.url} class="blog-button" target="_blank" rel="noopener noreferrer">
						{data.text}
					</a>
				</p>
			{:else}
				<p>
					<a href={data.url} target="_blank" rel="noopener noreferrer">{data.text}</a>
				</p>
			{/if}
		{/if}
	{/each}
</div>

<style>
	.prose {
		font-size: 1.0625rem;
		line-height: 1.8;
		color: var(--color-text, #1e293b);
	}

	.prose :global(h2) {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 2.5rem 0 1rem;
		color: var(--color-heading, #0f172a);
	}

	.prose :global(h3) {
		font-size: 1.375rem;
		font-weight: 600;
		margin: 2rem 0 0.75rem;
		color: var(--color-heading, #0f172a);
	}

	.prose :global(h4) {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 1.5rem 0 0.5rem;
	}

	.prose :global(p) {
		margin: 1rem 0;
	}

	.prose :global(a) {
		color: var(--color-primary, #0f766e);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.prose :global(strong) {
		font-weight: 600;
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--color-primary, #0f766e);
		padding: 0.5rem 0 0.5rem 1.5rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: var(--color-text-muted, #475569);
	}

	.prose :global(blockquote cite) {
		display: block;
		margin-top: 0.5rem;
		font-size: 0.875rem;
		font-style: normal;
		color: var(--color-text-muted, #64748b);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.prose :global(li) {
		margin: 0.25rem 0;
	}

	.prose :global(pre) {
		background: var(--color-surface-alt, #1e293b);
		color: var(--color-code-text, #e2e8f0);
		padding: 1.25rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 1.5rem 0;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.prose :global(code) {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.prose :global(hr) {
		border: none;
		border-top: 2px solid var(--color-border, #e2e8f0);
		margin: 2rem 0;
	}

	.blog-image {
		margin: 2rem 0;
	}

	.blog-image :global(img) {
		width: 100%;
		border-radius: 0.5rem;
	}

	.blog-image.with-border :global(img) {
		border: 1px solid var(--color-border, #e2e8f0);
	}

	.blog-image.stretched {
		margin-left: -2rem;
		margin-right: -2rem;
	}

	.blog-image.with-background {
		background: var(--color-surface-hover, #f1f5f9);
		padding: 1rem;
		border-radius: 0.75rem;
	}

	.blog-image :global(figcaption) {
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
		margin-top: 0.5rem;
	}

	.blog-button {
		display: inline-block;
		padding: 0.625rem 1.5rem;
		background: var(--color-primary, #0f766e);
		color: white !important;
		text-decoration: none !important;
		border-radius: 0.375rem;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.blog-button:hover {
		opacity: 0.9;
	}
</style>
