<script lang="ts">
	import type { HeroContent, HeroPreset } from '$lib/types/content';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<HeroContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	const ANNO_POS = ['oben rechts', 'rechts', 'unten'];

	// ─── Preset-Verwaltung: welcher Hero lädt, bestimmt das Theme (Admin → Themes) ───
	let selectedId = $state(content.presets[0]?.id ?? '');
	let sel = $derived(content.presets.find((p) => p.id === selectedId) ?? content.presets[0]);

	function genId() {
		return crypto.randomUUID();
	}
	function addPreset() {
		const p: HeroPreset = structuredClone($state.snapshot(content.presets[0])) as HeroPreset;
		p.id = genId();
		p.name = 'Neuer Hero';
		content.presets.push(p);
		selectedId = p.id;
	}
	function duplicatePreset() {
		if (!sel) return;
		const p = structuredClone($state.snapshot(sel)) as HeroPreset;
		p.id = genId();
		p.name = `${sel.name} (Kopie)`;
		content.presets.push(p);
		selectedId = p.id;
	}
	function deletePreset(id: string) {
		if (content.presets.length <= 1) {
			alert('Mindestens ein Hero muss bestehen bleiben.');
			return;
		}
		if (!confirm('Diesen Hero wirklich löschen? Themes, die ihn referenzieren, fallen auf den ersten Hero zurück.')) return;
		content.presets = content.presets.filter((p) => p.id !== id);
		if (selectedId === id) selectedId = content.presets[0].id;
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
	<title>Hero — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Hero</h1>
		<p class="page-subtitle">Benannte Heros (Variante + Inhalte) verwalten. Welcher Hero auf der Startseite lädt, bestimmt das aktive Theme unter <a href="/admin/themes">Themes</a>.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<!-- ─── Preset-Liste ─── -->
		<div class="item-card">
			<div class="card-head">
				<h2 class="card-title">Heros</h2>
				<div class="head-actions">
					<button type="button" class="btn-ghost" onclick={addPreset}>+ Neuer Hero</button>
					<button type="button" class="btn-ghost" onclick={duplicatePreset}>Duplizieren</button>
				</div>
			</div>
			<div class="preset-list">
				{#each content.presets as p (p.id)}
					<div class="preset-row" class:sel={selectedId === p.id}>
						<button type="button" class="preset-name-btn" onclick={() => (selectedId = p.id)}>
							{p.name || 'Unbenannt'}
							<span class="preset-variant">{p.variant === 'slider' ? 'Zwei Welten' : 'Klassisch'}</span>
						</button>
						<button type="button" class="icon-btn icon-btn-danger" onclick={() => deletePreset(p.id)} aria-label="Hero löschen">&times;</button>
					</div>
				{/each}
			</div>
		</div>

		{#if sel}
		<!-- ─── Name + Variante ─── -->
		<div class="item-card">
			<h2 class="card-title">Hero bearbeiten</h2>
			<div class="field">
				<label class="field-label" for="p-name">Name (erscheint in der Theme-Auswahl)</label>
				<input id="p-name" type="text" class="field-input" bind:value={sel.name} placeholder="z.B. Zwei Welten Petrol" />
			</div>
			<div class="variant-picker">
				<label class="variant-option" class:sel={sel.variant === 'classic'}>
					<input type="radio" name="variant" value="classic" bind:group={sel.variant} />
					<strong>Klassisch</strong>
					<span>Headline links, Frucht-Bild mit Handschrift-Notizen rechts. Das Bild kommt aus dem aktiven Theme.</span>
				</label>
				<label class="variant-option" class:sel={sel.variant === 'slider'}>
					<input type="radio" name="variant" value="slider" bind:group={sel.variant} />
					<strong>Zwei Welten (Slider)</strong>
					<span>Headline oben, darunter ein interaktives Panel: zwei Welten, per Trenner zum Entdecken ziehbar.</span>
				</label>
			</div>
		</div>

		{#if sel.variant === 'classic'}
			<!-- ─── Klassisch ─── -->
			<div class="item-card">
				<h2 class="card-title">Texte</h2>
				<div class="field-row">
					<div class="field">
						<label class="field-label" for="c-l1">Headline Zeile 1</label>
						<input id="c-l1" type="text" class="field-input" bind:value={sel.classic.titleLine1} />
					</div>
					<div class="field">
						<label class="field-label" for="c-l2p">Zeile 2 — Anfang</label>
						<input id="c-l2p" type="text" class="field-input" bind:value={sel.classic.titleLine2Pre} />
					</div>
					<div class="field">
						<label class="field-label" for="c-l2e">Zeile 2 — Akzentwort</label>
						<input id="c-l2e" type="text" class="field-input" bind:value={sel.classic.titleLine2Em} />
					</div>
				</div>
				<div class="field">
					<label class="field-label" for="c-sub">Subline</label>
					<textarea id="c-sub" class="field-textarea" bind:value={sel.classic.sub} rows="3"></textarea>
				</div>
				<div class="field-row">
					<div class="field">
						<label class="field-label" for="c-acc">Kursive Zeile</label>
						<input id="c-acc" type="text" class="field-input" bind:value={sel.classic.accent} />
					</div>
					<div class="field">
						<label class="field-label" for="c-sig">Signatur (Handschrift)</label>
						<input id="c-sig" type="text" class="field-input" bind:value={sel.classic.signature} />
					</div>
					<div class="field">
						<label class="field-label" for="c-cta">Button-Text</label>
						<input id="c-cta" type="text" class="field-input" bind:value={sel.classic.ctaLabel} />
					</div>
				</div>
			</div>

			<div class="item-card">
				<h2 class="card-title">Notizen am Bild</h2>
				<p class="hint">Drei Handschrift-Notizen rund um das Hero-Bild. Das Bild selbst wird im aktiven <a href="/admin/themes">Theme</a> gewählt.</p>
				{#each sel.classic.annotations as anno, i}
					<div class="field-row anno-row">
						<div class="field">
							<label class="field-label" for="anno-t-{i}">Notiz {i + 1} ({ANNO_POS[i]})</label>
							<input id="anno-t-{i}" type="text" class="field-input" bind:value={anno.title} />
						</div>
						<div class="field">
							<label class="field-label" for="anno-s-{i}">Untertitel</label>
							<input id="anno-s-{i}" type="text" class="field-input" bind:value={anno.sub} />
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- ─── Slider ─── -->
			<div class="item-card">
				<h2 class="card-title">Headline</h2>
				<div class="field-row">
					<div class="field">
						<label class="field-label" for="s-l1">Headline Zeile 1</label>
						<input id="s-l1" type="text" class="field-input" bind:value={sel.slider.titleLine1} />
					</div>
					<div class="field">
						<label class="field-label" for="s-l2">Headline Akzentzeile</label>
						<input id="s-l2" type="text" class="field-input" bind:value={sel.slider.titleAccent} />
					</div>
				</div>
				<div class="field">
					<label class="field-label" for="s-sub">Tagline (rechte Spalte, mit Petrol-Linie)</label>
					<textarea id="s-sub" class="field-textarea" bind:value={sel.slider.sub} rows="3"></textarea>
				</div>
			</div>

			{#each [ { key: 'left', label: 'Linke Welt (dunkel)', world: sel.slider.left }, { key: 'right', label: 'Rechte Welt (Akzentfarbe)', world: sel.slider.right } ] as side (side.key)}
				<div class="item-card">
					<h2 class="card-title">{side.label}</h2>
					<div class="field-row">
						<div class="field">
							<label class="field-label" for="{side.key}-kick">Kicker</label>
							<input id="{side.key}-kick" type="text" class="field-input" bind:value={side.world.kicker} />
						</div>
						<div class="field">
							<label class="field-label" for="{side.key}-title">Titel</label>
							<input id="{side.key}-title" type="text" class="field-input" bind:value={side.world.title} />
						</div>
					</div>
					<div class="field">
						<label class="field-label" for="{side.key}-text">Text</label>
						<textarea id="{side.key}-text" class="field-textarea" bind:value={side.world.text} rows="2"></textarea>
					</div>
					<div class="field">
						<span class="field-label">Bild — bevorzugtes Format: Querformat 2:1 (z.B. 1600 × 800 px), Motiv Richtung Aussenkante (leer = Farbverlauf)</span>
						{#if side.world.image}
							<div class="img-preview">
								<img src={side.world.image} alt={side.world.title} />
								<button type="button" class="img-remove" onclick={() => (side.world.image = '')}>Bild entfernen</button>
							</div>
						{/if}
						<ImageUpload bind:value={side.world.image} section="hero" label="Bild hochladen" />
					</div>
				</div>
			{/each}

			<div class="item-card">
				<h2 class="card-title">Unter dem Panel</h2>
				<div class="field-row">
					<div class="field">
						<label class="field-label" for="s-cap">Klammer-Zeile</label>
						<input id="s-cap" type="text" class="field-input" bind:value={sel.slider.caption} />
					</div>
					<div class="field">
						<label class="field-label" for="s-cap2">Klammer-Zeile Akzent</label>
						<input id="s-cap2" type="text" class="field-input" bind:value={sel.slider.captionAccent} />
					</div>
					<div class="field">
						<label class="field-label" for="s-hint">Hinweis am Slider-Griff (leer = keiner)</label>
						<input id="s-hint" type="text" class="field-input" bind:value={sel.slider.hint} />
					</div>
				</div>
			</div>
		{/if}
		{/if}

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
	.page-subtitle a {
		color: var(--btb-steel);
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
	.item-card {
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card);
		padding: 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 16px;
	}
	.card-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-heading);
		margin: 0;
	}
	.hint {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: -6px 0 0;
	}
	.hint a {
		color: var(--btb-steel);
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.head-actions {
		display: flex;
		gap: 8px;
	}
	.btn-ghost {
		padding: 8px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-button);
		background: var(--bg-page);
		color: var(--text-secondary);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}
	.btn-ghost:hover {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.preset-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.preset-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 10px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--bg-page);
	}
	.preset-row.sel {
		border-color: var(--btb-steel);
	}
	.preset-name-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: left;
		padding: 6px 4px;
	}
	.preset-variant {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 700;
		color: var(--btb-steel);
		background: var(--btb-steel-subtle);
		padding: 3px 9px;
		border-radius: var(--radius-pill);
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
	.icon-btn-danger:hover {
		border-color: var(--color-error);
		color: var(--color-error);
	}
	.variant-picker {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.variant-option {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px 16px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--bg-page);
		cursor: pointer;
		font-size: 0.85rem;
		color: var(--text-secondary);
		transition: border-color 0.15s;
	}
	.variant-option.sel {
		border-color: var(--btb-steel);
	}
	.variant-option strong {
		color: var(--text-heading);
		font-size: 0.92rem;
	}
	.variant-option input {
		position: absolute;
		opacity: 0;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.field-row {
		display: flex;
		gap: 12px;
	}
	.anno-row {
		margin-top: 2px;
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
	.img-preview {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.img-preview img {
		width: 120px;
		height: 68px;
		object-fit: cover;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}
	.img-remove {
		border: 1px solid var(--border);
		background: var(--bg-surface);
		color: var(--text-secondary);
		border-radius: var(--radius-sm);
		padding: 6px 12px;
		font-size: 0.8rem;
		cursor: pointer;
	}
	.img-remove:hover {
		border-color: var(--color-error);
		color: var(--color-error);
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
		.field-row,
		.variant-picker {
			display: flex;
			flex-direction: column;
		}
	}
</style>
