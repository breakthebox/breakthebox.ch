<script lang="ts">
	import type { Snippet } from 'svelte';

	// Wiederverwendbarer, einklappbarer Eintrag für die Backoffice-Editoren.
	// Der Parent hält den offenen Index (Single-Open-Accordion) und reicht
	// expanded + Callbacks herein; der Body kommt als Snippet.
	interface Props {
		index: number;
		total: number;
		title: string;
		subtitle?: string;
		badge?: string;
		badgeActive?: boolean; // hebt das Badge farblich hervor (z.B. «Kommend»)
		expanded: boolean;
		removeLabel?: string;
		ontoggle: () => void;
		onmoveup: () => void;
		onmovedown: () => void;
		onremove: () => void;
		children: Snippet;
	}
	let {
		index,
		total,
		title,
		subtitle,
		badge,
		badgeActive = false,
		expanded,
		removeLabel = 'Eintrag löschen',
		ontoggle,
		onmoveup,
		onmovedown,
		onremove,
		children
	}: Props = $props();
</script>

<div class="acc-item" class:expanded>
	<div class="acc-header">
		<button type="button" class="acc-toggle" onclick={ontoggle}>
			<span class="acc-num">{index + 1}</span>
			<span class="acc-text">
				<span class="acc-title">{title}</span>
				{#if subtitle}<span class="acc-sub">{subtitle}</span>{/if}
			</span>
			{#if badge}<span class="acc-badge" class:acc-badge-active={badgeActive}>{badge}</span>{/if}
		</button>
		<div class="acc-actions">
			<button type="button" class="acc-icon" onclick={onmoveup} disabled={index === 0} title="Nach oben verschieben" aria-label="Nach oben verschieben">↑</button>
			<button type="button" class="acc-icon" onclick={onmovedown} disabled={index === total - 1} title="Nach unten verschieben" aria-label="Nach unten verschieben">↓</button>
			<button type="button" class="acc-icon acc-icon-danger" onclick={onremove} title={removeLabel} aria-label={removeLabel}>&times;</button>
			<button type="button" class="acc-icon" onclick={ontoggle} title="Bearbeiten" aria-label="Bearbeiten">
				<svg class="acc-chevron" class:acc-chevron-open={expanded} width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8l4 4 4-4" /></svg>
			</button>
		</div>
	</div>

	{#if expanded}
		<div class="acc-body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.acc-item {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		overflow: hidden;
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.acc-item.expanded {
		border-color: var(--btb-steel);
		box-shadow: var(--shadow-card-hover);
	}
	.acc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding-right: 14px;
	}
	.acc-toggle {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 18px 22px;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;
	}
	.acc-toggle:hover {
		background: var(--bg-elevated);
	}
	.acc-num {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	.acc-text {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.acc-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-heading);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.acc-sub {
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.acc-badge {
		flex-shrink: 0;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 3px 9px;
		border-radius: 20px;
		background: var(--btb-steel-subtle);
		color: var(--text-muted);
	}
	.acc-badge-active {
		background: var(--btb-teal-subtle);
		color: var(--btb-teal-dark);
	}
	.acc-actions {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.acc-icon {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: var(--bg-surface);
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.15s;
		flex-shrink: 0;
	}
	.acc-icon:hover:not(:disabled) {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
		background: var(--bg-elevated);
	}
	.acc-icon:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.acc-icon-danger:hover:not(:disabled) {
		border-color: var(--color-error);
		color: var(--color-error);
		background: rgba(251, 113, 133, 0.08);
	}
	.acc-chevron {
		color: var(--text-muted);
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.acc-chevron-open {
		transform: rotate(180deg);
	}
	.acc-body {
		padding: 20px 22px 22px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		border-top: 1px solid var(--border);
	}
	@media (max-width: 640px) {
		.acc-toggle {
			padding: 16px;
		}
		.acc-body {
			padding: 16px;
		}
	}
</style>
