<script lang="ts">
	import type { KeynotesPageContent } from '$lib/types/content';
	import AdminAccordionItem from '$lib/components/ui/AdminAccordionItem.svelte';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';

	let { data, form } = $props();
	let content = $state<KeynotesPageContent>(structuredClone(data.content));
	let saving = $state(false);
	let showSuccess = $state(false);

	let expTalks = $state<number | null>(0);
	let expLehre = $state<number | null>(null);
	let expFormats = $state<number | null>(null);
	let expPost = $state<number | null>(null);
	let expFaq = $state<number | null>(null);

	// Zeilen-Arrays (Takeaways, Meta) erst beim Speichern trimmen.
	function cleaned(): KeynotesPageContent {
		const c = structuredClone($state.snapshot(content)) as KeynotesPageContent;
		c.signature.items = c.signature.items.map((t) => ({
			...t,
			takeaways: (t.takeaways ?? []).map((x) => x.trim()).filter(Boolean),
			meta: (t.meta ?? []).map((x) => x.trim()).filter(Boolean)
		}));
		return c;
	}
	let serialized = $derived(JSON.stringify(cleaned()));

	function move<T>(arr: T[], i: number, dir: -1 | 1): number {
		const t = i + dir;
		if (t < 0 || t >= arr.length) return i;
		[arr[i], arr[t]] = [arr[t], arr[i]];
		return t;
	}
	function fromText(v: string): string[] {
		return v.split('\n');
	}

	// Speaker-Kit-PDF hochladen/ersetzen
	let kitUploading = $state(false);
	let kitError = $state('');
	async function uploadKit(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		kitUploading = true;
		kitError = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('section', 'speaker-kit');
			const res = await fetch('/api/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				const d = await res.json().catch(() => ({ message: 'Upload fehlgeschlagen.' }));
				throw new Error(d.message ?? `Fehler ${res.status}`);
			}
			const d = await res.json();
			content.cta.dark.speakerKitUrl = d.url;
		} catch (err) {
			kitError = err instanceof Error ? err.message : 'Upload fehlgeschlagen.';
		} finally {
			kitUploading = false;
			input.value = '';
		}
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
	<title>Keynotes-Seite — Admin — Break the Box</title>
</svelte:head>

<div class="editor-page">
	<div class="page-header">
		<a href="/admin" class="back-link">
			<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3m0 0l5-5M3 9l5 5" /></svg>
			Zurück zum Dashboard
		</a>
		<h1>Keynotes-Seite</h1>
		<p class="page-subtitle">Der redaktionelle Inhalt der Seite «Keynotes» — Hero, Signature-Talks, USP, Formate, Lehre, CTA und Post-Event. Die <strong>Termine</strong> (kommend/vergangen) pflegst du weiterhin unter <a href="/admin/keynotes">Keynotes / Termine</a>. In Feldern mit dem Hinweis setzt <code class="hint-code">**Wort**</code> ein Wort in der Akzentfarbe.</p>
	</div>

	{#if showSuccess}<div class="toast toast-success">Änderungen erfolgreich gespeichert.</div>{/if}
	{#if form?.error}<div class="toast toast-error">{form.error}</div>{/if}

	<form method="POST" onsubmit={() => (saving = true)}>
		<input type="hidden" name="content" value={serialized} />

		<!-- Hero -->
		<details class="card" open>
			<summary class="card-head"><h2>Hero</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="h-kick">Kicker</label><input id="h-kick" type="text" class="field-input" bind:value={content.hero.kicker} /></div>
				<div class="field"><label class="field-label" for="h-title">Titel <span class="field-hint">**Wort** = Akzent</span></label><textarea id="h-title" class="field-textarea" rows="2" bind:value={content.hero.title}></textarea></div>
				<div class="field"><label class="field-label" for="h-sub">Subline</label><textarea id="h-sub" class="field-textarea" rows="3" bind:value={content.hero.subline}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="h-c1">Button primär</label><input id="h-c1" type="text" class="field-input" bind:value={content.hero.ctaPrimary} /></div>
					<div class="field"><label class="field-label" for="h-c2">Button sekundär</label><input id="h-c2" type="text" class="field-input" bind:value={content.hero.ctaSecondary} /></div>
				</div>
			</div>
		</details>

		<!-- Signature-Talks -->
		<details class="card">
			<summary class="card-head"><h2>Signature-Talks</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="s-kick">Kicker</label><input id="s-kick" type="text" class="field-input" bind:value={content.signature.kicker} /></div>
				<div class="field"><label class="field-label" for="s-title">Titel</label><input id="s-title" type="text" class="field-input" bind:value={content.signature.title} /></div>
				<div class="field"><label class="field-label" for="s-lead">Lead</label><textarea id="s-lead" class="field-textarea" rows="2" bind:value={content.signature.lead}></textarea></div>

				<div class="items">
					{#each content.signature.items as talk, i}
						<AdminAccordionItem
							index={i}
							total={content.signature.items.length}
							title={talk.title || 'Neuer Talk'}
							expanded={expTalks === i}
							removeLabel="Talk löschen"
							ontoggle={() => (expTalks = expTalks === i ? null : i)}
							onmoveup={() => (expTalks = move(content.signature.items, i, -1))}
							onmovedown={() => (expTalks = move(content.signature.items, i, 1))}
							onremove={() => content.signature.items.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="tk-{i}">Kicker <span class="field-hint">z.B. «Die Simulation · Premiere …»</span></label><input id="tk-{i}" type="text" class="field-input" bind:value={talk.kicker} /></div>
							<div class="field"><label class="field-label" for="tt-{i}">Titel</label><input id="tt-{i}" type="text" class="field-input" bind:value={talk.title} /></div>
							<div class="field"><label class="field-label" for="td-{i}">Beschreibung</label><textarea id="td-{i}" class="field-textarea" rows="3" bind:value={talk.desc}></textarea></div>
							<div class="field"><label class="field-label" for="tl-{i}">Takeaways-Label</label><input id="tl-{i}" type="text" class="field-input" bind:value={talk.takeawaysLabel} /></div>
							<div class="field"><label class="field-label" for="tw-{i}">Takeaways <span class="field-hint">ein Punkt pro Zeile</span></label><textarea id="tw-{i}" class="field-textarea" rows="4" value={talk.takeaways.join('\n')} oninput={(e) => (talk.takeaways = fromText(e.currentTarget.value))}></textarea></div>
							<div class="field"><label class="field-label" for="tm-{i}">Meta-Tags <span class="field-hint">ein Tag pro Zeile</span></label><textarea id="tm-{i}" class="field-textarea" rows="3" value={talk.meta.join('\n')} oninput={(e) => (talk.meta = fromText(e.currentTarget.value))}></textarea></div>
							<div class="field-row">
								<div class="field"><label class="field-label" for="tll-{i}">Link-Label</label><input id="tll-{i}" type="text" class="field-input" bind:value={talk.linkLabel} /></div>
								<div class="field"><label class="field-label" for="tlu-{i}">Link-URL <span class="field-hint">optional</span></label><input id="tlu-{i}" type="text" class="field-input" bind:value={talk.linkUrl} placeholder="https://…" /></div>
							</div>
							<ImageUpload bind:value={talk.image} section="talk-{i}" label="Bild (optional, als Kartenkopf)" />
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.signature.items.push({ kicker: '', title: '', desc: '', takeawaysLabel: 'Was bleibt hängen', takeaways: [], meta: [], linkLabel: '', linkUrl: '' }); expTalks = content.signature.items.length - 1; }}>+ Talk hinzufügen</button>
			</div>
		</details>

		<!-- USP -->
		<details class="card">
			<summary class="card-head"><h2>USP (Petrol-Band)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="u-kick">Kicker</label><input id="u-kick" type="text" class="field-input" bind:value={content.usp.kicker} /></div>
				<div class="field"><label class="field-label" for="u-big">Grosse Aussage <span class="field-hint">*Text* = kursiv im Akzent</span></label><textarea id="u-big" class="field-textarea" rows="2" bind:value={content.usp.big}></textarea></div>
				<div class="field"><label class="field-label" for="u-small">Text</label><textarea id="u-small" class="field-textarea" rows="3" bind:value={content.usp.small}></textarea></div>
				<div class="field"><label class="field-label" for="u-demo">Callout-Box <span class="field-hint">«So sieht der Moment aus …»</span></label><textarea id="u-demo" class="field-textarea" rows="2" bind:value={content.usp.demo}></textarea></div>
			</div>
		</details>

		<!-- Formate -->
		<details class="card">
			<summary class="card-head"><h2>Formate</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="f-kick">Kicker</label><input id="f-kick" type="text" class="field-input" bind:value={content.formats.kicker} /></div>
				<div class="field"><label class="field-label" for="f-title">Titel</label><input id="f-title" type="text" class="field-input" bind:value={content.formats.title} /></div>
				<div class="field"><label class="field-label" for="f-lead">Lead</label><input id="f-lead" type="text" class="field-input" bind:value={content.formats.lead} /></div>

				<div class="items">
					{#each content.formats.items as fmt, i}
						<AdminAccordionItem
							index={i}
							total={content.formats.items.length}
							title={fmt.title || 'Neues Format'}
							subtitle={fmt.label || undefined}
							expanded={expFormats === i}
							removeLabel="Format löschen"
							ontoggle={() => (expFormats = expFormats === i ? null : i)}
							onmoveup={() => (expFormats = move(content.formats.items, i, -1))}
							onmovedown={() => (expFormats = move(content.formats.items, i, 1))}
							onremove={() => content.formats.items.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="fl-{i}">Label <span class="field-hint">z.B. «30–60 Minuten»</span></label><input id="fl-{i}" type="text" class="field-input" bind:value={fmt.label} /></div>
								<div class="field"><label class="field-label" for="ft-{i}">Titel</label><input id="ft-{i}" type="text" class="field-input" bind:value={fmt.title} /></div>
							</div>
							<div class="field"><label class="field-label" for="fd-{i}">Beschreibung</label><textarea id="fd-{i}" class="field-textarea" rows="3" bind:value={fmt.desc}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.formats.items.push({ label: '', title: '', desc: '' }); expFormats = content.formats.items.length - 1; }}>+ Format hinzufügen</button>
			</div>
		</details>

		<!-- Lehre -->
		<details class="card">
			<summary class="card-head"><h2>Lehre</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<div class="field"><label class="field-label" for="l-kick">Kicker</label><input id="l-kick" type="text" class="field-input" bind:value={content.lehre.kicker} /></div>
				<div class="field"><label class="field-label" for="l-title">Titel</label><input id="l-title" type="text" class="field-input" bind:value={content.lehre.title} /></div>
				<div class="field"><label class="field-label" for="l-text">Text</label><textarea id="l-text" class="field-textarea" rows="3" bind:value={content.lehre.text}></textarea></div>
				<div class="field"><label class="field-label" for="l-quote">Zitat</label><textarea id="l-quote" class="field-textarea" rows="2" bind:value={content.lehre.quote}></textarea></div>

				<h3 class="sub">Lehr-Leitungen / Lehrgänge</h3>
				<div class="items">
					{#each content.lehre.items as item, i}
						<AdminAccordionItem
							index={i}
							total={content.lehre.items.length}
							title={item.title || 'Neuer Eintrag'}
							subtitle={[item.role, item.org].filter(Boolean).join(' · ') || undefined}
							expanded={expLehre === i}
							removeLabel="Eintrag löschen"
							ontoggle={() => (expLehre = expLehre === i ? null : i)}
							onmoveup={() => (expLehre = move(content.lehre.items, i, -1))}
							onmovedown={() => (expLehre = move(content.lehre.items, i, 1))}
							onremove={() => content.lehre.items.splice(i, 1)}
						>
							<div class="field-row">
								<div class="field"><label class="field-label" for="lr-{i}">Rolle <span class="field-hint">z.B. «Studiengangsleitung»</span></label><input id="lr-{i}" type="text" class="field-input" bind:value={item.role} /></div>
								<div class="field"><label class="field-label" for="ln-{i}">Zusatz <span class="field-hint">optional, z.B. «ehemals»</span></label><input id="ln-{i}" type="text" class="field-input" bind:value={item.note} /></div>
							</div>
							<div class="field"><label class="field-label" for="lt-{i}">Titel <span class="field-hint">z.B. «CAS Projektmanagement»</span></label><input id="lt-{i}" type="text" class="field-input" bind:value={item.title} /></div>
							<div class="field"><label class="field-label" for="lo-{i}">Institution</label><input id="lo-{i}" type="text" class="field-input" bind:value={item.org} /></div>
							<div class="field"><label class="field-label" for="lu-{i}">Link zum Lehrgang <span class="field-hint">optional — Anmeldung / Info</span></label><input id="lu-{i}" type="text" class="field-input" bind:value={item.url} placeholder="https://…" /></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.lehre.items.push({ role: 'Leitung', title: '', org: '' }); expLehre = content.lehre.items.length - 1; }}>+ Lehrgang hinzufügen</button>
			</div>
		</details>

		<!-- Auftritte -->
		<details class="card">
			<summary class="card-head"><h2>Auftritte (Kopf)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<p class="card-note">Nur der Kopf dieser Sektion. Die Termine selbst kommen aus <a href="/admin/keynotes">Keynotes / Termine</a> (kommend/vergangen automatisch nach Datum).</p>
				<div class="field"><label class="field-label" for="a-kick">Kicker</label><input id="a-kick" type="text" class="field-input" bind:value={content.auftritte.kicker} /></div>
				<div class="field"><label class="field-label" for="a-title">Titel</label><input id="a-title" type="text" class="field-input" bind:value={content.auftritte.title} /></div>
				<div class="field"><label class="field-label" for="a-lead">Lead</label><input id="a-lead" type="text" class="field-input" bind:value={content.auftritte.lead} /></div>
			</div>
		</details>

		<!-- CTA -->
		<details class="card">
			<summary class="card-head"><h2>CTA (zweigleisig)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<h3 class="sub">Dunkle Karte (Speaker-Kit)</h3>
				<div class="field"><label class="field-label" for="cd-t">Titel</label><input id="cd-t" type="text" class="field-input" bind:value={content.cta.dark.title} /></div>
				<div class="field"><label class="field-label" for="cd-x">Text</label><textarea id="cd-x" class="field-textarea" rows="2" bind:value={content.cta.dark.text}></textarea></div>
				<div class="field"><label class="field-label" for="cd-l">Button-Label</label><input id="cd-l" type="text" class="field-input" bind:value={content.cta.dark.ctaLabel} /></div>
				<div class="field">
					<span class="field-label">Speaker-Kit-PDF <span class="field-hint">leer → Button öffnet die E-Mail-Anfrage</span></span>
					<div class="pdf-box">
						{#if content.cta.dark.speakerKitUrl}
							<a class="pdf-link" href={content.cta.dark.speakerKitUrl} target="_blank" rel="noopener noreferrer">Aktuelles PDF ansehen ↗</a>
							<button type="button" class="pdf-clear" onclick={() => (content.cta.dark.speakerKitUrl = '')}>entfernen</button>
						{:else}
							<span class="pdf-empty">Kein PDF — E-Mail-Fallback aktiv</span>
						{/if}
						<label class="pdf-upload">
							<input type="file" accept="application/pdf" onchange={uploadKit} hidden />
							<span class="btn-file">{kitUploading ? 'Lädt…' : 'PDF hochladen'}</span>
						</label>
					</div>
					{#if kitError}<span class="pdf-err">{kitError}</span>{/if}
				</div>
				<div class="field"><label class="field-label" for="cd-m">E-Mail-Fallback <span class="field-hint">mailto:… (wenn kein PDF)</span></label><input id="cd-m" type="text" class="field-input" bind:value={content.cta.dark.mailtoHref} /></div>

				<h3 class="sub">Helle Karte (direkter Austausch)</h3>
				<div class="field"><label class="field-label" for="cl-t">Titel</label><input id="cl-t" type="text" class="field-input" bind:value={content.cta.light.title} /></div>
				<div class="field"><label class="field-label" for="cl-x">Text</label><textarea id="cl-x" class="field-textarea" rows="2" bind:value={content.cta.light.text}></textarea></div>
				<div class="field-row">
					<div class="field"><label class="field-label" for="cl-l">Button-Label</label><input id="cl-l" type="text" class="field-input" bind:value={content.cta.light.ctaLabel} /></div>
					<div class="field"><label class="field-label" for="cl-h">Button-Ziel</label><input id="cl-h" type="text" class="field-input" bind:value={content.cta.light.ctaHref} placeholder="mailto:…" /></div>
				</div>
			</div>
		</details>

		<!-- Post-Event -->
		<details class="card">
			<summary class="card-head"><h2>Post-Event (nach dem Referat)</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<p class="card-note">Dunkles Band als QR-Ziel während des Referats (<code>#nach-dem-referat</code>).</p>
				<div class="field"><label class="field-label" for="p-kick">Kicker</label><input id="p-kick" type="text" class="field-input" bind:value={content.postEvent.kicker} /></div>
				<div class="field"><label class="field-label" for="p-title">Titel</label><input id="p-title" type="text" class="field-input" bind:value={content.postEvent.title} /></div>

				<div class="items">
					{#each content.postEvent.cards as card, i}
						<AdminAccordionItem
							index={i}
							total={content.postEvent.cards.length}
							title={card.title || 'Neue Karte'}
							expanded={expPost === i}
							removeLabel="Karte löschen"
							ontoggle={() => (expPost = expPost === i ? null : i)}
							onmoveup={() => (expPost = move(content.postEvent.cards, i, -1))}
							onmovedown={() => (expPost = move(content.postEvent.cards, i, 1))}
							onremove={() => content.postEvent.cards.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="pt-{i}">Titel</label><input id="pt-{i}" type="text" class="field-input" bind:value={card.title} /></div>
							<div class="field"><label class="field-label" for="pd-{i}">Text</label><textarea id="pd-{i}" class="field-textarea" rows="2" bind:value={card.desc}></textarea></div>
							<div class="field"><label class="field-label" for="pu-{i}">Link <span class="field-hint">optional (URL oder mailto:)</span></label><input id="pu-{i}" type="text" class="field-input" bind:value={card.url} /></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.postEvent.cards.push({ title: '', desc: '', url: '' }); expPost = content.postEvent.cards.length - 1; }}>+ Karte hinzufügen</button>
			</div>
		</details>

		<!-- FAQ -->
		<details class="card">
			<summary class="card-head"><h2>Häufige Fragen</h2><span class="card-chevron" aria-hidden="true">▾</span></summary>
			<div class="card-body">
				<p class="card-note">Erscheint als «Kurz beantwortet» und speist die FAQ-Structured-Data (SEO/GEO).</p>
				<div class="items">
					{#each content.faq.items as item, i}
						<AdminAccordionItem
							index={i}
							total={content.faq.items.length}
							title={item.question || 'Neue Frage'}
							expanded={expFaq === i}
							removeLabel="Frage löschen"
							ontoggle={() => (expFaq = expFaq === i ? null : i)}
							onmoveup={() => (expFaq = move(content.faq.items, i, -1))}
							onmovedown={() => (expFaq = move(content.faq.items, i, 1))}
							onremove={() => content.faq.items.splice(i, 1)}
						>
							<div class="field"><label class="field-label" for="fq-{i}">Frage</label><input id="fq-{i}" type="text" class="field-input" bind:value={item.question} /></div>
							<div class="field"><label class="field-label" for="fa-{i}">Antwort</label><textarea id="fa-{i}" class="field-textarea" rows="3" bind:value={item.answer}></textarea></div>
						</AdminAccordionItem>
					{/each}
				</div>
				<button type="button" class="btn-add" onclick={() => { content.faq.items.push({ question: '', answer: '' }); expFaq = content.faq.items.length - 1; }}>+ Frage hinzufügen</button>
			</div>
		</details>

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
	}
	.page-subtitle a {
		color: var(--btb-steel);
	}
	.hint-code {
		font-family: var(--ff-mono);
		font-size: 0.8rem;
		background: var(--bg-elevated);
		padding: 1px 5px;
		border-radius: 4px;
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

	.card {
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		margin-bottom: 12px;
		overflow: hidden;
	}
	.card[open] {
		border-color: var(--btb-steel);
	}
	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 18px 24px;
		cursor: pointer;
		list-style: none;
		user-select: none;
	}
	.card-head::-webkit-details-marker {
		display: none;
	}
	.card-head:hover {
		background: var(--bg-elevated);
	}
	.card-head h2 {
		font-family: var(--ff-serif);
		font-size: 1.2rem;
		color: var(--text-heading);
		margin: 0;
	}
	.card-chevron {
		color: var(--text-muted);
		font-size: 0.9rem;
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.card[open] .card-chevron {
		transform: rotate(180deg);
	}
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 18px 24px 22px;
		border-top: 1px solid var(--border);
	}
	.card-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0;
	}
	.card-note a {
		color: var(--btb-steel);
	}
	.card-note code {
		font-family: var(--ff-mono);
		font-size: 0.78rem;
		background: var(--bg-elevated);
		padding: 1px 5px;
		border-radius: 4px;
	}
	.sub {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		margin: 8px 0 0;
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
	.field-row {
		display: flex;
		gap: 14px;
	}
	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.field-hint {
		font-weight: 400;
		color: var(--text-muted);
		font-size: 0.75rem;
		margin-left: 6px;
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

	/* Speaker-Kit-PDF */
	.pdf-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		padding: 12px 14px;
		border: 1.5px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-page);
	}
	.pdf-link {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
	}
	.pdf-link:hover {
		text-decoration: underline;
	}
	.pdf-clear {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 0.78rem;
		cursor: pointer;
		text-decoration: underline;
	}
	.pdf-empty {
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.pdf-upload {
		cursor: pointer;
		margin-left: auto;
	}
	.btn-file {
		display: inline-block;
		padding: 8px 16px;
		border-radius: var(--radius-button);
		background: var(--btb-steel-subtle);
		color: var(--btb-steel);
		font-size: 0.82rem;
		font-weight: 600;
	}
	.pdf-upload:hover .btn-file {
		background: var(--btb-steel);
		color: #fff;
	}
	.pdf-err {
		font-size: 0.8rem;
		color: var(--color-error);
		margin-top: 6px;
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
	@media (max-width: 560px) {
		.field-row {
			flex-direction: column;
		}
	}
</style>
