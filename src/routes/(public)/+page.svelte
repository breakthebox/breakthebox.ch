<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { PillarsContent, AboutContent, ReferencesContent, AngebotContent, TestimonialsContent, MetricsContent, PartnersContent, KeynotesContent, KeynoteItem, FaqContent, HeroPreset } from '$lib/types/content';
	import HeroSlider from '$lib/components/ui/HeroSlider.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import { renderMarkdown, renderMarkdownBlock } from '$lib/utils/markdown';
	import { env } from '$env/dynamic/public';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';
	import { buildFaqPage, buildEvent, buildGraph } from '$lib/utils/schema';
	import { safeColor, mixHex, softFromPrimary } from '$lib/utils/color';

	let { data } = $props();

	// ─── Aktives Theme (Farben + Bilder) ───
	const theme = data.theme;
	// Homepage-Tokens (.hbb) inline überschreiben — schlägt scoped Defaults.
	// Abgeleitete Töne (Flächen, Linien, Sekundärtext) werden aus den
	// Theme-Farben gemischt, damit kein Rosé-Rest übrig bleibt.
	const cPrimary = safeColor(theme?.colors?.primary, '#b11e2c');
	const cPrimaryDark = safeColor(theme?.colors?.primaryDark, '#8e1622');
	const cInk = safeColor(theme?.colors?.ink, '#2b1a1c');
	const cCream = safeColor(theme?.colors?.cream, '#fbf1ec');
	const cSoft = safeColor(theme?.colors?.soft, softFromPrimary(cPrimary));
	const hbbStyle =
		`--red:${cPrimary};--redd:${cPrimaryDark};--ink:${cInk};--cream:${cCream};` +
		`--pink:${cSoft};--cream2:${mixHex(cCream, cSoft, 0.5)};` +
		`--line:${mixHex(cSoft, cInk, 0.92)};--dim:${mixHex(cInk, cCream, 0.55)};`;
	const heroImage = theme?.heroImage || '/fruits/hero.png';
	// Theme-Bild ist die Basis; ein im Pillar gesetztes Bild überschreibt es.
	function pillarImage(p: PillarsContent['pillars'][number]): string | undefined {
		return p.image || theme?.pillarImages?.[p.key];
	}

	// Content from DB (with fallback to defaults in server load)
	const hero: HeroPreset = data.hero;
	const heroClassic = hero.classic;
	const pillars: PillarsContent = data.pillars;
	const about: AboutContent = data.about;
	const references: ReferencesContent = data.references;
	const angebot: AngebotContent = data.angebot;
	const testimonials: TestimonialsContent = data.testimonials;
	const metrics: MetricsContent = data.metrics;
	const partners: PartnersContent = data.partners;

	// ─── Bühne / Auftritte ───
	const keynotes: KeynotesContent = data.keynotes;
	const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
	const MONTHS_SHORT_DE = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'];
	const STRIP_WINDOW_DAYS = 42; // Streifen erscheint 6 Wochen vor dem Termin

	function toDate(s: string | undefined): Date | null {
		if (!s) return null;
		const d = new Date(s);
		return isNaN(d.getTime()) ? null : d;
	}
	function startOfToday(): Date {
		const t = new Date();
		t.setHours(0, 0, 0, 0);
		return t;
	}
	// Ein Auftritt gilt als «kommend», solange sein (End-)Datum nicht vor heute liegt.
	function isUpcoming(a: KeynoteItem): boolean {
		const end = toDate(a.endDate) ?? toDate(a.date);
		return end ? end >= startOfToday() : false;
	}
	function ts(s: string | undefined): number {
		return toDate(s)?.getTime() ?? 0;
	}
	function fmtDay(s: string | undefined): string {
		const d = toDate(s);
		return d ? String(d.getDate()) : '';
	}
	function fmtMonthShort(s: string | undefined): string {
		const d = toDate(s);
		return d ? MONTHS_SHORT_DE[d.getMonth()] : '';
	}
	function fmtYear(s: string | undefined): string {
		const d = toDate(s);
		return d ? String(d.getFullYear()) : '';
	}
	function fmtRange(a: KeynoteItem): string {
		const d1 = toDate(a.date);
		if (!d1) return '';
		const d2 = toDate(a.endDate);
		if (!d2 || d2.getTime() === d1.getTime()) {
			return `${d1.getDate()}. ${MONTHS_DE[d1.getMonth()]} ${d1.getFullYear()}`;
		}
		if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
			return `${d1.getDate()}.–${d2.getDate()}. ${MONTHS_DE[d1.getMonth()]} ${d1.getFullYear()}`;
		}
		if (d1.getFullYear() === d2.getFullYear()) {
			return `${d1.getDate()}. ${MONTHS_DE[d1.getMonth()]} – ${d2.getDate()}. ${MONTHS_DE[d2.getMonth()]} ${d1.getFullYear()}`;
		}
		return `${d1.getDate()}. ${MONTHS_DE[d1.getMonth()]} ${d1.getFullYear()} – ${d2.getDate()}. ${MONTHS_DE[d2.getMonth()]} ${d2.getFullYear()}`;
	}
	function metaLine(a: KeynoteItem): string {
		return [a.event, a.format].filter((x) => x?.trim()).join(' · ');
	}

	// Kommend: hervorgehobene zuerst, dann nach Startdatum aufsteigend. Vergangen: neuste zuerst.
	const upcoming = keynotes.items.filter(isUpcoming).sort((a, b) => {
		if (!!b.featured !== !!a.featured) return a.featured ? -1 : 1;
		return ts(a.date) - ts(b.date);
	});
	const past = keynotes.items.filter((a) => !isUpcoming(a)).sort((a, b) => ts(b.date) - ts(a.date));
	const hasBuehne = upcoming.length > 0 || past.length > 0;

	// Ankündigungs-Streifen: nächster Termin nach Datum, sofern im Zeitfenster.
	const stripCandidate = [...upcoming].sort((a, b) => ts(a.date) - ts(b.date))[0] ?? null;
	const stripEligible =
		!!stripCandidate &&
		(ts(stripCandidate.date) - startOfToday().getTime()) / 86_400_000 <= STRIP_WINDOW_DAYS;

	let stripVisible = $state(false);
	function stripKey(a: KeynoteItem): string {
		return 'buehne-strip:' + a.date + ':' + a.title;
	}
	// Erst im Browser entscheiden — vermeidet Hydration-Flackern und respektiert «weggeklickt».
	$effect(() => {
		if (!stripEligible || !stripCandidate) return;
		try {
			stripVisible = !localStorage.getItem(stripKey(stripCandidate));
		} catch {
			// localStorage kann im Privatmodus fehlen — dann Streifen einfach zeigen.
			stripVisible = true;
		}
	});
	function dismissStrip() {
		stripVisible = false;
		if (!stripCandidate) return;
		try {
			localStorage.setItem(stripKey(stripCandidate), '1');
		} catch {
			// Kein persistentes Wegklicken möglich — unkritisch, Streifen ist schon ausgeblendet.
			stripVisible = false;
		}
	}

	// YouTube-Link (watch / youtu.be / shorts / embed / reine ID) → nocookie-Embed-URL
	function ytEmbed(url: string | undefined): string {
		if (!url) return '';
		const id =
			url.match(/(?:youtu\.be\/|\/embed\/|\/shorts\/|[?&]v=)([\w-]{11})/)?.[1] ??
			(/^[\w-]{11}$/.test(url.trim()) ? url.trim() : '');
		return id ? `https://www.youtube-nocookie.com/embed/${id}` : '';
	}
	const aboutVideoEmbed = ytEmbed(about.videoUrl);

	// Split client logos into two rows for counter-scrolling marquee
	const refHalf = Math.ceil(references.clients.length / 2);
	const refRow1 = references.clients.slice(0, refHalf);
	const refRow2 = references.clients.slice(refHalf);

	// Pillar-Karten: Flip (Beispiele) oder Absprung (Subseite)
	type PillarMode = 'flip' | 'link' | 'plain';
	function validExamples(p: PillarsContent['pillars'][number]) {
		return (p.examples ?? []).filter((e) => e.label?.trim() || e.desc?.trim());
	}
	function pillarMode(p: PillarsContent['pillars'][number]): PillarMode {
		if (p.subpageUrl?.trim()) return 'link';
		if (validExamples(p).length > 0) return 'flip';
		return 'plain';
	}
	let flipped = $state(pillars.pillars.map(() => false));
	function toggleFlip(i: number) {
		flipped[i] = !flipped[i];
	}
	function onPillarKey(e: KeyboardEvent, i: number) {
		// Nur reagieren, wenn die Karte selbst fokussiert ist — sonst würde Enter
		// auf einem Rückseiten-Link dessen Navigation blockieren und die Karte flippen.
		if (e.target !== e.currentTarget) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleFlip(i);
		}
	}

	let navScrolled = $state(false);
	let activeSection = $state('');

	const faq: FaqContent = data.faq;
	const SITE_URL = (env.PUBLIC_APP_URL || 'https://breakthebox.ch').replace(/\/$/, '');

	// Relative Uploads/Links zu absoluten URLs machen (Structured Data verlangt absolut).
	function absUrl(u: string | undefined): string | undefined {
		if (!u) return undefined;
		return /^https?:\/\//.test(u) ? u : SITE_URL + (u.startsWith('/') ? '' : '/') + u;
	}
	// Markdown zu Klartext für die JSON-LD-Beschreibung (keine Syntax/Tags in Structured Data).
	function mdToPlain(md: string | undefined): string | undefined {
		if (!md?.trim()) return undefined;
		const text = renderMarkdownBlock(md)
			.replace(/<li>/g, '• ')
			.replace(/<\/(p|li|h[1-6])>/g, ' ')
			.replace(/<[^>]+>/g, '')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/\s+/g, ' ')
			.trim();
		return text || undefined;
	}
	// Event-Structured-Data für jeden Auftritt mit gültigem Datum (E-E-A-T / Google-Events).
	const keynoteEvents = keynotes.items
		.filter((k) => k.date?.trim())
		.map((k, i) =>
			buildEvent({
				siteUrl: SITE_URL,
				id: `keynote-${i}`,
				name: k.title,
				startDate: k.date,
				endDate: k.endDate?.trim() || undefined,
				description: mdToPlain(k.desc),
				image: absUrl(k.image),
				url: absUrl(k.url),
				location: k.location?.trim() || undefined,
				organizer: k.event?.trim() || undefined
			})
		);
	const jsonLdGraph = buildGraph([buildFaqPage(SITE_URL + '/', faq.items), ...keynoteEvents]);

	// Scroll-aware nav: backdrop + active section
	$effect(() => {
		function onScroll() {
			navScrolled = window.scrollY > 20;
			const sectionIds = ['pillars', 'about', 'angebot', 'stimmen', 'impulse', 'kontakt'];
			let current = '';
			for (const id of sectionIds) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= 120) current = id;
			}
			activeSection = current;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Intersection Observer for reveal animations
	$effect(() => {
		const elements = document.querySelectorAll('.reveal');
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
		);
		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Brigitte Hulliger — IT-Strategie, Verwaltungsrat & KI | Break the Box</title>
	<meta name="description" content={m.hero_subline()} />
</svelte:head>

<div class="hbb" style={hbbStyle}>
	<ScrollProgress />
	{#snippet socialIcon(platform: string)}
		{#if platform === 'linkedin'}
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
		{:else if platform === 'instagram'}
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
		{:else if platform === 'youtube'}
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
		{:else if platform === 'x'}
			<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
		{:else if platform === 'xing'}
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.31.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916a.022.022 0 010-.022L22.139.756c.098-.191.098-.386.009-.538C22.06.078 21.906 0 21.695 0h-3.507zM3.648 4.74c-.211 0-.385.074-.473.216-.09.149-.078.339.02.531l2.34 4.05a.03.03 0 010 .024L1.86 16.051c-.099.188-.093.382-.005.531.087.142.239.234.45.234h3.468c.518 0 .766-.348.945-.667l3.723-6.588-2.369-4.13c-.173-.316-.436-.665-.967-.665H3.648v-.016z" /></svg>
		{:else if platform === 'github'}
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z" /></svg>
		{/if}
	{/snippet}
	<!-- ═══════ NAVIGATION ═══════ -->
	<nav class="nav" class:nav-scrolled={navScrolled}>
		<div class="nav-inner">
			<a href="/" class="brand">
				<img src="/box.svg" alt="" class="brand-cube" width="34" height="34" />
				<span class="brand-txt">
					<span class="brand-m">Brigitte Hulliger</span>
					<span class="brand-c">Break the Box</span>
				</span>
			</a>
			<div class="nav-links">
				<a href="#angebot" class:active={activeSection === 'angebot'}>{m.nav_services()}</a>
				<a href="#about" class:active={activeSection === 'about'}>{m.nav_about()}</a>
				<a href={localizeHref('/impulse')}>{m.nav_blog()}</a>
			</div>
			<a class="btn solid" href="#kontakt">{m.h_nav_cta()}</a>
		</div>
	</nav>

	<!-- ═══════ ANKÜNDIGUNGS-STREIFEN (nur bei nahem Termin) ═══════ -->
	{#if stripVisible && stripCandidate}
		<div class="astrip">
			<span class="pulse" aria-hidden="true"></span>
			<span class="live">{m.h_buehne_strip_live()}</span>
			<span class="astrip-body">
				<b>{stripCandidate.event || m.h_buehne_strip_fallback()}{stripCandidate.location ? ', ' + stripCandidate.location : ''}</b>
				— {stripCandidate.title}. <span class="when">{fmtRange(stripCandidate)}</span>
			</span>
			{#if stripCandidate.url}
				<a class="astrip-go" href={stripCandidate.url} target="_blank" rel="noopener noreferrer">{m.h_buehne_cta()} →</a>
			{/if}
			<button type="button" class="astrip-x" onclick={dismissStrip} aria-label={m.h_buehne_strip_dismiss()}>&times;</button>
		</div>
	{/if}

	<!-- ═══════ HERO (Variante aus Admin: klassisch oder Zwei-Welten-Slider) ═══════ -->
	{#if hero.variant === 'slider'}
		<HeroSlider content={hero.slider} />
	{:else}
		<header class="hero">
			<div class="wrap">
				<div class="heroGrid">
					<div class="heroText">
						<h1 class="hero-h1">{heroClassic.titleLine1}<br />{heroClassic.titleLine2Pre}<span class="red">{heroClassic.titleLine2Em}</span>.</h1>
						<div class="hero-ln"></div>
						<p class="hero-sub">{heroClassic.sub}</p>
						<p class="hero-acc">{heroClassic.accent}</p>
						<div class="hero-sig">{heroClassic.signature}</div>
						<a class="btn solid" href="#kontakt">{heroClassic.ctaLabel} →</a>
					</div>
					<div class="berryWrap">
						<div class="berryFrame">
							<div class="berryStage">
								<div class="berryShadow" aria-hidden="true"></div>
								<img class="berryimg" src={heroImage} alt="Frucht-Fusion" fetchpriority="high" decoding="async" width="470" height="470" />
							</div>
							<div class="annos">
								<div class="anno a1">{heroClassic.annotations[0].title}<small>{heroClassic.annotations[0].sub}</small>
									<svg class="anno-ar" viewBox="0 0 56 56" aria-hidden="true"><path d="M5 8 C 27 10 43 21 48 43" /><path d="M39 39 L49 46 L37 49" /></svg>
								</div>
								<div class="anno a2">{heroClassic.annotations[1].title}<small>{heroClassic.annotations[1].sub}</small>
									<svg class="anno-ar" viewBox="0 0 56 56" aria-hidden="true"><path d="M51 15 C 31 13 15 20 8 37" /><path d="M17 29 L6 38 L19 40" /></svg>
								</div>
								<div class="anno a3">{heroClassic.annotations[2].title}<small>{heroClassic.annotations[2].sub}</small>
									<svg class="anno-ar" viewBox="0 0 56 56" aria-hidden="true"><path d="M6 49 C 22 49 42 43 49 13" /><path d="M41 19 L50 8 L53 22" /></svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	{/if}

	<!-- ═══════ ANGEBOT / PILLARS ═══════ -->
	<section class="afterhero" id="pillars">
		<div class="wrap">
			<div class="sechead reveal">
				<div class="kick">{m.h_pillars_label()}</div>
				<h2 class="serif">{m.h_pillars_title()}</h2>
				<p class="sub">{m.h_pillars_sub()}</p>
			</div>
			{#snippet pillarFront(pillar: PillarsContent['pillars'][number], showArrow: boolean)}
				{#if pillarImage(pillar)}
					<div class="pcard-img"><img src={pillarImage(pillar)} alt={pillar.title} loading="lazy" decoding="async" /></div>
				{/if}
				<h3>{pillar.title}</h3>
				<div class="un"></div>
				<span class="pcard-note">{pillar.note}</span>
				<div class="pcard-desc">{@html renderMarkdown(pillar.desc)}</div>
				<div class="pcard-tags">
					{#each pillar.tags.slice(0, 4) as tag}
						<span class="ptag">{tag}</span>
					{/each}
				</div>
				{#if showArrow}<div class="ar">→</div>{/if}
			{/snippet}
			<div class="pillars reveal-stagger">
				{#each pillars.pillars as pillar, i}
					{@const mode = pillarMode(pillar)}
					{#if mode === 'flip'}
						<div
							class="pcard-flip reveal"
							class:is-flipped={flipped[i]}
							style="--stagger: {i}"
							role="button"
							tabindex="0"
							aria-label="{pillar.title} — Beispiele ansehen"
							onclick={() => toggleFlip(i)}
							onkeydown={(e) => onPillarKey(e, i)}
						>
							<div class="pcard-flip-inner">
								<div class="pcard pcard-face pcard-front">
									{@render pillarFront(pillar, true)}
								</div>
								<div class="pcard pcard-face pcard-back">
									<span class="pcard-back-label">Beispiele</span>
									<div class="pcard-examples">
										{#each validExamples(pillar) as ex}
											{#if ex.url}
												<a class="pcard-ex" href={ex.url} onclick={(e) => e.stopPropagation()}>
													<span class="pcard-ex-label">{ex.label}</span>
													<span class="pcard-ex-desc">{ex.desc}</span>
												</a>
											{:else}
												<div class="pcard-ex">
													<span class="pcard-ex-label">{ex.label}</span>
													<span class="pcard-ex-desc">{ex.desc}</span>
												</div>
											{/if}
										{/each}
									</div>
									<span class="pcard-back-hint">← zurück</span>
								</div>
							</div>
						</div>
					{:else if mode === 'link'}
						<a class="pcard pcard-link reveal" style="--stagger: {i}" href={localizeHref(pillar.subpageUrl ?? '/')}>
							{@render pillarFront(pillar, true)}
						</a>
					{:else}
						<div class="pcard reveal" style="--stagger: {i}">
							{@render pillarFront(pillar, false)}
						</div>
					{/if}
				{/each}
			</div>
			{#snippet logo(client: typeof references.clients[number])}
				{#if client.logoUrl}
					{#if client.websiteUrl}
						<a class="logo-item" href={client.websiteUrl} target="_blank" rel="noopener noreferrer"><img src={client.logoUrl} alt={client.name} loading="lazy" /></a>
					{:else}
						<span class="logo-item"><img src={client.logoUrl} alt={client.name} loading="lazy" /></span>
					{/if}
				{:else}
					<span class="logo-item logo-text">{client.name}</span>
				{/if}
			{/snippet}
			<div class="strip reveal">
				<div class="sl">{m.h_strip()}</div>
				<div class="marquee">
					<div class="marquee-track left">
						{#each [0, 1] as dup}
							<div class="marquee-row" aria-hidden={dup === 1}>
								{#each refRow1 as client}{@render logo(client)}{/each}
							</div>
						{/each}
					</div>
					<div class="marquee-track right">
						{#each [0, 1] as dup}
							<div class="marquee-row" aria-hidden={dup === 1}>
								{#each refRow2 as client}{@render logo(client)}{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════ KENNZAHLEN ═══════ -->
	<section class="metrics">
		<div class="wrap">
			<div class="metrics-grid reveal">
				{#each metrics.items as metric}
					<div class="metric">
						<span class="metric-value serif">{metric.value}</span>
						<span class="metric-label">{metric.label}</span>
						<span class="metric-caption">{metric.caption}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ TENSION (rotes Band) ═══════ -->
	<section class="tension">
		<div class="tensionin reveal">
			<h2 class="serif">{m.h_tension_title()}</h2>
			<div class="rt">
				<p>{m.h_tension_p()}</p>
				<p class="lg">{m.h_tension_lg()}</p>
			</div>
		</div>
	</section>

	<!-- ═══════ ÜBER MICH ═══════ -->
	<section class="sec" id="about">
		<div class="wrap aboutgrid">
			<div class="aboutcol reveal">
				<div class="aboutpf">
					<img src="/foto_brigitte_2025.jpg" alt="Brigitte Hulliger" loading="lazy" decoding="async" />
				</div>
				{#if aboutVideoEmbed}
					<div class="about-video">
						<span class="about-video-label">{about.videoLabel}</span>
						<div class="about-video-wrapper">
							<iframe
								src={aboutVideoEmbed}
								title="CV Brigitte Hulliger"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						</div>
					</div>
				{/if}
			</div>
			<div class="reveal">
				<div class="kick">{m.section_about_label()}</div>
				<h2 class="serif about-h2">{about.title}</h2>
				{#each about.texts as text}
					<p class="about-text">{text}</p>
				{/each}
				<div class="about-quals">
					{#each about.qualifications as qual}
						<span class="qual">{qual}</span>
					{/each}
				</div>
				<div class="ang">
					{#each about.roles as role}
						<div class="acard">
							<h3>{role.title}</h3>
							<p>{role.org}</p>
						</div>
					{/each}
				</div>
				{#if about.socials.length > 0}
					<div class="about-socials">
						{#each about.socials as s}
							<a class="about-social" href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} title={s.platform}>
								{@render socialIcon(s.platform)}
							</a>
						{/each}
					</div>
				{/if}
				<a class="manifest-link" href={localizeHref('/manifest')}>{m.h_about_manifest_cta()} →</a>
			</div>
		</div>
	</section>

	<!-- ═══════ ANGEBOT ═══════ -->
	<section class="sec" id="angebot">
		<div class="wrap">
			<div class="sechead reveal">
				<div class="kick">{m.h_angebot_label()}</div>
				<h2 class="serif">{m.h_angebot_title()}</h2>
				<p class="sub">{m.h_angebot_sub()}</p>
			</div>
			{#snippet angebotInner(item: typeof angebot.items[number])}
				{#if item.image}
					<div class="acard-img"><img src={item.image} alt="" loading="lazy" decoding="async" /></div>
				{/if}
				<div class="acard-body">
					<h3>{item.title}</h3>
					<p>{item.desc}</p>
					{#if item.url}<span class="acard-link">{m.h_angebot_more()} →</span>{/if}
				</div>
			{/snippet}
			<div class="ang angebot-grid reveal-stagger">
				{#each angebot.items as item, ai}
					{#if item.url}
						<a class="acard acard-clickable reveal" class:acard-has-img={item.image} style="--stagger: {ai}" href={item.url}>
							{@render angebotInner(item)}
						</a>
					{:else}
						<div class="acard reveal" class:acard-has-img={item.image} style="--stagger: {ai}">
							{@render angebotInner(item)}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ BÜHNE / AUFTRITTE ═══════ -->
	{#if hasBuehne}
		{#snippet eventCard(a: KeynoteItem)}
			<article class="ev-card">
				<div class="ev-img">
					{#if a.image}<img src={a.image} alt={a.title} loading="lazy" decoding="async" />{/if}
					<div class="ev-datechip">
						<span class="d">{fmtDay(a.date)}</span>
						<span class="mo">{fmtMonthShort(a.date)}</span>
					</div>
				</div>
				<div class="ev-body">
					{#if metaLine(a)}<div class="ev-ev">{metaLine(a)}</div>{/if}
					<h3>{a.title}</h3>
					<div class="ev-meta">
						<span class="ev-meta-i">
							<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
							{fmtRange(a)}
						</span>
						{#if a.location}
							<span class="ev-meta-i">
								<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
								{a.location}
							</span>
						{/if}
					</div>
					{#if a.desc}<div class="ev-desc">{@html renderMarkdownBlock(a.desc)}</div>{/if}
					{#if a.tags.length > 0}
						<div class="ev-tags">
							{#each a.tags.slice(0, 4) as tag}<span class="ptag">{tag}</span>{/each}
						</div>
					{/if}
					{#if a.url}<a class="btn solid ev-cta" href={a.url} target="_blank" rel="noopener noreferrer">{m.h_buehne_cta()} →</a>{/if}
				</div>
			</article>
		{/snippet}
		{#snippet pastInner(a: KeynoteItem, withBlog: boolean)}
			<div class="past-mini">
				<span class="mo">{fmtMonthShort(a.date)}</span>
				<span class="yr">{fmtYear(a.date)}</span>
			</div>
			<div class="past-txt">
				{#if a.event}<div class="past-ev">{a.event}</div>{/if}
				<div class="past-title">{a.title}</div>
				{#if a.location || a.format}<div class="past-loc">{[a.location, a.format].filter((x) => x?.trim()).join(' · ')}</div>{/if}
				{#if withBlog}<span class="past-more">{m.h_buehne_readmore()} →</span>{/if}
			</div>
		{/snippet}
		<section class="sec" id="buehne">
			<div class="wrap">
				<div class="sechead reveal">
					<div class="kick">{m.h_buehne_label()}</div>
					<h2 class="serif">{m.h_buehne_title()}</h2>
					<p class="sub">{m.h_buehne_sub()}</p>
				</div>

				<div class="buehne-group reveal">
					<div class="grouplbl">{m.h_buehne_upcoming()}</div>
					{#if upcoming.length > 0}
						<div class="ev-list">
							{#each upcoming as a}{@render eventCard(a)}{/each}
						</div>
					{:else}
						<div class="ev-empty">
							<p>{m.h_buehne_empty()}</p>
							<a class="ev-empty-cta" href="#kontakt">{m.h_buehne_empty_cta()} →</a>
						</div>
					{/if}
				</div>

				{#if past.length > 0}
					<div class="buehne-group reveal">
						<div class="grouplbl">{m.h_buehne_past()}</div>
						<div class="past-row">
							{#each past as a}
								{#if a.blogSlug}
									<a class="past-card past-card-link" href={localizeHref(`/impulse/${a.blogSlug}`)}>{@render pastInner(a, true)}</a>
								{:else if a.url}
									<a class="past-card past-card-link" href={a.url} target="_blank" rel="noopener noreferrer">{@render pastInner(a, false)}</a>
								{:else}
									<div class="past-card">{@render pastInner(a, false)}</div>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<!-- ═══════ NETZWERK / PARTNER ═══════ -->
	{#if partners.items.length > 0}
		<section class="sec" id="netzwerk">
			<div class="wrap">
				<div class="sechead reveal">
					<div class="kick">{m.h_netzwerk_label()}</div>
					<h2 class="serif">{m.h_netzwerk_title()}</h2>
					<p class="sub">{m.h_netzwerk_sub()}</p>
				</div>
				<div class="partners reveal-stagger">
					{#each partners.items as partner, pi}
						<div class="partner-card reveal" style="--stagger: {pi}">
							<div class="partner-head">
								{#if partner.logo}
									<img class="partner-logo" src={partner.logo} alt={partner.name} loading="lazy" />
								{:else}
									<span class="partner-name">{partner.name}</span>
								{/if}
								{#if partner.website}
									<a class="partner-site" href={partner.website} target="_blank" rel="noopener noreferrer">{m.h_netzwerk_visit()} →</a>
								{/if}
							</div>
							{#if partner.logo}<span class="partner-name partner-name-sub">{partner.name}</span>{/if}
							{#if partner.persons.length > 0}
								<div class="partner-persons">
									{#each partner.persons as person}
										<div class="partner-person">
											{#if person.photo}
												<img class="pp-photo" src={person.photo} alt={person.name} loading="lazy" decoding="async" />
											{/if}
											<div class="pp-text">
												{#if person.linkedin}
													<a class="pp-name pp-name-link" href={person.linkedin} target="_blank" rel="noopener noreferrer">
														{person.name}
														<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
													</a>
												{:else}
													<span class="pp-name">{person.name}</span>
												{/if}
												<span class="pp-role">{person.role}</span>
												{#if person.expertise}<span class="pp-exp">{person.expertise}</span>{/if}
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- ═══════ STIMMEN ═══════ -->
	<section class="sec" id="stimmen">
		<div class="wrap">
			<div class="sechead reveal">
				<div class="kick">{m.h_stimmen_label()}</div>
				<h2 class="serif">{m.h_stimmen_title()}</h2>
				<p class="sub">{m.h_stimmen_sub()}</p>
			</div>
			<div class="quotes reveal-stagger">
				{#each testimonials.items as quote, qi}
					<div class="qt reveal" style="--stagger: {qi}">
						<div class="q">«{@html renderMarkdown(quote.quote)}»</div>
						<div class="qa">
							{#if quote.photo}
								<img class="qa-photo" src={quote.photo} alt={quote.author} loading="lazy" decoding="async" />
							{/if}
							<div class="qa-text">
								{#if quote.linkedin}
									<a class="qa-author qa-author-link" href={quote.linkedin} target="_blank" rel="noopener noreferrer">
										<b>{quote.author}</b>
										<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
									</a>
								{:else}
									<span class="qa-author"><b>{quote.author}</b></span>
								{/if}
								<span class="qa-role">{quote.role}</span>
							</div>
						</div>
						{#if quote.videoUrl}
							<a class="qt-video" href={quote.videoUrl} target="_blank" rel="noopener noreferrer">▶ Video-Statement ansehen</a>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ IMPULSE (rotes Band) ═══════ -->
	<section class="tension" id="impulse">
		<div class="tensionin impulse reveal">
			<div>
				<div class="kick kick-light">{m.h_impulse_label()}</div>
				<h2 class="serif">{m.h_impulse_title()}</h2>
				<p class="lg impulse-body">{m.h_impulse_l1()}<br />{m.h_impulse_l2()}<br />{m.h_impulse_l3()}</p>
			</div>
		</div>
	</section>

	<!-- ═══════ FAQ ═══════ -->
	<section class="sec" id="faq">
		<div class="wrap faq-container">
			<div class="sechead reveal">
				<div class="kick">{m.section_faq_label()}</div>
				<h2 class="serif">{m.section_faq_title()}</h2>
			</div>
			<div class="faq-list reveal">
				{#each faq.items as item, i}
					<details class="faq-item" open={i === 0}>
						<summary class="faq-question">
							<span>{item.question}</span>
							<span class="faq-icon" aria-hidden="true">+</span>
						</summary>
						<p class="faq-answer">{item.answer}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<JsonLd data={jsonLdGraph} />

	<ContactBand />
	<SiteFooter />
</div>

<style>
	/* ═══════ HIMBEERE DESIGN TOKENS (scoped to homepage) ═══════ */
	.hbb {
		--cream: #fbf1ec;
		--cream2: #f7e4df;
		--pink: #f6d9d5;
		--red: #b11e2c;
		--redd: #8e1622;
		--ink: #2b1a1c;
		--dim: #8a6e6f;
		--line: #ebd8d3;
		--serif: 'Fraunces', Georgia, serif;
		--sans: 'Inter', system-ui, sans-serif;
		--hand: 'Shadows Into Light', cursive;

		background: var(--cream);
		color: var(--ink);
		font-family: var(--sans);
		line-height: 1.6;
		overflow-x: hidden;
	}
	.hbb :global(*) {
		box-sizing: border-box;
	}
	.serif {
		font-family: var(--serif);
	}
	.red {
		color: var(--red);
	}
	.wrap {
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 34px;
	}
	.hbb a {
		color: inherit;
		text-decoration: none;
	}
	.kick {
		font-family: var(--sans);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--red);
		margin-bottom: 16px;
	}
	.kick-light {
		color: var(--pink);
	}

	/* ═══════ BUTTONS ═══════ */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: var(--sans);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.04em;
		padding: 14px 26px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		text-transform: uppercase;
	}
	.btn.solid {
		background: var(--red);
		color: #fff;
	}
	.btn.solid:hover {
		background: var(--redd);
	}

	/* ═══════ NAV ═══════ */
	.nav {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: color-mix(in srgb, var(--cream) 90%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--line);
		transition: box-shadow 0.3s ease;
	}
	.nav-scrolled {
		box-shadow: 0 1px 10px rgba(120, 20, 40, 0.06);
	}
	.nav-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 18px 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}
	.brand {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 11px;
	}
	.brand-cube {
		width: 34px;
		height: auto;
		flex-shrink: 0;
	}
	.brand-txt {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
	}
	.brand-m {
		font-family: var(--serif);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.01em;
	}
	.brand-c {
		font-family: var(--sans);
		font-weight: 600;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--red);
		margin-top: 3px;
	}
	.nav-links {
		display: flex;
		gap: 34px;
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.nav-links a {
		color: var(--ink);
		opacity: 0.7;
		transition: opacity 0.2s, color 0.2s;
	}
	.nav-links a:hover,
	.nav-links a.active {
		opacity: 1;
		color: var(--red);
	}

	/* ═══════ HERO ═══════ */
	.hero {
		position: relative;
		overflow: hidden;
		background: radial-gradient(125% 120% at 72% 4%, #c2eafb 0%, #88d3ef 54%, #5bb8e6 115%);
	}
	.heroGrid {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		align-items: center;
		gap: 20px;
		min-height: 560px;
		position: relative;
	}
	.heroText {
		padding: 62px 0 56px;
		z-index: 5;
	}
	.hero-h1 {
		font-family: var(--serif);
		text-transform: uppercase;
		font-weight: 600;
		font-size: clamp(44px, 6vw, 82px);
		line-height: 0.98;
		letter-spacing: 0.005em;
		color: #0e3a4c;
	}
	.hero-ln {
		width: 54px;
		height: 3px;
		background: var(--red);
		margin: 26px 0 22px;
	}
	.hero-sub {
		font-size: clamp(16px, 1.6vw, 19px);
		max-width: 400px;
		color: #103a4a;
	}
	.hero-acc {
		font-family: var(--serif);
		font-style: italic;
		font-size: 20px;
		color: var(--red);
		margin-top: 16px;
	}
	.hero-sig {
		font-family: var(--hand);
		font-size: 30px;
		color: #0e3a4c;
		margin: 22px 0 4px;
	}
	.heroText .btn {
		margin-top: 18px;
	}
	.berryWrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
		z-index: 3;
		padding: 24px 0;
	}
	/* Rahmen exakt in Fruchtgroesse: Annotationen kleben an der Frucht */
	.berryFrame {
		position: relative;
		width: min(50vw, 500px);
	}
	.berryStage {
		position: relative;
		width: 100%;
	}
	.berryimg {
		position: relative;
		z-index: 2;
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 18px 22px rgba(16, 52, 74, 0.24));
	}
	/* Weicher Bodenschatten: erdet die Frucht auf dem Hellblau */
	.berryShadow {
		position: absolute;
		z-index: 1;
		left: 50%;
		bottom: 3%;
		transform: translateX(-50%);
		width: 62%;
		height: 36px;
		border-radius: 50%;
		background: radial-gradient(50% 50% at 50% 50%, rgba(11, 44, 64, 0.46), rgba(11, 44, 64, 0) 72%);
		filter: blur(10px);
		pointer-events: none;
	}
	/* display: contents: Annotationen positionieren sich am .berryFrame */
	.annos {
		display: contents;
	}
	.anno {
		position: absolute;
		z-index: 3;
		font-family: var(--hand);
		color: var(--red);
		font-size: 22px;
		line-height: 1.06;
		text-align: center;
		white-space: nowrap;
		/* bessere Lesbarkeit auf hellem Blau */
		text-shadow: 0 1px 3px rgba(14, 58, 76, 0.22);
	}
	.anno small {
		display: block;
		font-size: 17.5px;
		opacity: 1;
	}
	.anno-ar {
		position: absolute;
		width: 48px;
		height: 48px;
		stroke: var(--red);
		fill: none;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	/* Neugier — oben links (~10 Uhr), Pfeil nach unten-rechts zur Frucht */
	.a1 {
		top: -6%;
		left: -1%;
	}
	.a1 .anno-ar {
		right: -46px;
		top: 22px;
	}
	/* Urteilskraft — rechts (~3 Uhr), Pfeil nach links in die Frucht */
	.a2 {
		top: 20%;
		right: -1%;
		text-align: right;
	}
	.a2 .anno-ar {
		right: 8px;
		top: 34px;
	}
	/* Umsetzungsstärke — unten mittig (~6 Uhr), Pfeil nach oben zur Frucht */
	.a3 {
		bottom: -3%;
		left: 15%;
	}
	.a3 .anno-ar {
		right: -46px;
		top: -40px;
	}

	/* ═══════ SECTIONS ═══════ */
	.afterhero {
		background: var(--cream);
		padding: 64px 0 0;
	}
	section.sec {
		padding: 72px 0;
		border-bottom: 1px solid var(--line);
	}
	.sechead {
		margin-bottom: 40px;
	}
	.sechead h2 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(28px, 3.6vw, 42px);
		line-height: 1.04;
	}
	.sechead .sub {
		color: var(--dim);
		margin-top: 12px;
		font-size: 15px;
		max-width: 600px;
	}

	/* ═══════ PILLARS (Angebot) ═══════ */
	.pillars {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		position: relative;
		z-index: 5;
	}
	.pcard {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 30px 28px;
		box-shadow: 0 20px 44px -34px rgba(120, 20, 40, 0.3);
		display: flex;
		flex-direction: column;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.pcard:not(.pcard-face):hover {
		transform: translateY(-4px);
		box-shadow: 0 28px 50px -30px rgba(120, 20, 40, 0.42);
	}
	.pcard-link {
		text-decoration: none;
		color: inherit;
	}
	/* Flip-Karten */
	.pcard-flip {
		position: relative;
		perspective: 1200px;
		min-height: 400px;
		cursor: pointer;
		outline: none;
		transition: transform 0.2s;
	}
	.pcard-flip:hover {
		transform: translateY(-4px);
	}
	.pcard-flip:focus-visible {
		box-shadow: 0 0 0 3px var(--red);
		border-radius: 12px;
	}
	.pcard-flip-inner {
		position: absolute;
		inset: 0;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		transform-style: preserve-3d;
	}
	.pcard-flip.is-flipped .pcard-flip-inner {
		transform: rotateY(180deg);
	}
	.pcard-face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		overflow: auto;
	}
	.pcard-back {
		transform: rotateY(180deg);
		justify-content: flex-start;
	}
	.pcard-flip:hover .pcard-face {
		box-shadow: 0 28px 50px -30px rgba(120, 20, 40, 0.42);
	}
	.pcard-back-label {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 18px;
		color: var(--red);
		margin-bottom: 12px;
	}
	.pcard-examples {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.pcard-ex {
		display: block;
		padding: 9px 0;
		border-bottom: 1px dashed var(--line);
		text-decoration: none;
		color: inherit;
	}
	.pcard-ex:last-child {
		border-bottom: none;
	}
	.pcard-ex-label {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--redd);
	}
	.pcard-ex-desc {
		display: block;
		font-size: 12.5px;
		color: var(--dim);
		line-height: 1.45;
		margin-top: 2px;
	}
	a.pcard-ex:hover .pcard-ex-label {
		color: var(--red);
	}
	.pcard-back-hint {
		font-family: var(--hand);
		font-size: 16px;
		color: var(--red);
		margin-top: 14px;
	}
	.pcard-img {
		width: calc(100% + 56px);
		height: 150px;
		margin: -30px -28px 18px;
		border-radius: 12px 12px 0 0;
		overflow: hidden;
		/* gleicher hellblauer Verlauf wie im Hero */
		background: radial-gradient(125% 120% at 72% 4%, #c2eafb 0%, #88d3ef 54%, #5bb8e6 115%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pcard-img img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 8px;
	}
	.pcard h3 {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 22px;
		line-height: 1.12;
		margin-bottom: 6px;
	}
	.pcard .un {
		width: 34px;
		height: 2px;
		background: var(--pink);
		margin: 10px 0 14px;
	}
	.pcard-note {
		font-family: var(--hand);
		font-size: 18px;
		color: var(--red);
		display: block;
		margin-bottom: 10px;
	}
	.pcard-desc {
		font-size: 13.5px;
		color: var(--dim);
		line-height: 1.55;
		flex: 1;
	}
	.pcard-desc :global(a) {
		color: var(--red);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.pcard-desc :global(strong) {
		color: var(--ink);
		font-weight: 600;
	}
	.pcard-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 16px;
	}
	.ptag {
		font-size: 11px;
		font-weight: 500;
		padding: 4px 10px;
		border-radius: 4px;
		background: var(--cream2);
		color: var(--redd);
	}
	.pcard .ar {
		margin-top: 16px;
		color: var(--red);
		font-size: 20px;
	}

	/* ═══════ LOGO STRIP ═══════ */
	.strip {
		padding: 54px 0 8px;
		text-align: center;
	}
	.strip .sl {
		font-family: var(--sans);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--dim);
		margin-bottom: 24px;
	}
	.marquee {
		overflow: hidden;
		width: 100%;
		mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
		-webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
	}
	.marquee-track {
		display: flex;
		width: max-content;
	}
	.marquee-track.left {
		animation: marquee-left 42s linear infinite;
	}
	.marquee-track.right {
		animation: marquee-right 42s linear infinite;
		margin-top: 20px;
	}
	.marquee:hover .marquee-track {
		animation-play-state: paused;
	}
	.marquee-row {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 44px;
		padding: 0 22px;
	}
	@keyframes marquee-left {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@keyframes marquee-right {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}
	.logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.logo-item img {
		height: 34px;
		max-width: 128px;
		object-fit: contain;
		filter: grayscale(1);
		opacity: 0.55;
		transition: opacity 0.2s, filter 0.2s;
	}
	.logo-item:hover img {
		opacity: 1;
		filter: grayscale(0);
	}
	.logo-text {
		font-size: 15px;
		font-weight: 500;
		color: var(--dim);
		opacity: 0.6;
		white-space: nowrap;
	}
	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
		.marquee-row:nth-child(2) {
			display: none;
		}
		.marquee-row {
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	/* ═══════ TENSION / IMPULSE (rotes Band) ═══════ */
	.tension {
		background: var(--red);
		color: #fff;
	}
	.tensionin {
		max-width: 1180px;
		margin: 0 auto;
		padding: 60px 34px;
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 40px;
		align-items: center;
	}
	.tensionin.impulse {
		grid-template-columns: 1fr;
	}
	.tension h2 {
		font-family: var(--serif);
		text-transform: uppercase;
		font-weight: 600;
		font-size: clamp(26px, 3.4vw, 40px);
		line-height: 1.05;
	}
	.tension .rt p {
		font-size: 16px;
		line-height: 1.65;
		color: color-mix(in srgb, var(--pink) 55%, #fff);
	}
	.tension .rt .lg {
		font-family: var(--serif);
		font-style: italic;
		font-size: 21px;
		color: #fff;
		margin-top: 14px;
	}
	.impulse h2 {
		margin-bottom: 18px;
	}
	.impulse-body {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(20px, 2.6vw, 30px);
		line-height: 1.25;
		color: #fff;
	}

	/* ═══════ BÜHNE / AUFTRITTE ═══════ */
	/* Ankündigungs-Streifen (direkt unter der Navigation) */
	.astrip {
		display: flex;
		align-items: center;
		gap: 16px;
		background: var(--red);
		color: #fff;
		padding: 11px 34px;
		font-size: 13.5px;
	}
	.astrip .pulse {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #fff;
		flex-shrink: 0;
		animation: astrip-pulse 2s infinite;
	}
	@keyframes astrip-pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.55);
		}
		70% {
			box-shadow: 0 0 0 9px rgba(255, 255, 255, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		}
	}
	.astrip .live {
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 11px;
		font-weight: 700;
		color: var(--pink);
		flex-shrink: 0;
	}
	.astrip-body {
		flex: 1;
		min-width: 0;
	}
	.astrip-body b {
		font-weight: 600;
	}
	.astrip-body .when {
		color: var(--pink);
		white-space: nowrap;
	}
	.astrip-go {
		white-space: nowrap;
		font-weight: 600;
		color: #fff;
		border-bottom: 2px solid rgba(255, 255, 255, 0.5);
		padding-bottom: 1px;
		flex-shrink: 0;
		transition: border-color 0.2s;
	}
	.astrip-go:hover {
		border-color: #fff;
	}
	.astrip-x {
		background: none;
		border: none;
		color: #fff;
		opacity: 0.7;
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
		padding: 0 2px;
		flex-shrink: 0;
		transition: opacity 0.2s;
	}
	.astrip-x:hover {
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.astrip .pulse {
			animation: none;
		}
	}

	/* Gruppen (Als Nächstes / Rückblick) */
	.buehne-group + .buehne-group {
		margin-top: 40px;
	}
	.grouplbl {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-weight: 700;
		color: var(--red);
		margin-bottom: 20px;
	}
	.grouplbl::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--line);
	}

	/* Event-Karten (kommend) */
	.ev-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.ev-card {
		display: grid;
		grid-template-columns: 250px 1fr;
		border: 1px solid var(--line);
		border-radius: 14px;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 22px 46px -36px rgba(120, 20, 40, 0.34);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.ev-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 30px 54px -34px rgba(120, 20, 40, 0.42);
	}
	.ev-img {
		position: relative;
		min-height: 220px;
		background: radial-gradient(125% 120% at 72% 4%, #c2eafb 0%, #88d3ef 54%, #5bb8e6 115%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ev-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.ev-datechip {
		position: absolute;
		top: 14px;
		left: 14px;
		background: #fff;
		border-radius: 10px;
		padding: 8px 13px;
		text-align: center;
		box-shadow: 0 8px 18px -12px rgba(16, 52, 74, 0.5);
	}
	.ev-datechip .d {
		display: block;
		font-family: var(--serif);
		font-weight: 600;
		font-size: 23px;
		line-height: 1;
		color: var(--ink);
	}
	.ev-datechip .mo {
		display: block;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--red);
		font-weight: 700;
		margin-top: 3px;
	}
	.ev-body {
		padding: 26px 30px;
	}
	.ev-ev {
		font-size: 11.5px;
		text-transform: uppercase;
		letter-spacing: 0.13em;
		color: var(--red);
		font-weight: 700;
		margin-bottom: 9px;
	}
	.ev-body h3 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 23px;
		line-height: 1.14;
		margin-bottom: 12px;
	}
	.ev-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		font-size: 13px;
		color: var(--dim);
		margin-bottom: 13px;
	}
	.ev-meta-i {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.ev-meta-i svg {
		color: var(--red);
		flex-shrink: 0;
	}
	.ev-desc {
		font-size: 13.5px;
		color: var(--dim);
		line-height: 1.6;
		margin-bottom: 16px;
	}
	.ev-desc :global(p) {
		margin: 0 0 10px;
	}
	.ev-desc :global(p:last-child) {
		margin-bottom: 0;
	}
	.ev-desc :global(strong) {
		color: var(--ink);
		font-weight: 600;
	}
	.ev-desc :global(em) {
		font-style: italic;
	}
	.ev-desc :global(a) {
		color: var(--red);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.ev-desc :global(ul),
	.ev-desc :global(ol) {
		margin: 8px 0 10px;
		padding-left: 20px;
	}
	.ev-desc :global(li) {
		margin: 3px 0;
	}
	.ev-desc :global(li)::marker {
		color: var(--red);
	}
	.ev-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 20px;
	}
	.ev-cta {
		margin-top: 2px;
	}

	/* Vermerk, wenn kein kommender Auftritt ansteht */
	.ev-empty {
		border: 1px dashed var(--line);
		border-radius: 14px;
		background: color-mix(in srgb, var(--cream) 55%, #fff);
		padding: 28px 30px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}
	.ev-empty p {
		font-size: 14.5px;
		color: var(--dim);
		line-height: 1.6;
		max-width: 62ch;
		margin: 0;
	}
	.ev-empty-cta {
		font-family: var(--hand);
		font-size: 20px;
		color: var(--red);
		transition: color 0.2s, gap 0.2s;
	}
	.ev-empty-cta:hover {
		color: var(--redd);
	}

	/* Rückblick (vergangen) */
	.past-row {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}
	.past-card {
		display: flex;
		gap: 14px;
		align-items: center;
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 16px 18px;
		background: color-mix(in srgb, var(--cream) 55%, #fff);
		color: inherit;
		text-decoration: none;
		transition: border-color 0.2s, transform 0.2s;
	}
	.past-card-link:hover {
		border-color: var(--red);
		transform: translateY(-2px);
	}
	.past-mini {
		width: 54px;
		height: 54px;
		border-radius: 10px;
		flex-shrink: 0;
		background: radial-gradient(125% 120% at 72% 4%, #c2eafb 0%, #88d3ef 54%, #5bb8e6 115%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #0e3a4c;
	}
	.past-mini .mo {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 14px;
		line-height: 1;
	}
	.past-mini .yr {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.04em;
		margin-top: 2px;
	}
	.past-txt {
		min-width: 0;
	}
	.past-ev {
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--red);
		font-weight: 700;
	}
	.past-title {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 15.5px;
		line-height: 1.2;
		margin: 3px 0;
	}
	.past-loc {
		font-size: 12.5px;
		color: var(--dim);
	}
	.past-more {
		display: inline-block;
		margin-top: 6px;
		font-size: 12px;
		font-weight: 600;
		color: var(--red);
	}
	.past-card-link:hover .past-more {
		color: var(--redd);
	}

	@media (max-width: 640px) {
		.ev-card {
			grid-template-columns: 1fr;
		}
		.ev-img {
			min-height: 150px;
		}
		.astrip {
			flex-wrap: wrap;
			padding: 10px 20px;
			gap: 10px;
		}
	}

	/* ═══════ ÜBER MICH ═══════ */
	.aboutgrid {
		display: grid;
		grid-template-columns: 0.82fr 1.18fr;
		gap: 46px;
		align-items: start;
	}
	.aboutcol {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.aboutpf {
		position: relative;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--line);
		box-shadow: 0 26px 54px -30px rgba(120, 20, 40, 0.4);
		max-width: 360px;
	}
	.aboutpf img {
		width: 100%;
		display: block;
		aspect-ratio: 4 / 4.6;
		object-fit: cover;
		object-position: center 12%;
	}
	.about-h2 {
		font-weight: 600;
		font-size: clamp(28px, 3.6vw, 42px);
		line-height: 1.04;
		margin-bottom: 14px;
	}
	.about-text {
		font-size: 15px;
		color: var(--dim);
		line-height: 1.65;
		margin-bottom: 14px;
	}
	.about-quals {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 20px 0 4px;
	}
	.qual {
		font-size: 12px;
		font-weight: 500;
		padding: 6px 14px;
		border-radius: 20px;
		background: var(--cream2);
		color: var(--redd);
		border: 1px solid var(--line);
	}
	.ang {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 18px;
		margin-top: 28px;
	}
	.acard {
		background: var(--cream2);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 26px 28px;
	}
	.acard h3 {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 19px;
		color: var(--red);
		margin-bottom: 8px;
	}
	.acard p {
		font-size: 13.5px;
		color: var(--dim);
		line-height: 1.55;
	}
	.acard-link {
		display: inline-block;
		margin-top: 12px;
		font-size: 13px;
		font-weight: 600;
		color: var(--red);
		transition: color 0.2s;
	}
	.acard-link:hover {
		color: var(--redd);
	}

	/* ═══════ ANGEBOT ═══════ */
	.angebot-grid {
		grid-template-columns: repeat(2, 1fr);
	}
	.acard-clickable {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
	}
	.acard-clickable:hover {
		transform: translateY(-3px);
		border-color: var(--red);
		box-shadow: 0 22px 44px -32px rgba(120, 20, 40, 0.38);
	}
	/* Bild pro Angebot: quadratisch links in der Karte */
	.acard.acard-has-img {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 18px;
	}
	.acard-img {
		flex: 0 0 118px;
		width: 118px;
		height: 118px;
		border-radius: 12px;
		background: radial-gradient(125% 120% at 72% 4%, #c2eafb 0%, #88d3ef 54%, #5bb8e6 115%);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.acard-img img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 9px;
		filter: drop-shadow(0 10px 16px rgba(20, 60, 80, 0.25));
	}
	.acard-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	/* ═══════ MANIFEST-LINK ═══════ */
	.manifest-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 26px;
		font-family: var(--hand);
		font-size: 20px;
		color: var(--red);
		transition: color 0.2s, gap 0.2s;
	}
	.manifest-link:hover {
		color: var(--redd);
		gap: 12px;
	}

	/* ═══════ ABOUT SOCIALS ═══════ */
	.about-socials {
		display: flex;
		gap: 10px;
		margin-top: 24px;
	}
	.about-social {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: #fff;
		color: var(--ink);
		transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
	}
	.about-social:hover {
		background: var(--red);
		border-color: var(--red);
		color: #fff;
		transform: translateY(-2px);
	}

	/* ═══════ KENNZAHLEN ═══════ */
	.metrics {
		background: var(--cream);
		padding: 32px 0 76px;
	}
	/* Haarlinien-Trenner via 1px-Gap auf --line-Hintergrund — sauber & wrap-fest */
	.metrics-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: 16px;
		box-shadow: 0 20px 44px -34px rgba(120, 20, 40, 0.3);
		overflow: hidden;
	}
	.metric {
		/* flex-grow verteilt die Karten über die volle Breite — egal wie viele */
		flex: 1 1 150px;
		background: #fff;
		padding: 34px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.metric-value {
		font-family: var(--serif);
		font-weight: 600;
		font-size: clamp(36px, 4.4vw, 56px);
		line-height: 1;
		color: var(--ink);
	}
	.metric-label {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--red);
		margin-top: 14px;
	}
	.metric-caption {
		font-size: 13.5px;
		color: var(--dim);
		margin-top: 4px;
	}

	/* ═══════ NETZWERK / PARTNER ═══════ */
	.partners {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
	.partner-card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 28px;
		box-shadow: 0 18px 40px -34px rgba(120, 20, 40, 0.26);
		display: flex;
		flex-direction: column;
	}
	.partner-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		margin-bottom: 6px;
	}
	.partner-logo {
		height: 40px;
		max-width: 150px;
		object-fit: contain;
	}
	.partner-name {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 20px;
		color: var(--ink);
	}
	.partner-name-sub {
		font-size: 15px;
		margin-top: 10px;
	}
	.partner-site {
		flex-shrink: 0;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--red);
		transition: color 0.2s;
	}
	.partner-site:hover {
		color: var(--redd);
	}
	.partner-persons {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 18px;
		border-top: 1px solid var(--line);
		padding-top: 16px;
	}
	.partner-person {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}
	.pp-photo {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
		border: 1px solid var(--line);
	}
	.pp-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.pp-name {
		font-weight: 600;
		font-size: 14px;
		color: var(--ink);
	}
	.pp-name-link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: var(--ink);
		text-decoration: none;
		transition: color 0.15s;
	}
	.pp-name-link svg {
		color: #0a66c2;
		flex-shrink: 0;
	}
	.pp-name-link:hover {
		color: var(--red);
	}
	.pp-role {
		font-size: 13px;
		color: var(--red);
	}
	.pp-exp {
		font-size: 13px;
		color: var(--dim);
		margin-top: 2px;
	}

	/* ═══════ STIMMEN ═══════ */
	.quotes {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.qt {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 26px;
		box-shadow: 0 18px 40px -32px rgba(120, 20, 40, 0.28);
	}
	.qt .q {
		font-family: var(--serif);
		font-size: 16px;
		line-height: 1.5;
	}
	/* Hervorhebung via **fett** im Admin → rot */
	.qt .q :global(strong) {
		color: var(--red);
		font-weight: 600;
	}
	.qt .q :global(em) {
		font-style: italic;
	}
	.qt .qa {
		margin-top: 16px;
		display: flex;
		align-items: center;
		gap: 11px;
		font-size: 12px;
		color: var(--dim);
	}
	.qa-photo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
		border: 1px solid var(--line);
	}
	.qa-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.qa-author {
		color: var(--ink);
	}
	.qa-author b {
		color: var(--ink);
		font-weight: 600;
	}
	.qa-author-link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		text-decoration: none;
		transition: color 0.15s;
	}
	.qa-author-link svg {
		color: #0a66c2;
		flex-shrink: 0;
	}
	.qa-author-link:hover b {
		color: var(--red);
	}
	.qa-role {
		color: var(--dim);
		margin-top: 1px;
	}
	.qt-video {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 14px;
		align-self: flex-start;
		font-size: 13px;
		font-weight: 600;
		color: var(--red);
		text-decoration: none;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 6px 14px;
		transition: border-color 0.15s, background 0.15s;
	}
	.qt-video:hover {
		border-color: var(--red);
		background: color-mix(in srgb, var(--red) 5%, transparent);
	}

	/* ═══════ ABOUT VIDEO ═══════ */
	.about-video {
		width: 100%;
		max-width: 360px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.about-video-label {
		font-family: var(--hand);
		font-size: 19px;
		color: var(--red);
	}
	.about-video-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--line);
		box-shadow: 0 20px 44px -34px rgba(120, 20, 40, 0.3);
	}
	.about-video-wrapper iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	/* ═══════ FAQ ═══════ */
	.faq-container {
		max-width: 820px;
	}
	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.faq-item {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 12px;
		transition: border-color 0.18s;
	}
	.faq-item[open] {
		border-color: var(--red);
	}
	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 18px 22px;
		cursor: pointer;
		font-weight: 600;
		font-size: 16px;
		color: var(--ink);
		list-style: none;
	}
	.faq-question::-webkit-details-marker {
		display: none;
	}
	.faq-icon {
		font-size: 22px;
		font-weight: 300;
		color: var(--red);
		transition: transform 0.18s;
		flex-shrink: 0;
	}
	.faq-item[open] .faq-icon {
		transform: rotate(45deg);
	}
	.faq-answer {
		padding: 0 22px 20px;
		margin: 0;
		color: var(--dim);
		line-height: 1.65;
		font-size: 14.5px;
	}

	/* ═══════ RESPONSIVE ═══════ */
	@media (max-width: 980px) {
		.nav-links {
			display: none;
		}
		.heroGrid {
			min-height: 480px;
		}
		.heroText {
			padding: 48px 0 44px;
		}
		.berryFrame {
			width: min(40vw, 360px);
		}
		.pillars,
		.quotes,
		.angebot-grid,
		.partners {
			grid-template-columns: 1fr;
		}
		.ang {
			grid-template-columns: 1fr;
		}
		.aboutgrid {
			grid-template-columns: 1fr;
		}
		.aboutpf {
			max-width: 320px;
		}
		.tensionin {
			grid-template-columns: 1fr;
			gap: 18px;
		}
	}
	@media (max-width: 720px) {
		/* Hero stapelt: Text oben, Frucht mit Callout-Zeile darunter */
		.heroGrid {
			grid-template-columns: 1fr;
			min-height: 0;
			gap: 0;
		}
		.heroText {
			padding: 44px 0 6px;
		}
		.berryWrap {
			padding: 14px 0 6px;
		}
		.berryFrame {
			width: min(76vw, 340px);
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		/* Auf Mobile die Frucht-Callouts ganz ausblenden — zu eng, überlagern das Bild */
		.annos {
			display: none;
		}
	}
	@media (max-width: 560px) {
		.nav-inner {
			padding: 13px 18px;
		}
		.nav-inner .btn.solid {
			display: none;
		}
		.wrap {
			padding: 0 18px;
		}
		section.sec {
			padding: 50px 0;
		}
	}
</style>
