<script lang="ts">
	import type { SchemaGraph, SchemaNode } from '$lib/utils/schema';

	let { data }: { data: SchemaGraph | SchemaNode } = $props();

	const OPEN = '<' + 'script type="application/ld+json">';
	const CLOSE = '<' + '/script>';
	let html = $derived(OPEN + JSON.stringify(data).replace(/</g, '\\u003c') + CLOSE);
</script>

<svelte:head>
	{@html html}
</svelte:head>
