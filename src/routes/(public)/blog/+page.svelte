<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { BlogPostRow } from '$lib/server/db/queries/blog';

	let { data } = $props();
	let posts = $derived(data.posts as BlogPostRow[]);

	function formatDate(date: Date | string | null): string {
		if (!date) return '';
		return new Date(date).toLocaleDateString('de-CH', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{m.blog_page_title()} — Break the Box</title>
	<meta name="description" content={m.blog_page_subtitle()} />
	<meta property="og:title" content={m.blog_page_title()} />
	<meta property="og:description" content={m.blog_page_subtitle()} />
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content={m.blog_page_title()} />
	<meta name="twitter:description" content={m.blog_page_subtitle()} />
</svelte:head>

<div class="blog-page">
	<!-- Nav -->
	<nav class="blog-nav">
		<a href={localizeHref('/')} class="blog-nav-brand">
			<img src="/box.svg" alt="Break the Box" width="32" height="32" />
			<span>Break the Box</span>
		</a>
		<a href={localizeHref('/')} class="blog-nav-back">&larr; Zur Hauptseite</a>
	</nav>

	<header class="blog-hero">
		<h1>{m.blog_page_title()}</h1>
		<p>{m.blog_page_subtitle()}</p>
	</header>

	{#if posts.length === 0}
		<div class="blog-empty">
			<p>{m.blog_empty_state()}</p>
		</div>
	{:else}
		<div class="blog-grid">
			{#each posts as post}
				<a href={localizeHref(`/blog/${post.slug}`)} class="blog-card">
					{#if post.headerImage}
						<img src={post.headerImage} alt={post.title} class="blog-card-img" loading="lazy" decoding="async" />
					{:else}
						<div class="blog-card-img blog-card-placeholder"></div>
					{/if}
					<div class="blog-card-body">
						<div class="blog-card-meta">
							{#each post.tags as tag}
								<span class="blog-card-tag">{tag}</span>
							{/each}
							<span class="blog-card-date">{formatDate(post.publishDate)}</span>
						</div>
						<h2 class="blog-card-title">{post.title}</h2>
						{#if post.excerpt}
							<p class="blog-card-excerpt">{post.excerpt}</p>
						{/if}
						<span class="blog-card-link">{m.blog_read_more()} &rarr;</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* ═══════ Page ═══════ */
	.blog-page {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 24px 80px;
	}

	/* ═══════ Nav ═══════ */
	.blog-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		margin-bottom: var(--space-lg);
	}
	.blog-nav-brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--text-heading);
	}
	.blog-nav-back {
		font-size: 0.85rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color var(--t-fast);
	}
	.blog-nav-back:hover { color: var(--btb-steel); }

	/* ═══════ Hero ═══════ */
	.blog-hero {
		margin-bottom: var(--space-2xl);
	}
	.blog-hero h1 {
		font-size: 2.2rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 8px;
	}
	.blog-hero p {
		font-size: 1.05rem;
		color: var(--text-secondary);
		font-weight: 300;
	}

	/* ═══════ Empty ═══════ */
	.blog-empty {
		text-align: center;
		padding: var(--space-2xl);
		color: var(--text-muted);
	}

	/* ═══════ Grid ═══════ */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 28px;
	}

	/* ═══════ Card ═══════ */
	.blog-card {
		background: var(--bg-surface);
		border-radius: var(--radius-card-lg);
		overflow: hidden;
		border: 1.5px solid var(--border);
		text-decoration: none;
		transition: transform var(--t-normal), box-shadow var(--t-normal);
	}
	.blog-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-card-hover);
	}
	.blog-card-img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		display: block;
	}
	.blog-card-placeholder {
		background: linear-gradient(135deg, rgba(43, 138, 120, 0.08), var(--bg-surface));
	}
	.blog-card-body {
		padding: 24px;
	}
	.blog-card-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}
	.blog-card-tag {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--btb-teal);
		background: var(--btb-teal-subtle, rgba(43, 138, 120, 0.1));
		padding: 2px 8px;
		border-radius: var(--radius-pill);
	}
	.blog-card-date {
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.blog-card-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-heading);
		line-height: 1.3;
		margin-bottom: 8px;
	}
	.blog-card-excerpt {
		font-size: 0.88rem;
		color: var(--text-secondary);
		line-height: 1.6;
		font-weight: 300;
		margin-bottom: 14px;
	}
	.blog-card-link {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--btb-steel);
	}

	@media (max-width: 640px) {
		.blog-hero h1 { font-size: 1.6rem; }
		.blog-grid { grid-template-columns: 1fr; }
	}
</style>
