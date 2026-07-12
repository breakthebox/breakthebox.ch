<script lang="ts">
	import type { ThemeContent, ThemeColors, ThemeFontSelection } from '$lib/types/content';
	import { softFromPrimary } from '$lib/utils/color';
	import { HEADING_FONTS, BODY_FONTS, HAND_FONTS, DEFAULT_FONTS } from '$lib/config/fonts';

	let { data, form } = $props();

	const FALLBACK = { primary: '#b11e2c', primaryDark: '#8e1622', ink: '#2b1a1c', cream: '#fbf1ec', soft: '#f6d9d5', header: '#fbf1ec' };

	// Arbeits-Typen: heroImage/pillarImages sind hier immer gesetzt (nach normalize()).
	interface WTheme {
		id: string;
		name: string;
		colors: Required<ThemeColors>;
		fonts: ThemeFontSelection;
		heroImage: string;
		heroPresetId: string; // '' = erstes Preset
		pillarImages: Record<string, string>;
	}
	interface WContent {
		activeId: string;
		themes: WTheme[];
	}

	function normalize(c: ThemeContent): WContent {
		const themes = (c.themes?.length ? c.themes : []).map((t) => ({
			...t,
			colors: {
				primary: t.colors?.primary ?? FALLBACK.primary,
				primaryDark: t.colors?.primaryDark ?? FALLBACK.primaryDark,
				ink: t.colors?.ink ?? FALLBACK.ink,
				cream: t.colors?.cream ?? FALLBACK.cream,
				// Bestehende Themes ohne «soft»: helle Fläche aus Primär ableiten.
				soft: t.colors?.soft ?? softFromPrimary(t.colors?.primary ?? FALLBACK.primary),
				// Bestehende Themes ohne «header»: Navbar nutzt den Seitenhintergrund.
				header: t.colors?.header ?? t.colors?.cream ?? FALLBACK.cream
			},
			fonts: {
				heading: t.fonts?.heading ?? DEFAULT_FONTS.heading,
				body: t.fonts?.body ?? DEFAULT_FONTS.body,
				hand: t.fonts?.hand ?? DEFAULT_FONTS.hand
			},
			heroImage: t.heroImage ?? '',
			heroPresetId: t.heroPresetId ?? '',
			pillarImages: t.pillarImages ?? {}
		}));
		if (themes.length === 0) {
			themes.push({ id: 'standard', name: 'Standard', colors: { ...FALLBACK }, fonts: { ...DEFAULT_FONTS }, heroImage: '', heroPresetId: '', pillarImages: {} });
		}
		const activeId = themes.some((t) => t.id === c.activeId) ? c.activeId : themes[0].id;
		return { activeId, themes };
	}

	let content = $state<WContent>(normalize(structuredClone(data.content)));
	const pillarSlots = data.pillarSlots;
	// Bilder für die Slot-Auswahl kommen aus der Mediathek.
	const library = data.library;

	let selectedId = $state(content.activeId);
	let selected = $derived(content.themes.find((t) => t.id === selectedId) ?? content.themes[0]);

	let saving = $state(false);
	let showSuccess = $state(false);
	function genId() {
		return crypto.randomUUID();
	}

	function addTheme() {
		const t: WTheme = { id: genId(), name: 'Neues Theme', colors: { ...FALLBACK }, fonts: { ...DEFAULT_FONTS }, heroImage: '', heroPresetId: '', pillarImages: {} };
		content.themes.push(t);
		selectedId = t.id;
	}
	function duplicateTheme() {
		if (!selected) return;
		const t: WTheme = {
			...(structuredClone($state.snapshot(selected)) as WTheme),
			id: genId(),
			name: `${selected.name} (Kopie)`
		};
		content.themes.push(t);
		selectedId = t.id;
	}
	function deleteTheme(id: string) {
		if (content.themes.length <= 1) {
			alert('Mindestens ein Theme muss bestehen bleiben.');
			return;
		}
		if (!confirm('Dieses Theme wirklich löschen?')) return;
		content.themes = content.themes.filter((t) => t.id !== id);
		if (content.activeId === id) content.activeId = content.themes[0].id;
		if (selectedId === id) selectedId = content.themes[0].id;
	}
	let activeName = $derived(content.themes.find((t) => t.id === content.activeId)?.name ?? '—');

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
	<title>Themes — Admin — Break the Box</title>
</svelte:head>

<div class="themes-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Themes</h1>
		<p class="page-subtitle">Farben und Bilder (Hero, Pillars) als Themes verwalten. Das <strong>aktive</strong> Theme bestimmt den Look der Website.</p>
	</div>

	{#if showSuccess}
		<div class="toast toast-success">Gespeichert. Das aktive Theme ist «{activeName}».</div>
	{/if}
	{#if form?.error}
		<div class="toast toast-error">{form.error}</div>
	{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={JSON.stringify(content)} />

		<!-- ─── Aktives Theme + Theme-Liste ─── -->
		<section class="card">
			<div class="card-head">
				<h2>Themes</h2>
				<div class="head-actions">
					<button type="button" class="btn ghost" onclick={addTheme}>+ Neues Theme</button>
					<button type="button" class="btn ghost" onclick={duplicateTheme}>Duplizieren</button>
				</div>
			</div>
			<div class="theme-list">
				{#each content.themes as t (t.id)}
					<div class="theme-row" class:sel={selectedId === t.id}>
						<label class="active-radio" title="Als aktives Theme setzen">
							<input type="radio" name="activeTheme" value={t.id} bind:group={content.activeId} />
							<span>Aktiv</span>
						</label>
						<button type="button" class="theme-name-btn" onclick={() => (selectedId = t.id)}>
							<span class="swatches" aria-hidden="true">
								<span style="background:{t.colors.primary}"></span>
								<span style="background:{t.colors.soft}"></span>
								<span style="background:{t.colors.ink}"></span>
								<span style="background:{t.colors.cream}"></span>
							</span>
							{t.name || 'Unbenannt'}
						</button>
						<button type="button" class="icon-btn danger" onclick={() => deleteTheme(t.id)} title="Löschen" aria-label="Theme löschen">✕</button>
					</div>
				{/each}
			</div>
		</section>

		<!-- ─── Ausgewähltes Theme bearbeiten ─── -->
		{#if selected}
			<section class="card">
				<div class="card-head">
					<h2>Theme bearbeiten</h2>
					{#if selected.id === content.activeId}<span class="badge">aktiv</span>{/if}
				</div>

				<label class="field">
					<span>Name</span>
					<input type="text" bind:value={selected.name} placeholder="Theme-Name" />
				</label>

				<h3 class="sub">Farben</h3>
				<div class="colors">
					{#each [ ['primary','Primär (Buttons, Akzente)'], ['primaryDark','Primär dunkel (Hover)'], ['ink','Text / Überschrift'], ['cream','Hintergrund'], ['header','Header (Navbar-Hintergrund)'], ['soft','Akzent hell (Badges, Tags, Flächen)'] ] as [key, label]}
						<div class="color-field">
							<span>{label}</span>
							<div class="color-row">
								<input type="color" bind:value={selected.colors[key as keyof typeof selected.colors]} aria-label={label} />
								<input type="text" class="hex" bind:value={selected.colors[key as keyof typeof selected.colors]} />
							</div>
						</div>
					{/each}
				</div>

				<h3 class="sub">Schriften</h3>
				<div class="fonts">
					{#each [ { label: 'Überschriften', field: 'heading', options: HEADING_FONTS }, { label: 'Fliesstext & UI', field: 'body', options: BODY_FONTS }, { label: 'Handschrift / Akzent', field: 'hand', options: HAND_FONTS } ] as slot (slot.field)}
						<div class="font-field">
							<span>{slot.label}</span>
							<select bind:value={selected.fonts[slot.field as keyof ThemeFontSelection]} aria-label={slot.label}>
								{#each slot.options as f (f.key)}
									<option value={f.key}>{f.label}</option>
								{/each}
							</select>
						</div>
					{/each}
				</div>

				<h3 class="sub">Hero</h3>
				<div class="slot">
					<div class="slot-label">
						<strong>Hero der Startseite</strong>
						<span class="muted">Variante und Inhalte unter <a href="/admin/hero">Hero</a> pflegen</span>
					</div>
					<div class="slot-pick">
						<select bind:value={selected.heroPresetId} aria-label="Hero wählen">
							<option value="">— Erster Hero ({data.heroPresets[0]?.name ?? 'Standard'}) —</option>
							{#each data.heroPresets as hp (hp.id)}
								<option value={hp.id}>{hp.name} ({hp.variant === 'slider' ? 'Zwei Welten' : 'Klassisch'})</option>
							{/each}
						</select>
					</div>
				</div>

				<h3 class="sub">Bilder</h3>
				<p class="hint">Bilder hochladen und verwalten in der <a href="/admin/mediathek">Mediathek</a>.</p>
				<div class="slot">
					<div class="slot-label">
						<strong>Hero-Bild</strong>
						<span class="muted">leer = Standard-Frucht</span>
					</div>
					<div class="slot-pick">
						<div class="slot-thumb">
							{#if selected.heroImage}<img src={selected.heroImage} alt="Hero" />{:else}<span class="thumb-empty">Standard</span>{/if}
						</div>
						<select bind:value={selected.heroImage} aria-label="Hero-Bild wählen">
							<option value="">— Standard —</option>
							{#each library as img (img.id)}
								<option value={img.url}>{img.name}</option>
							{/each}
						</select>
					</div>
				</div>

				{#each pillarSlots as slot}
					<div class="slot">
						<div class="slot-label">
							<strong>{slot.title || 'Pillar'}</strong>
							<span class="muted">Pillar-Bild</span>
						</div>
						<div class="slot-pick">
							<div class="slot-thumb">
								{#if selected.pillarImages[slot.key]}<img src={selected.pillarImages[slot.key]} alt={slot.title} />{:else}<span class="thumb-empty">kein Bild</span>{/if}
							</div>
							<select bind:value={selected.pillarImages[slot.key]} aria-label="Bild für {slot.title}">
								<option value="">— kein Bild —</option>
								{#each library as img (img.id)}
									<option value={img.url}>{img.name}</option>
								{/each}
							</select>
						</div>
					</div>
				{/each}
			</section>
		{/if}

		<div class="save-bar">
			<span class="save-info">Aktiv: <strong>{activeName}</strong></span>
			<button type="submit" class="btn solid" disabled={saving}>{saving ? 'Speichern…' : 'Speichern'}</button>
		</div>
	</form>
</div>

<style>
	.themes-page {
		max-width: 900px;
	}
	.page-header {
		margin-bottom: 24px;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: 14px;
	}
	.back-link:hover { color: var(--btb-steel); }
	.page-header h1 {
		font-family: var(--ff-serif);
		font-size: 1.9rem;
		color: var(--text-heading);
		margin: 0 0 6px;
	}
	.page-subtitle {
		color: var(--text-secondary);
		font-size: 0.92rem;
		margin: 0;
	}

	.toast {
		padding: 12px 16px;
		border-radius: var(--radius-md);
		font-size: 0.88rem;
		margin-bottom: 16px;
	}
	.toast-success { background: rgba(52, 211, 153, 0.12); color: #0f9d6b; border: 1px solid rgba(52, 211, 153, 0.3); }
	.toast-error { background: rgba(251, 113, 133, 0.1); color: var(--color-error); border: 1px solid rgba(251, 113, 133, 0.3); }

	.card {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		padding: 20px 22px;
		margin-bottom: 18px;
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}
	.card-head h2 {
		font-family: var(--ff-serif);
		font-size: 1.15rem;
		color: var(--text-heading);
		margin: 0;
	}
	.head-actions { display: flex; gap: 8px; }
	.hint { font-size: 0.82rem; color: var(--text-muted); margin: 0 0 14px; }
	.hint a { color: var(--btb-steel); }
	.muted { font-size: 0.78rem; color: var(--text-muted); }
	.muted a { color: var(--btb-steel); }
	.badge {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		color: #fff;
		background: var(--btb-steel);
		padding: 3px 9px;
		border-radius: var(--radius-pill);
	}

	/* Theme-Liste */
	.theme-list { display: flex; flex-direction: column; gap: 8px; }
	.theme-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 10px;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--bg-page);
	}
	.theme-row.sel { border-color: var(--btb-steel); }
	.active-radio {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.74rem;
		color: var(--text-secondary);
		cursor: pointer;
		flex-shrink: 0;
	}
	.theme-name-btn {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: left;
		padding: 4px;
	}
	.swatches { display: inline-flex; gap: 2px; }
	.swatches span {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		border: 1px solid var(--border);
	}


	/* Felder */
	.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
	.field span { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); }
	.sub {
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		margin: 18px 0 10px;
	}
	input[type='text'], select {
		padding: 9px 12px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
		color: var(--text-primary);
		font-size: 0.88rem;
		font-family: var(--ff-ui);
	}
	input[type='text']:focus, select:focus { outline: none; border-color: var(--btb-steel); }

	.colors {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
	}
	.fonts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
	}
	.font-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.font-field > span {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}
	.color-field { display: flex; flex-direction: column; gap: 6px; }
	.color-field > span { font-size: 0.8rem; color: var(--text-secondary); }
	.color-row { display: flex; gap: 8px; align-items: center; }
	.color-row input[type='color'] {
		width: 42px;
		height: 38px;
		padding: 2px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
		cursor: pointer;
	}
	.hex { width: 110px; text-transform: lowercase; }

	/* Slots */
	.slot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 10px 0;
		border-top: 1px solid var(--border);
	}
	.slot-label { display: flex; flex-direction: column; gap: 2px; }
	.slot-label strong { font-size: 0.9rem; color: var(--text-primary); }
	.slot-pick { display: flex; align-items: center; gap: 10px; }
	.slot-thumb {
		width: 54px;
		height: 54px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-page);
		flex-shrink: 0;
	}
	.slot-thumb img { width: 100%; height: 100%; object-fit: contain; }
	.thumb-empty { font-size: 0.62rem; color: var(--text-muted); text-align: center; }
	.slot-pick select { min-width: 180px; }

	/* Buttons */
	.btn {
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 0.85rem;
		padding: 9px 18px;
		border-radius: var(--radius-button);
		cursor: pointer;
		border: 1.5px solid transparent;
		transition: all 0.15s;
	}
	.btn.solid { background: var(--btb-steel); color: #fff; }
	.btn.solid:hover:not(:disabled) { background: var(--btb-steel-hover); }
	.btn.solid:disabled { opacity: 0.6; cursor: not-allowed; }
	.btn.ghost { background: var(--bg-page); border-color: var(--border); color: var(--text-secondary); }
	.btn.ghost:hover { border-color: var(--btb-steel); color: var(--btb-steel); }
	.icon-btn {
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		background: var(--bg-surface);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.8rem;
		flex-shrink: 0;
	}
	.icon-btn.danger:hover { border-color: var(--color-error); color: var(--color-error); }

	.save-bar {
		position: sticky;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 0;
		background: linear-gradient(transparent, var(--bg-page) 30%);
	}
	.save-info { font-size: 0.85rem; color: var(--text-secondary); }
</style>
