<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { browser } from '$app/environment';
	import BlockRenderer from '$lib/components/blog/BlockRenderer.svelte';
	import type { BlogContentBlocks } from '$lib/types/content';

	let { data } = $props();
	let post = $derived(data.post);
	let renderedContent = $derived(data.renderedContent);
	let contentBlocks = $derived(data.post.contentBlocks as BlogContentBlocks | null);

	function formatDate(date: Date | string | null): string {
		if (!date) return '';
		return new Date(date).toLocaleDateString('de-CH', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function goBack() {
		if (browser && window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = localizeHref('/blog');
		}
	}

	// Track page view
	$effect(() => {
		if (!browser || !post?.id) return;
		fetch('/api/blog/track-view', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ postId: post.id })
		}).catch(() => {});
	});
</script>

<svelte:head>
	<title>{post.metaTitle || post.title} — Break the Box</title>
	<meta name="description" content={post.metaDescription || post.excerpt || ''} />
	<meta property="og:title" content={post.metaTitle || post.title} />
	<meta property="og:description" content={post.metaDescription || post.excerpt || ''} />
	<meta property="og:type" content="article" />
	{#if post.ogImage || post.headerImage}
		<meta property="og:image" content={post.ogImage || post.headerImage} />
	{/if}
</svelte:head>

<div class="post-page">
	<!-- Nav -->
	<nav class="post-nav">
		<a href={localizeHref('/')} class="post-nav-brand">
			<img src="/box.svg" alt="Break the Box" width="32" height="32" />
			<span>Break the Box</span>
		</a>
		<button type="button" onclick={goBack} class="post-nav-back">&larr; {m.blog_all_posts()}</button>
	</nav>

	<article class="post-article">
		<!-- Header Image -->
		{#if post.headerImage}
			<img src={post.headerImage} alt="" class="post-hero-img" />
		{/if}

		<!-- Meta -->
		<div class="post-meta">
			{#each post.tags as tag}
				<span class="post-tag">{tag}</span>
			{/each}
		</div>

		<!-- Title -->
		<h1 class="post-title">{post.title}</h1>

		<!-- Date -->
		<div class="post-date">
			{m.blog_published_on()} {formatDate(post.publishDate)}
		</div>

		<!-- Content -->
		<div class="post-content">
			{#if contentBlocks?.blocks?.length}
				<BlockRenderer content={contentBlocks} />
			{:else}
				<div class="prose">
					{@html renderedContent}
				</div>
			{/if}
		</div>

		<!-- Back -->
		<div class="post-footer">
			<button type="button" onclick={goBack} class="post-back-link">
				&larr; {m.blog_all_posts()}
			</button>
		</div>
	</article>
</div>

<style>
	/* ═══════ Page ═══════ */
	.post-page {
		max-width: 780px;
		margin: 0 auto;
		padding: 0 24px 80px;
	}

	/* ═══════ Nav ═══════ */
	.post-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		margin-bottom: var(--space-xl);
	}
	.post-nav-brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--text-heading);
	}
	.post-nav-back {
		font-size: 0.85rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color var(--t-fast);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
	}
	.post-nav-back:hover { color: var(--btb-steel); }

	/* ═══════ Article ═══════ */
	.post-hero-img {
		width: 100%;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: var(--radius-card-lg);
		margin-bottom: var(--space-xl);
	}
	.post-meta {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: var(--space-sm);
	}
	.post-tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--btb-teal);
		background: var(--btb-teal-subtle, rgba(43, 138, 120, 0.1));
		padding: 3px 10px;
		border-radius: var(--radius-pill);
	}
	.post-title {
		font-size: 2rem;
		font-weight: 800;
		color: var(--text-heading);
		line-height: 1.2;
		margin-bottom: 12px;
	}
	.post-date {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: var(--space-xl);
	}

	/* ═══════ Content (Prose) ═══════ */
	.post-content {
		font-size: 1.02rem;
		line-height: 1.75;
		color: var(--text-primary);
	}
	.prose :global(h1) { font-size: 1.5rem; font-weight: 700; margin: 2em 0 0.5em; }
	.prose :global(h2) { font-size: 1.3rem; font-weight: 700; margin: 1.8em 0 0.5em; }
	.prose :global(h3) { font-size: 1.1rem; font-weight: 600; margin: 1.5em 0 0.4em; }
	.prose :global(p) { margin: 1em 0; }
	.prose :global(ul), .prose :global(ol) { margin: 1em 0; padding-left: 1.5em; }
	.prose :global(li) { margin: 0.4em 0; }
	.prose :global(blockquote) {
		border-left: 3px solid var(--btb-teal);
		padding: 12px 20px;
		margin: 1.5em 0;
		color: var(--text-secondary);
		background: var(--bg-elevated);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		font-style: italic;
	}
	.prose :global(code) {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.88em;
		background: var(--bg-elevated);
		padding: 2px 6px;
		border-radius: 3px;
	}
	.prose :global(pre) {
		background: var(--bg-elevated);
		padding: 20px;
		border-radius: var(--radius-sm);
		overflow-x: auto;
		margin: 1.5em 0;
	}
	.prose :global(pre code) { background: none; padding: 0; }
	.prose :global(img) {
		max-width: 100%;
		border-radius: var(--radius-sm);
		margin: 1.5em 0;
	}
	.prose :global(a) {
		color: var(--btb-teal);
		text-decoration: underline;
	}
	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2.5em 0;
	}

	/* ═══════ Footer ═══════ */
	.post-footer {
		margin-top: var(--space-2xl);
		padding-top: var(--space-xl);
		border-top: 1px solid var(--border);
	}
	.post-back-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
		transition: color var(--t-fast);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
	}
	.post-back-link:hover { color: var(--btb-steel-hover); }

	@media (max-width: 640px) {
		.post-title { font-size: 1.5rem; }
		.post-content { font-size: 0.95rem; }
	}
</style>
