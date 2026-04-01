<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { BlogPostRow } from '$lib/server/db/queries/blog';

	let { data, form } = $props();
	let posts = $derived(data.posts as BlogPostRow[]);

	function formatDate(date: Date | string | null): string {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('de-CH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function confirmDelete(event: Event) {
		if (!confirm(m.blog_delete_confirm())) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>{m.blog_admin_title()} — Admin — Break the Box</title>
</svelte:head>

<div class="blog-admin">
	<div class="blog-header">
		<div>
			<a href="/admin" class="back-link">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
					<path d="M11 4L6 9l5 5" />
				</svg>
				Zurück zum Dashboard
			</a>
			<h1>{m.blog_admin_title()}</h1>
			<p class="blog-subtitle">{m.blog_admin_subtitle()}</p>
		</div>
		<a href="/admin/blog/new" class="btn-new">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path d="M8 3v10M3 8h10" />
			</svg>
			{m.blog_new_post()}
		</a>
	</div>

	{#if form?.success}
		<div class="feedback feedback-success">Aktion erfolgreich.</div>
	{/if}
	{#if form?.error}
		<div class="feedback feedback-error">{form.error}</div>
	{/if}

	{#if posts.length === 0}
		<div class="empty-state">
			<p class="empty-title">{m.blog_empty_state()}</p>
			<p class="empty-hint">{m.blog_empty_hint()}</p>
			<a href="/admin/blog/new" class="btn-new">{m.blog_new_post()}</a>
		</div>
	{:else}
		<div class="post-list">
			{#each posts as post}
				<div class="post-card">
					<div class="post-card-main">
						{#if post.headerImage}
							<img src={post.headerImage} alt="" class="post-thumb" />
						{/if}
						<div class="post-info">
							<div class="post-meta">
								<span class="status-badge status-{post.status}">
									{#if post.status === 'draft'}{m.blog_status_draft()}
									{:else if post.status === 'published'}{m.blog_status_published()}
									{:else}{m.blog_status_scheduled()}
									{/if}
								</span>
								{#if post.tags.length > 0}
									{#each post.tags as tag}
										<span class="post-tag">{tag}</span>
									{/each}
								{/if}
							</div>
							<a href="/admin/blog/{post.id}" class="post-title">{post.title}</a>
							{#if post.excerpt}
								<p class="post-excerpt">{post.excerpt}</p>
							{/if}
							<div class="post-dates">
								<span>/blog/{post.slug}</span>
								<span>·</span>
								<span>{formatDate(post.publishDate ?? post.createdAt)}</span>
							</div>
						</div>
					</div>
					<div class="post-actions">
						<a href="/admin/blog/{post.id}" class="action-btn" title="Bearbeiten">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
								<path d="M11.5 2.5l2 2-8 8H3.5v-2z" />
							</svg>
						</a>
						{#if post.status === 'draft' || post.status === 'scheduled'}
							<form method="POST" action="?/publish" style="display:contents">
								<input type="hidden" name="postId" value={post.id} />
								<button type="submit" class="action-btn action-publish" title="Veröffentlichen">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
										<path d="M3 8l4 4 6-6" />
									</svg>
								</button>
							</form>
						{:else}
							<form method="POST" action="?/unpublish" style="display:contents">
								<input type="hidden" name="postId" value={post.id} />
								<button type="submit" class="action-btn action-unpublish" title="Zurückziehen">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
										<path d="M4 4l8 8M12 4l-8 8" />
									</svg>
								</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" onsubmit={confirmDelete} style="display:contents">
							<input type="hidden" name="postId" value={post.id} />
							<button type="submit" class="action-btn action-delete" title="Löschen">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
									<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" />
								</svg>
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.blog-admin {
		max-width: 900px;
	}

	/* ═══════ Header ═══════ */
	.blog-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-xl);
		gap: var(--space-md);
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
	.back-link:hover { color: var(--btb-steel); }
	.blog-header h1 {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.blog-subtitle {
		font-size: 0.88rem;
		color: var(--text-secondary);
	}
	.btn-new {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 20px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-size: 0.85rem;
		font-weight: 600;
		font-family: var(--ff-ui);
		text-decoration: none;
		cursor: pointer;
		transition: background var(--t-fast);
		white-space: nowrap;
		flex-shrink: 0;
	}
	.btn-new:hover { background: var(--btb-steel-hover); }

	/* ═══════ Feedback ═══════ */
	.feedback {
		padding: 10px 16px;
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: var(--space-lg);
	}
	.feedback-success {
		background: rgba(52, 211, 153, 0.12);
		color: #059669;
	}
	.feedback-error {
		background: rgba(251, 113, 133, 0.12);
		color: #e11d48;
	}

	/* ═══════ Empty State ═══════ */
	.empty-state {
		text-align: center;
		padding: var(--space-2xl) var(--space-xl);
		background: var(--bg-surface);
		border: 1.5px dashed var(--border);
		border-radius: var(--radius-card);
	}
	.empty-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.empty-hint {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: var(--space-lg);
	}

	/* ═══════ Post List ═══════ */
	.post-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.post-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		padding: 16px 20px;
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		transition: border-color var(--t-fast), box-shadow var(--t-fast);
	}
	.post-card:hover {
		border-color: var(--btb-steel-light);
		box-shadow: var(--shadow-card);
	}
	.post-card-main {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		flex: 1;
		min-width: 0;
	}
	.post-thumb {
		width: 80px;
		height: 52px;
		border-radius: 6px;
		object-fit: cover;
		flex-shrink: 0;
	}
	.post-info {
		flex: 1;
		min-width: 0;
	}
	.post-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
		flex-wrap: wrap;
	}
	.post-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-heading);
		text-decoration: none;
		display: block;
		margin-bottom: 2px;
	}
	.post-title:hover { color: var(--btb-steel); }
	.post-excerpt {
		font-size: 0.8rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 4px;
	}
	.post-dates {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		color: var(--text-muted);
	}

	/* ═══════ Badges ═══════ */
	.status-badge {
		display: inline-block;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 2px 8px;
		border-radius: var(--radius-pill);
	}
	.status-draft {
		background: var(--bg-elevated);
		color: var(--text-muted);
	}
	.status-published {
		background: rgba(52, 211, 153, 0.15);
		color: #059669;
	}
	.status-scheduled {
		background: rgba(251, 191, 36, 0.15);
		color: #b45309;
	}
	.post-tag {
		font-size: 0.68rem;
		font-weight: 500;
		color: var(--btb-steel);
		background: var(--btb-steel-subtle);
		padding: 1px 7px;
		border-radius: var(--radius-pill);
	}

	/* ═══════ Actions ═══════ */
	.post-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.action-btn {
		width: 32px;
		height: 32px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg-surface);
		color: var(--text-muted);
		cursor: pointer;
		transition: all var(--t-fast);
		text-decoration: none;
		padding: 0;
	}
	.action-btn:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
		border-color: var(--btb-steel-subtle);
	}
	.action-publish:hover {
		color: #059669;
		border-color: rgba(52, 211, 153, 0.3);
	}
	.action-unpublish:hover {
		color: var(--text-secondary);
	}
	.action-delete:hover {
		color: var(--color-error);
		border-color: rgba(251, 113, 133, 0.3);
		background: rgba(251, 113, 133, 0.08);
	}

	@media (max-width: 640px) {
		.blog-header {
			flex-direction: column;
		}
		.post-card {
			flex-direction: column;
			align-items: flex-start;
		}
		.post-actions {
			align-self: flex-end;
		}
		.post-thumb {
			display: none;
		}
	}
</style>
