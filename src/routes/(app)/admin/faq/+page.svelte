<script lang="ts">
	import type { FaqItem } from '$lib/types/content';
	import AdminAccordionItem from '$lib/components/ui/AdminAccordionItem.svelte';

	type TabKey = 'faq' | 'transformation' | 'governance' | 'keynotespage';

	let { data, form } = $props();

	const TABS: { key: TabKey; label: string; note: string }[] = [
		{ key: 'faq', label: 'Startseite', note: 'Erscheint auf der Startseite.' },
		{ key: 'transformation', label: 'Transformation', note: 'Erscheint auf der Seite «Transformation» und speist deren FAQ-Structured-Data.' },
		{ key: 'governance', label: 'Governance', note: 'Erscheint auf der Seite «Governance» und speist deren FAQ-Structured-Data.' },
		{ key: 'keynotespage', label: 'Keynotes', note: 'Erscheint auf der Seite «Keynotes» und speist deren FAQ-Structured-Data.' }
	];

	let tabs = $state<Record<TabKey, FaqItem[]>>(structuredClone(data.tabs));
	let active = $state<TabKey>((form?.target as TabKey) ?? 'faq');
	let expanded = $state<number | null>(null);
	let saving = $state(false);
	let showSuccess = $state(false);

	let activeMeta = $derived(TABS.find((t) => t.key === active)!);
	let items = $derived(tabs[active]);
	let serialized = $derived(JSON.stringify(tabs[active]));

	function switchTab(key: TabKey) {
		active = key;
		expanded = null;
	}
	function move(arr: FaqItem[], i: number, dir: -1 | 1): number {
		const t = i + dir;
		if (t < 0 || t >= arr.length) return i;
		[arr[i], arr[t]] = [arr[t], arr[i]];
		return t;
	}

	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			saving = false;
			setTimeout(() => (showSuccess = false), 3000);
		}
		if (form?.error) saving = false;
	});
</script>

<svelte:head>
	<title>Häufige Fragen — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Häufige Fragen (FAQ)</h1>
		<p class="page-subtitle">Alle FAQ an einem Ort. Jeder Tab bearbeitet das FAQ einer Seite — die Startseite und die Unterseiten mit eigenem FAQ.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<div class="tabbar" role="tablist">
		{#each TABS as tab}
			<button
				type="button"
				role="tab"
				class="tab"
				class:active={active === tab.key}
				aria-selected={active === tab.key}
				onclick={() => switchTab(tab.key)}
			>
				{tab.label}
				<span class="tab-count">{tabs[tab.key].length}</span>
			</button>
		{/each}
	</div>

	<p class="tab-note">{activeMeta.note}</p>

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="target" value={active} />
		<input type="hidden" name="items" value={serialized} />

		<div class="items">
			{#each items as item, i (item)}
				<AdminAccordionItem
					index={i}
					total={items.length}
					title={item.question || 'Neue Frage'}
					expanded={expanded === i}
					removeLabel="Frage löschen"
					ontoggle={() => (expanded = expanded === i ? null : i)}
					onmoveup={() => (expanded = move(items, i, -1))}
					onmovedown={() => (expanded = move(items, i, 1))}
					onremove={() => items.splice(i, 1)}
				>
					<div class="field"><label class="field-label" for="q-{i}">Frage</label><input id="q-{i}" type="text" class="field-input" bind:value={item.question} /></div>
					<div class="field"><label class="field-label" for="a-{i}">Antwort</label><textarea id="a-{i}" class="field-textarea" rows="4" bind:value={item.answer}></textarea></div>
				</AdminAccordionItem>
			{/each}
		</div>

		{#if items.length === 0}
			<p class="empty-note">Noch keine Fragen in diesem Bereich.</p>
		{/if}

		<button type="button" class="btn-add" onclick={() => { items.push({ question: '', answer: '' }); expanded = items.length - 1; }}>+ Frage hinzufügen</button>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>{saving ? 'Speichern...' : `«${activeMeta.label}» speichern`}</button>
		</div>
	</form>
</div>

<style>
	.editor-page {
		max-width: 820px;
	}
	.page-header {
		margin-bottom: var(--space-lg);
	}
	.page-header h1 {
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.page-subtitle {
		font-size: 0.92rem;
		color: var(--text-secondary);
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
	}
	.back-link:hover {
		color: var(--btb-steel);
	}
	.toast {
		padding: 12px 20px;
		border-radius: var(--radius-sm);
		font-size: 0.88rem;
		font-weight: 500;
		margin-bottom: var(--space-md);
	}
	.toast-success {
		background: var(--btb-teal-subtle);
		color: var(--btb-teal-dark);
		border: 1px solid var(--btb-teal);
	}
	.toast-error {
		background: rgba(251, 113, 133, 0.1);
		color: #be123c;
		border: 1px solid var(--color-error);
	}

	/* ─── Tabs ─── */
	.tabbar {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		border-bottom: 1.5px solid var(--border);
		margin-bottom: 14px;
	}
	.tab {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		border: none;
		background: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1.5px;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}
	.tab:hover {
		color: var(--text-heading);
	}
	.tab.active {
		color: var(--btb-steel-hover);
		border-bottom-color: var(--btb-steel);
	}
	.tab-count {
		font-size: 0.7rem;
		font-weight: 700;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 9px;
		background: var(--bg-elevated);
		color: var(--text-muted);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.tab.active .tab-count {
		background: var(--btb-steel-subtle);
		color: var(--btb-steel-hover);
	}
	.tab-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin-bottom: 18px;
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.field-input,
	.field-textarea {
		width: 100%;
		padding: 10px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
		color: var(--text-primary);
		font-size: 0.88rem;
		font-family: var(--ff-ui);
		box-sizing: border-box;
		transition: border-color 0.15s;
	}
	.field-input:focus,
	.field-textarea:focus {
		outline: none;
		border-color: var(--btb-steel);
	}
	.field-textarea {
		resize: vertical;
		line-height: 1.5;
	}
	.empty-note {
		font-size: 0.85rem;
		color: var(--text-muted);
		padding: 8px 0 4px;
	}

	.btn-add {
		width: 100%;
		margin-top: 8px;
		padding: 14px;
		border: 1.5px dashed var(--btb-steel);
		border-radius: var(--radius-card);
		background: none;
		color: var(--btb-steel);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-add:hover {
		background: var(--btb-steel-subtle);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		position: sticky;
		bottom: 0;
		padding: 14px 0;
		background: linear-gradient(transparent, var(--bg-page) 40%);
	}
	.btn-save {
		padding: 12px 32px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-size: 0.92rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-save:hover:not(:disabled) {
		background: var(--btb-steel-hover);
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
