<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { BlogContentBlocks, SeoScoreResult, SeoSuggestion } from '$lib/types/content';

	let {
		title,
		contentBlocks,
		metaTitle,
		metaDescription = $bindable(''),
		seoScore = $bindable<number | null>(null)
	}: {
		title: string;
		contentBlocks: BlogContentBlocks | null;
		metaTitle: string;
		metaDescription: string;
		seoScore: number | null;
	} = $props();

	let generatingMeta = $state(false);
	let analyzingSeo = $state(false);
	let seoResult = $state<SeoScoreResult | null>(null);
	let aiError = $state('');

	function hasContent(): boolean {
		return !!contentBlocks?.blocks?.length && !!title;
	}

	async function generateMeta() {
		if (!hasContent()) return;
		generatingMeta = true;
		aiError = '';

		try {
			const res = await fetch('/api/ai/blog/meta-description', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, blocks: contentBlocks })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message ?? 'Fehler beim Generieren');
			}

			const data = await res.json();
			metaDescription = data.metaDescription;
		} catch (err) {
			aiError = err instanceof Error ? err.message : 'Unbekannter Fehler';
		} finally {
			generatingMeta = false;
		}
	}

	async function analyzeSeo() {
		if (!hasContent()) return;
		analyzingSeo = true;
		aiError = '';

		try {
			const res = await fetch('/api/ai/blog/seo-score', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, blocks: contentBlocks, metaTitle, metaDescription })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message ?? 'Fehler bei der Analyse');
			}

			const data: SeoScoreResult = await res.json();
			seoResult = data;
			seoScore = data.score;
		} catch (err) {
			aiError = err instanceof Error ? err.message : 'Unbekannter Fehler';
		} finally {
			analyzingSeo = false;
		}
	}

	function scoreColor(score: number): string {
		if (score >= 80) return 'var(--color-success, #16a34a)';
		if (score >= 60) return 'var(--color-warning, #ca8a04)';
		if (score >= 40) return 'var(--color-warning, #ea580c)';
		return 'var(--color-error, #dc2626)';
	}

	function scoreLabel(score: number): string {
		if (score >= 80) return m.blog_seo_score_excellent();
		if (score >= 60) return m.blog_seo_score_good();
		if (score >= 40) return m.blog_seo_score_needs_work();
		return m.blog_seo_score_poor();
	}

	function priorityIcon(priority: SeoSuggestion['priority']): string {
		if (priority === 'high') return '🔴';
		if (priority === 'medium') return '🟡';
		return '🟢';
	}
</script>

<div class="ai-panel">
	<h3 class="panel-title">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 1 9 9 9.75 9.75 0 0 1-2.2 6.2L21 21l-2.8 2.2A9.75 9.75 0 0 1 12 21a9 9 0 0 1 0-18Z"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9.5 15.5a3.5 3.5 0 0 0 5 0"/></svg>
		{m.blog_ai_section()}
	</h3>

	{#if aiError}
		<div class="ai-error">{aiError}</div>
	{/if}

	<!-- SEO Score -->
	<div class="ai-block">
		<div class="ai-block-header">
			<span>{m.blog_ai_seo_score()}</span>
			{#if seoScore !== null}
				<span class="score-badge" style="background: {scoreColor(seoScore)}">
					{seoScore}/100
				</span>
			{/if}
		</div>

		{#if seoScore !== null}
			<div class="score-bar-track">
				<div
					class="score-bar-fill"
					style="width: {seoScore}%; background: {scoreColor(seoScore)}"
				></div>
			</div>
			<span class="score-label" style="color: {scoreColor(seoScore)}">
				{scoreLabel(seoScore)}
			</span>
		{/if}

		<button
			class="ai-btn"
			onclick={analyzeSeo}
			disabled={analyzingSeo || !hasContent()}
		>
			{#if analyzingSeo}
				<span class="spinner"></span>
				{m.blog_ai_analyzing()}
			{:else}
				{m.blog_ai_analyze_seo()}
			{/if}
		</button>
	</div>

	<!-- SEO Suggestions -->
	{#if seoResult?.suggestions?.length}
		<div class="suggestions">
			{#each seoResult.suggestions as suggestion}
				<div class="suggestion">
					<span class="suggestion-priority">{priorityIcon(suggestion.priority)}</span>
					<span class="suggestion-text">{suggestion.message}</span>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Generate Meta Description -->
	<div class="ai-block">
		<div class="ai-block-header">
			<span>{m.blog_ai_generate_meta()}</span>
		</div>
		<button
			class="ai-btn"
			onclick={generateMeta}
			disabled={generatingMeta || !hasContent()}
		>
			{#if generatingMeta}
				<span class="spinner"></span>
				{m.blog_ai_generating()}
			{:else}
				{m.blog_ai_generate_meta()}
			{/if}
		</button>
		{#if metaDescription}
			<p class="meta-preview">{metaDescription}</p>
			<span class="char-count" class:over={metaDescription.length > 160}>
				{metaDescription.length}/160
			</span>
		{/if}
	</div>
</div>

<style>
	.ai-panel {
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		padding: 1rem;
		background: var(--color-surface, #fff);
	}

	.panel-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-heading, #0f172a);
	}

	.ai-error {
		background: var(--color-error-bg, #fef2f2);
		color: var(--color-error, #dc2626);
		padding: 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.8125rem;
		margin-bottom: 0.75rem;
	}

	.ai-block {
		margin-bottom: 1rem;
	}

	.ai-block-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.8125rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.score-badge {
		color: white;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
	}

	.score-bar-track {
		height: 6px;
		background: var(--color-border, #e2e8f0);
		border-radius: 3px;
		margin-bottom: 0.25rem;
		overflow: hidden;
	}

	.score-bar-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.5s ease;
	}

	.score-label {
		font-size: 0.75rem;
		font-weight: 500;
		display: block;
		margin-bottom: 0.5rem;
	}

	.ai-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		width: 100%;
		padding: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border: 1px solid var(--color-primary, #0f766e);
		color: var(--color-primary, #0f766e);
		background: transparent;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.ai-btn:hover:not(:disabled) {
		background: var(--color-primary, #0f766e);
		color: white;
	}

	.ai-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spinner {
		width: 0.875rem;
		height: 0.875rem;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.suggestions {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		margin-bottom: 1rem;
	}

	.suggestion {
		display: flex;
		align-items: flex-start;
		gap: 0.375rem;
		font-size: 0.75rem;
		line-height: 1.4;
		padding: 0.375rem;
		background: var(--color-surface-hover, #f8fafc);
		border-radius: 0.25rem;
	}

	.suggestion-priority {
		flex-shrink: 0;
		font-size: 0.625rem;
	}

	.meta-preview {
		font-size: 0.75rem;
		color: var(--color-text-muted, #64748b);
		margin-top: 0.5rem;
		line-height: 1.4;
	}

	.char-count {
		font-size: 0.6875rem;
		color: var(--color-text-muted, #94a3b8);
	}

	.char-count.over {
		color: var(--color-error, #dc2626);
		font-weight: 500;
	}
</style>
