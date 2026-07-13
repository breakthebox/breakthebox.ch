<script lang="ts">
	import type { FaqItem } from '$lib/types/content';

	// Site-weit einheitliche FAQ-Liste. Styling folgt der Transformation-Seite
	// (randlos, Trennlinie, +/−-Marker) und nutzt Theme-Variablen.
	let { items, firstOpen = false }: { items: FaqItem[]; firstOpen?: boolean } = $props();
</script>

<div class="faq-list">
	{#each items as item, i}
		<details class="faq-item" open={firstOpen && i === 0}>
			<summary class="faq-q"><span>{item.question}</span></summary>
			<p class="faq-a">{item.answer}</p>
		</details>
	{/each}
</div>

<style>
	.faq-list {
		display: flex;
		flex-direction: column;
	}
	.faq-item {
		border-bottom: 1px solid var(--border);
		padding: 16px 4px;
	}
	.faq-q {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--text-heading);
		cursor: pointer;
		list-style: none;
	}
	.faq-q::-webkit-details-marker {
		display: none;
	}
	.faq-q::after {
		content: '+';
		font-family: var(--ff-ui);
		color: var(--btb-steel-hover);
		font-size: 1.1rem;
	}
	.faq-item[open] .faq-q::after {
		content: '−';
	}
	.faq-a {
		font-size: 0.88rem;
		line-height: 1.65;
		color: var(--text-secondary);
		margin-top: 10px;
		max-width: 66ch;
	}
</style>
