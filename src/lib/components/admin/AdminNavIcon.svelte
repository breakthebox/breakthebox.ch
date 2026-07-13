<script lang="ts">
	// Ein Icon je Admin-Bereich, geteilt von Sidebar und Dashboard.
	let { id }: { id: string } = $props();
</script>

{#if id === 'sections'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 4.5h12M3 9h12M3 13.5h12" /></svg>
{:else if id === 'hero'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="12" height="12" rx="2" /><path d="M3 11.5h12M6 6.5h3" /></svg>
{:else if id === 'pillars'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h4v4H4zM10 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4z" /></svg>
{:else if id === 'angebot'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h12M3 9h12M3 12h8" /><path d="M3 3h12" /></svg>
{:else if id === 'about'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="6" r="3" /><path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" /></svg>
{:else if id === 'testimonials'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8l-4 3V5a1 1 0 0 1 1-1z" /></svg>
{:else if id === 'references'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3h12v12H3z" /><path d="M3 7h12M7 3v12" /></svg>
{:else if id === 'metrics'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 15V9M7 15V4M11 15v-6M15 15V7" /></svg>
{:else if id === 'partners'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="2.5" /><circle cx="12" cy="6" r="2.5" /><path d="M2.5 15c0-2 1.6-3.5 3.5-3.5S9.5 13 9.5 15M8.5 15c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5" /></svg>
{:else if id === 'transformation'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="12" height="10" rx="1.5" /><path d="M3 8h12M9 4v10" /></svg>
{:else if id === 'governance'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 3v12M4 6h10M5.5 6l-2.2 4.5a2.2 2.2 0 0 0 4.4 0zM12.5 6l-2.2 4.5a2.2 2.2 0 0 0 4.4 0z" /></svg>
{:else if id === 'keynotes-seite'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="12" height="12" rx="2" /><path d="M6 6.5h6M6 9h6M6 11.5h3.5" /></svg>
{:else if id === 'experimentierraum'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 3v4L3 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1L11 7V3" /><path d="M6 3h6" /></svg>
{:else if id === 'manifest'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 3h8l2 2v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M6 7h6M6 10h6M6 13h4" /></svg>
{:else if id === 'blog'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 3h10v12H4z" /><path d="M7 6h4M7 9h4M7 12h2" /></svg>
{:else if id === 'keynotes'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2a2.3 2.3 0 0 1 2.3 2.3v4a2.3 2.3 0 0 1-4.6 0v-4A2.3 2.3 0 0 1 9 2z" /><path d="M4.7 8.3a4.3 4.3 0 0 0 8.6 0M9 12.6V16M6.5 16h5" /></svg>
{:else if id === 'faq'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="7" /><path d="M7 7a2 2 0 1 1 2.5 1.9c-.5.2-.5.6-.5 1.1" /><path d="M9 13h.01" /></svg>
{:else if id === 'mediathek'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="12" height="12" rx="2" /><circle cx="6.8" cy="6.8" r="1.4" /><path d="M15 11l-3.5-3.5L4 15" /></svg>
{:else if id === 'themes'}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="6.5" /><circle cx="6.3" cy="7" r="0.9" fill="currentColor" stroke="none" /><circle cx="9" cy="5.6" r="0.9" fill="currentColor" stroke="none" /><circle cx="11.7" cy="7" r="0.9" fill="currentColor" stroke="none" /><path d="M9 15.5c1.4 0 2-.9 2-1.8 0-1.2-1.4-1.2-1.4-2.2 0-.6.5-1 1.2-1" /></svg>
{:else}
	<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="6.5" /></svg>
{/if}
