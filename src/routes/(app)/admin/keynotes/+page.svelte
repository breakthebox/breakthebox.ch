<script lang="ts">
	import type { KeynotesContent } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<KeynotesContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	function addAuftritt() {
		content.items.push({
			key: 'keynote-' + (content.items.length + 1),
			title: '',
			desc: '',
			date: '',
			endDate: '',
			location: '',
			event: '',
			format: '',
			url: '',
			image: '',
			tags: [],
			featured: false,
			blogSlug: ''
		});
	}
	function removeAuftritt(i: number) {
		if (!confirm('Diesen Auftritt wirklich löschen?')) return;
		content.items.splice(i, 1);
	}
	function moveAuftritt(i: number, dir: -1 | 1) {
		const t = i + dir;
		if (t < 0 || t >= content.items.length) return;
		[content.items[i], content.items[t]] = [content.items[t], content.items[i]];
	}

	// Tags werden als kommagetrennte Zeile bearbeitet und zurück in ein Array gespiegelt.
	function tagsText(i: number): string {
		return content.items[i].tags.join(', ');
	}
	function setTags(i: number, value: string) {
		content.items[i].tags = value
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
	}

	// Ist das Datum in der Zukunft (oder heute)? Nur zur Anzeige im Editor.
	function isUpcoming(dateStr: string, endStr?: string): boolean {
		const ref = endStr?.trim() || dateStr?.trim();
		if (!ref) return false;
		const d = new Date(ref);
		if (isNaN(d.getTime())) return false;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return d >= today;
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
	<title>Keynotes — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Keynotes</h1>
		<p class="page-subtitle">
			Keynotes, Panels und Workshops. Kommende Termine erscheinen prominent auf der Startseite,
			vergangene automatisch im Rückblick. Ist kein Termin erfasst, bleibt die Section verborgen.
		</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<div class="items">
			{#each content.items as item, i}
				<div class="item-card">
					<div class="item-head">
						<span class="item-num">{i + 1}</span>
						<span class="item-title">{item.title || 'Neuer Auftritt'}</span>
						{#if item.date}
							<span class="badge" class:badge-up={isUpcoming(item.date, item.endDate)}>
								{isUpcoming(item.date, item.endDate) ? 'Kommend' : 'Rückblick'}
							</span>
						{/if}
						<div class="item-actions">
							<button type="button" class="icon-btn" onclick={() => moveAuftritt(i, -1)} disabled={i === 0} aria-label="Nach oben">↑</button>
							<button type="button" class="icon-btn" onclick={() => moveAuftritt(i, 1)} disabled={i === content.items.length - 1} aria-label="Nach unten">↓</button>
							<button type="button" class="icon-btn icon-btn-danger" onclick={() => removeAuftritt(i)} aria-label="Löschen">&times;</button>
						</div>
					</div>

					<div class="field"><label class="field-label" for="at-{i}">Titel</label><input id="at-{i}" type="text" class="field-input" bind:value={item.title} placeholder="z.B. KI-Governance: Aus Lose-lose wird Win-win" /></div>

					<div class="field-row">
						<div class="field"><label class="field-label" for="ae-{i}">Veranstaltung / Host</label><input id="ae-{i}" type="text" class="field-input" bind:value={item.event} placeholder="z.B. Dänksymposium" /></div>
						<div class="field"><label class="field-label" for="af-{i}">Format</label><input id="af-{i}" type="text" class="field-input" bind:value={item.format} placeholder="z.B. Keynote, Panel, Workshop" /></div>
					</div>

					<div class="field-row">
						<div class="field"><label class="field-label" for="ad-{i}">Datum</label><input id="ad-{i}" type="date" class="field-input" bind:value={item.date} /></div>
						<div class="field"><label class="field-label" for="axd-{i}">Enddatum (optional)</label><input id="axd-{i}" type="date" class="field-input" bind:value={item.endDate} /></div>
					</div>

					<div class="field"><label class="field-label" for="al-{i}">Ort / Venue</label><input id="al-{i}" type="text" class="field-input" bind:value={item.location} placeholder="z.B. Thun" /></div>

					<div class="field">
						<label class="field-label" for="adesc-{i}">Kurzbeschreibung</label>
						<textarea id="adesc-{i}" class="field-input field-textarea" rows="4" bind:value={item.desc} placeholder="Worum geht es? Ein bis zwei Sätze."></textarea>
						<span class="field-hint">Markdown möglich: <code>**fett**</code>, <code>*kursiv*</code>, <code>- Aufzählung</code>, Leerzeile = neuer Absatz.</span>
					</div>

					<div class="field"><label class="field-label" for="au-{i}">Link (Programm / Anmeldung)</label><input id="au-{i}" type="url" class="field-input" bind:value={item.url} placeholder="https://…" /></div>

					<div class="field">
						<label class="field-label" for="ab-{i}">Blogbeitrag verknüpfen (Rückblick)</label>
						<select id="ab-{i}" class="field-input" bind:value={item.blogSlug}>
							<option value="">— kein Blogbeitrag —</option>
							{#each data.blogPosts as post}
								<option value={post.slug}>{post.title}</option>
							{/each}
						</select>
						{#if data.blogPosts.length === 0}
							<span class="field-hint">Noch keine veröffentlichten Blogbeiträge vorhanden.</span>
						{/if}
					</div>

					<div class="field">
						<label class="field-label" for="atags-{i}">Themen-Tags (mit Komma getrennt)</label>
						<input id="atags-{i}" type="text" class="field-input" value={tagsText(i)} oninput={(e) => setTags(i, e.currentTarget.value)} placeholder="KI-Governance, Live-Simulation, Transformation" />
					</div>

					<ImageUpload bind:value={item.image} section="keynote-{i}" label="Bild (optional)" />

					<label class="checkbox-row">
						<input type="checkbox" bind:checked={item.featured} />
						<span>Hervorheben (wird zuerst gezeigt)</span>
					</label>
				</div>
			{/each}
		</div>

		<button type="button" class="btn-add" onclick={addAuftritt}>+ Auftritt hinzufügen</button>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</button>
		</div>
	</form>
</div>

<style>
	.editor-page {
		max-width: 820px;
	}
	.page-header {
		margin-bottom: var(--space-xl);
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
		max-width: 60ch;
		line-height: 1.5;
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
		transition: color 0.15s;
	}
	.back-link:hover {
		color: var(--btb-steel);
	}
	.toast {
		padding: 12px 20px;
		border-radius: var(--radius-sm);
		font-size: 0.88rem;
		font-weight: 500;
		margin-bottom: var(--space-lg);
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
	.items {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: var(--space-lg);
	}
	.item-card {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		padding: 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.item-head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.item-num {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.82rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	.item-title {
		flex: 1;
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--text-heading);
	}
	.badge {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 3px 9px;
		border-radius: 20px;
		background: var(--btb-steel-subtle);
		color: var(--text-muted);
		flex-shrink: 0;
	}
	.badge-up {
		background: var(--btb-teal-subtle);
		color: var(--btb-teal-dark);
	}
	.item-actions {
		display: flex;
		gap: 4px;
	}
	.icon-btn {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: var(--bg-surface);
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.15s;
		flex-shrink: 0;
	}
	.icon-btn:hover:not(:disabled) {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.icon-btn-danger:hover:not(:disabled) {
		border-color: var(--color-error);
		color: var(--color-error);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.field-row {
		display: flex;
		gap: 14px;
	}
	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.field-input {
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
	.field-input:focus {
		outline: none;
		border-color: var(--btb-steel);
	}
	.field-hint {
		font-size: 0.78rem;
		color: var(--text-muted);
	}
	.field-hint code {
		font-family: var(--ff-mono, ui-monospace, monospace);
		font-size: 0.72rem;
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		padding: 1px 5px;
		border-radius: 4px;
	}
	.field-textarea {
		resize: vertical;
		line-height: 1.5;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 0.86rem;
		color: var(--text-secondary);
		cursor: pointer;
	}
	.checkbox-row input {
		width: 16px;
		height: 16px;
		accent-color: var(--btb-steel);
		cursor: pointer;
	}
	.btn-add {
		width: 100%;
		padding: 14px;
		border: 1.5px dashed var(--btb-steel);
		border-radius: var(--radius-card);
		background: none;
		color: var(--btb-steel);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
		margin-bottom: var(--space-xl);
	}
	.btn-add:hover {
		background: var(--btb-steel-subtle);
	}
	.form-actions {
		display: flex;
		justify-content: flex-end;
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
	@media (max-width: 640px) {
		.field-row {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
