<script lang="ts">
	import type { SectionsContent } from '$lib/types/content';

	let { data, form } = $props();
	let content = $state<SectionsContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	// Anzeige-Infos pro Sektions-Key (Reihenfolge kommt aus content.sections)
	const META: Record<string, { label: string; desc: string; titleLockedHint?: string }> = {
		angebot: { label: 'Angebot', desc: 'Angebots-Kacheln (direkt nach dem Hero)' },
		logos: { label: 'Kundenlogos & Kennzahlen', desc: 'Logo-Marquee mit stiller Kennzahlen-Zeile — Inhalte unter «Kundenlogos» bzw. «Kennzahlen» pflegen' },
		pillars: { label: 'Pillars (Säulen)', desc: 'Die früheren Säulen-Karten mit Flip/Beispielen — Inhalte unter «Pillars» pflegen' },
		tension: { label: 'Klartext-Band', desc: 'Dunkles Band mit These und Text' },
		about: { label: 'Über mich', desc: 'Porträt, Werdegang, Qualifikationen, Video-CV', titleLockedHint: 'Der Titel wird unter «Über mich» gepflegt.' },
		haltung: { label: 'Haltung & Beweis', desc: 'Absprung-Karten zu Manifest und Experimentierraum' },
		buehne: { label: 'Keynotes / Bühne', desc: 'Kommende Auftritte und Rückblick' },
		netzwerk: { label: 'Netzwerk / Partner', desc: 'Partnerfirmen mit Personen' },
		stimmen: { label: 'Stimmen', desc: 'Testimonials' },
		impulse: { label: 'Impulse-Band', desc: 'Dunkles Band mit Denkanstoss' },
		faq: { label: 'Häufige Fragen', desc: 'FAQ-Liste' },
		kontakt: { label: 'Kontakt-Band', desc: 'Abschluss-Band mit E-Mail und Telefon (Kicker ohne Wirkung)' }
	};

	let expanded = $state<string | null>(null);
	function toggleExpand(key: string) {
		expanded = expanded === key ? null : key;
	}

	function move(i: number, dir: -1 | 1) {
		const t = i + dir;
		if (t < 0 || t >= content.sections.length) return;
		[content.sections[i], content.sections[t]] = [content.sections[t], content.sections[i]];
	}

	// ─── Drag & Drop (HTML5) ───
	let dragIndex = $state<number | null>(null);
	let overIndex = $state<number | null>(null);

	function onDragStart(e: DragEvent, i: number) {
		dragIndex = i;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', String(i));
		}
	}
	function onDragOver(e: DragEvent, i: number) {
		e.preventDefault();
		overIndex = i;
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
	}
	function onDrop(e: DragEvent, i: number) {
		e.preventDefault();
		if (dragIndex === null || dragIndex === i) {
			dragIndex = null;
			overIndex = null;
			return;
		}
		const list = content.sections;
		const [moved] = list.splice(dragIndex, 1);
		list.splice(i, 0, moved);
		dragIndex = null;
		overIndex = null;
	}
	function onDragEnd() {
		dragIndex = null;
		overIndex = null;
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
	<title>Sektionen — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Sektionen</h1>
		<p class="page-subtitle">Reihenfolge (ziehen oder ↑↓), Sichtbarkeit und Kopftexte der Startseiten-Sektionen. Der Hero bleibt fix zuoberst, der Footer fix zuunterst. Die Textfelder zeigen die aktuellen Texte — leeres Feld heisst: die Sektion hat dort keinen Text.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<div class="items">
			{#each content.sections as section, i (section.key)}
				<div
					class="item-card"
					class:dragging={dragIndex === i}
					class:drop-target={overIndex === i && dragIndex !== null && dragIndex !== i}
					class:hidden-section={!section.visible}
					role="listitem"
					ondragover={(e) => onDragOver(e, i)}
					ondrop={(e) => onDrop(e, i)}
				>
					<div class="item-head">
						<span
							class="drag-handle"
							draggable="true"
							role="button"
							tabindex="-1"
							aria-label="Sektion verschieben"
							ondragstart={(e) => onDragStart(e, i)}
							ondragend={onDragEnd}
						>⠿</span>
						<div class="item-title-wrap">
							<span class="item-title">{META[section.key]?.label ?? section.key}</span>
							<span class="item-desc">{META[section.key]?.desc ?? ''}</span>
						</div>
						<label class="vis-toggle" title={section.visible ? 'Sichtbar — klicken zum Ausblenden' : 'Ausgeblendet — klicken zum Einblenden'}>
							<input type="checkbox" bind:checked={section.visible} />
							<span class="vis-track"><span class="vis-knob"></span></span>
							<span class="vis-label">{section.visible ? 'Sichtbar' : 'Ausgeblendet'}</span>
						</label>
						<div class="item-actions">
							<button type="button" class="icon-btn" onclick={() => move(i, -1)} disabled={i === 0} aria-label="Nach oben">↑</button>
							<button type="button" class="icon-btn" onclick={() => move(i, 1)} disabled={i === content.sections.length - 1} aria-label="Nach unten">↓</button>
							<button type="button" class="icon-btn" class:open={expanded === section.key} onclick={() => toggleExpand(section.key)} aria-label="Texte bearbeiten" aria-expanded={expanded === section.key}>✎</button>
						</div>
					</div>
					{#if expanded === section.key}
						<div class="fields">
							<div class="field">
								<label class="field-label" for="kick-{section.key}">Keywords / Kicker (kleine Zeile über dem Titel)</label>
								<input id="kick-{section.key}" type="text" class="field-input" bind:value={section.kicker} placeholder="(kein Text)" />
							</div>
							<div class="field">
								<label class="field-label" for="title-{section.key}">Titel</label>
								{#if META[section.key]?.titleLockedHint}
									<p class="field-note">{META[section.key].titleLockedHint}</p>
								{:else}
									<input id="title-{section.key}" type="text" class="field-input" bind:value={section.title} placeholder="(kein Text)" />
								{/if}
							</div>
							<div class="field">
								<label class="field-label" for="sub-{section.key}">Subtitel</label>
								<input id="sub-{section.key}" type="text" class="field-input" bind:value={section.subtitle} placeholder="(kein Text)" />
							</div>
							{#if section.key === 'haltung'}
								<div class="field">
									<label class="field-label" for="cta1-{section.key}">Link-Label linke Karte (Manifest)</label>
									<input id="cta1-{section.key}" type="text" class="field-input" bind:value={section.ctaPrimary} placeholder="(kein Text)" />
								</div>
								<div class="field">
									<label class="field-label" for="cta2-{section.key}">Link-Label rechte Karte (Experimentierraum)</label>
									<input id="cta2-{section.key}" type="text" class="field-input" bind:value={section.ctaSecondary} placeholder="(kein Text)" />
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="form-actions">
			<button type="submit" class="btn-save" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</button>
		</div>
	</form>
</div>

<style>
	.editor-page {
		max-width: 800px;
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
		gap: 10px;
		margin-bottom: var(--space-lg);
	}
	.item-card {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		padding: 12px 16px;
		transition: border-color 0.15s, opacity 0.15s;
	}
	.item-card.dragging {
		opacity: 0.45;
	}
	.item-card.drop-target {
		border-color: var(--btb-steel);
	}
	.item-card.hidden-section {
		background: var(--bg-page);
	}
	.item-card.hidden-section .item-title {
		color: var(--text-muted);
	}
	.item-head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.drag-handle {
		cursor: grab;
		color: var(--text-muted);
		font-size: 1.1rem;
		padding: 4px 6px;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
		user-select: none;
	}
	.drag-handle:hover {
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
	}
	.item-title-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}
	.item-title {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--text-heading);
	}
	.item-desc {
		font-size: 0.76rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.vis-toggle {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		flex-shrink: 0;
	}
	.vis-toggle input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	.vis-track {
		width: 36px;
		height: 20px;
		border-radius: 999px;
		background: var(--border);
		display: inline-flex;
		align-items: center;
		padding: 2px;
		transition: background 0.15s;
	}
	.vis-toggle input:checked + .vis-track {
		background: var(--btb-steel);
	}
	.vis-knob {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.15s;
	}
	.vis-toggle input:checked + .vis-track .vis-knob {
		transform: translateX(16px);
	}
	.vis-label {
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--text-secondary);
		min-width: 82px;
	}
	.item-actions {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
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
	}
	.icon-btn:hover:not(:disabled) {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.icon-btn.open {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
		background: var(--btb-steel-subtle);
	}
	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.fields {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px dashed var(--border);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.field-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0;
		padding: 10px 0 2px;
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
</style>
