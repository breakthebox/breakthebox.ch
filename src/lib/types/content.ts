// ═══════════════════════════════════════════════════════════
// Content Types — CMS Data Structures
// ═══════════════════════════════════════════════════════════
// JSON shapes stored in site_content.data per section.

// ─── Pillars ───
export interface PillarExample {
	label: string;
	desc: string;
	url?: string;
}

export interface Pillar {
	key: string; // 'strategy' | 'governance' | 'teaching' | 'innovation'
	title: string;
	note: string;
	desc: string;
	image?: string;
	tags: string[];
	examples: PillarExample[];
	subpageUrl?: string; // wenn gesetzt: Pfeil navigiert zur Subseite statt zu flippen
}

export interface PillarsContent {
	pillars: Pillar[];
}

// ─── About ───
export interface AboutRole {
	title: string;
	org: string;
}

export interface SocialLink {
	platform: string; // 'linkedin' | 'instagram' | 'youtube' | 'x' | 'xing' | 'github' | 'website'
	url: string;
}

export interface AboutContent {
	title: string;
	texts: string[]; // 3 paragraphs
	qualifications: string[];
	roles: AboutRole[];
	socials: SocialLink[];
	videoLabel: string;
	videoUrl?: string; // YouTube-Link (watch/youtu.be/shorts/embed) — wird als Embed dargestellt
}

// ─── Kennzahlen / Metrics ───
export interface MetricItem {
	value: string;
	label: string;
	caption: string;
}

export interface MetricsContent {
	items: MetricItem[];
}

// ─── Netzwerk / Partner ───
export interface PartnerPerson {
	name: string;
	role: string;
	expertise: string;
	linkedin?: string;
	photo?: string;
}

export interface Partner {
	key?: string;
	name: string;
	website?: string;
	logo?: string;
	persons: PartnerPerson[];
}

export interface PartnersContent {
	items: Partner[];
}

// ─── Manifest ───
export interface ManifestThesis {
	text: string; // grosse These; **fett** wird rot, Zeilenumbruch = neue Zeile
	note?: string; // Positionierung/Erläuterung; **fett** wird rot
}

export interface ManifestContent {
	kicker: string;
	title: string;
	subtitle: string;
	theses: ManifestThesis[];
	closingKicker: string;
	closingTitle: string;
	closingText: string;
}

// ─── Walk the Talk ───
export interface Platform {
	key: string;
	name: string;
	sketch: string;
	desc: string[]; // mehrere Abschnitte
	url?: string;
	image?: string;
}

export interface WalkTheTalkContent {
	platforms: Platform[];
	missbizzy: {
		title: string;
		sketch: string;
		desc: string;
		image?: string;
		url?: string;
	};
}

// ─── References ───
export interface ReferenceItem {
	id?: string;
	name: string;
	logoUrl?: string | null;
	websiteUrl?: string | null;
	sortOrder: number;
}

export interface ReferencesContent {
	clients: ReferenceItem[];
}

// ─── Angebot ───
export interface AngebotItem {
	key?: string;
	title: string;
	desc: string;
	note?: string; // optionale Handschrift-Zeile unter dem Titel (wie bei den Pillars)
	tags?: string[]; // optionale Themen-Tags (wie bei den Pillars)
	url?: string;
	image?: string; // optionales Bild als Kartenkopf in voller Breite
}

export interface AngebotContent {
	items: AngebotItem[];
}

// ─── Testimonials (Stimmen / Fremdbild) ───
export interface Testimonial {
	quote: string;
	author: string;
	role: string;
	linkedin?: string;
	photo?: string;
	videoUrl?: string; // optionaler Link zu einem Short/Video (z.B. YouTube), damit die Person selbst spricht
}

export interface TestimonialsContent {
	items: Testimonial[];
}

// ─── Experimentierraum ───
export interface ExperimentProject {
	key?: string;
	name: string;
	sketch?: string;
	desc: string;
	status?: string;
	url?: string;
	image?: string;
}

export interface ExperimentsContent {
	platforms: Platform[];
	missbizzy: WalkTheTalkContent['missbizzy'];
	projects: ExperimentProject[];
}

// ─── Experimentierraum (redaktionelle Seite «Werkstatt») ───
export interface ExpRule {
	no: string; // z.B. «Regel 01»
	title: string;
	text: string;
}

export interface ExpExperiment {
	key?: string;
	status: string; // z.B. «Live · Bühne & Web»
	name: string;
	what: string; // kursiver Untertitel
	desc: string;
	stack: string[]; // Tech-Tags
	url?: string;
	urlLabel?: string; // Beschriftung des Besuchs-Links
	lehrgeld: string; // die Lernspalte (Markdown erlaubt)
	image?: string;
}

export interface ExpDiscarded {
	title: string;
	text: string;
}

export interface ExperimentierraumContent {
	hero: {
		kicker: string;
		title: string; // Markdown-Akzent erlaubt
		subline: string;
	};
	rules: ExpRule[];
	bench: {
		kicker: string;
		title: string;
		lead: string;
		items: ExpExperiment[];
	};
	discarded: {
		kicker: string;
		title: string;
		lead: string;
		items: ExpDiscarded[];
	};
	transfer: {
		kicker: string;
		quote: string;
		text: string; // Markdown-Link erlaubt
	};
	softCta: {
		text: string;
		primaryLabel: string;
		primaryHref: string;
		secondaryLabel: string;
		secondaryHref: string;
	};
}

// ─── Referenzprojekte ───
export interface ReferenceProject {
	key?: string;
	title: string;
	subtitle?: string; // kurze Einordnung / Branche / Rolle (Vorderseite)
	description: string; // ausführlicher Text auf der Rückseite der Flip-Karte
	image?: string;
	url?: string;
}

export interface ReferenceProjectsContent {
	items: ReferenceProject[];
}

// ─── Transformation (Subseite) ───
// Redaktionelle Service-Seite: Hero, Spiegel-Situationen, Drei-Stufen-Treppe,
// Wirkung, Beweis/Case-Timeline, MissGovern-Brücke, Abgrenzung, Erstgespräch, FAQ.
// Felder mit **fett**/*kursiv* werden via renderMarkdown im Akzent hervorgehoben.

export interface TransformationHero {
	kicker: string;
	title: string; // **…** wird im Akzent gesetzt
	subline: string;
	ctaPrimary: string; // Label; scrollt zu #stufen
	ctaSecondary: string; // Label; scrollt zu #kontakt
}

export interface TransformationSituation {
	quote: string; // die Frage im Raum
	answer: string; // «Der Einstieg: …» — **fett** im Akzent
}

export interface TransformationMirror {
	kicker: string;
	title: string;
	lead: string;
	situations: TransformationSituation[];
}

export interface TransformationStep {
	no: string; // «01»
	durationTag: string; // kleines Label unter der Nummer, z.B. «Tage»
	title: string;
	question: string; // «Entscheiden wir richtig?»
	description: string;
	tags: string[];
	result: string; // Ergebnis
	duration: string; // Dauer
	exit: string; // Ausgangs-Zeile
}

export interface TransformationSteps {
	kicker: string;
	title: string;
	claim: string; // **…** im Akzent
	items: TransformationStep[];
}

export interface TransformationImpact {
	kicker: string;
	big: string; // *…* kursiv im Akzent
	small: string;
}

export interface TransformationCaseRow {
	month: string;
	text: string; // **fett** hervorgehoben
	tag?: string; // z.B. «Stufe 1»
}

export interface TransformationMissgovern {
	title: string;
	text: string;
	cta: string;
	url: string;
}

export interface TransformationProof {
	kicker: string;
	title: string;
	lead: string;
	caseLabel: string; // z.B. «Schweizer Unternehmensgruppe · Industrie»
	caseRows: TransformationCaseRow[];
	missgovern: TransformationMissgovern;
}

export interface TransformationBoundaryItem {
	title: string;
	desc: string;
}

export interface TransformationBoundaries {
	kicker: string;
	title: string;
	lead: string;
	items: TransformationBoundaryItem[];
}

export interface TransformationContactBox {
	title: string; // überschreibt den Titel der geteilten ContactBand
	text: string; // überschreibt den Text der ContactBand
	mgLine: string; // personalisierter Text, nur bei UTM-Ankunft (ContactBand-Text)
}

export interface TransformationContact {
	kicker: string;
	title: string;
	lead: string;
	steps: string[]; // die drei «30-Minuten»-Schritte
	box: TransformationContactBox;
}

export interface TransformationBanner {
	utmSource: string; // utm_source-Wert, der den Banner auslöst (z.B. «missgovern»)
	text: string; // **fett** im Akzent
	ctaLabel: string; // Link-Label im Banner
	ctaHref: string; // Ziel (z.B. #kontakt)
}

export interface TransformationContent {
	hero: TransformationHero;
	mirror: TransformationMirror;
	steps: TransformationSteps;
	impact: TransformationImpact;
	proof: TransformationProof;
	boundaries: TransformationBoundaries;
	contact: TransformationContact;
	faq: FaqContent;
	banner: TransformationBanner;
}

// ─── Verwaltungsrat (Subseite) ───
// Öffentliches VR-Dossier statt Verkaufstrichter. Felder mit **fett**/*kursiv*
// werden via renderMarkdown im Akzent hervorgehoben.

export interface GovernanceHero {
	kicker: string;
	title: string; // **…** im Akzent
	subline: string; // **fett** hervorgehoben (z.B. OR 716a)
	ctaPrimary: string; // Label; scrollt zum Dossier-CTA (#dossier)
	ctaSecondary: string; // Label; scrollt zum Kontakt (#kontakt)
}

export interface GovernanceChair {
	kicker: string;
	big: string; // *…* kursiv im Akzent
	small: string;
}

export interface GovernanceContribution {
	title: string;
	text: string;
	exampleLabel: string; // z.B. «Im Alltag» / «Der Beweis»
	example: string;
	url?: string; // optionaler Link (dann wird «example» zum Link)
}

export interface GovernanceContributions {
	kicker: string;
	title: string;
	lead: string;
	items: GovernanceContribution[];
}

export interface GovernanceMatrixRow {
	label: string;
	level: number; // Abdeckung 0–3 (Pips)
	highlight?: boolean; // die hervorgehobene Zeile («die oft fehlt»)
	note?: string; // Zusatz, nur bei highlight sichtbar
}

export interface GovernanceFact {
	label: string;
	value: string;
}

export interface GovernanceMatrix {
	kicker: string;
	title: string;
	lead: string;
	rows: GovernanceMatrixRow[];
	facts: GovernanceFact[];
	note: string;
}

export interface GovernanceMandate {
	org: string;
	role: string;
	president?: boolean; // VRP-Hervorhebung
	desc: string;
	logo?: string; // optionales Logo der Organisation (Bild-URL)
	website?: string; // optionaler Link zur Website der Organisation
}

export interface GovernanceMandates {
	kicker: string;
	title: string;
	lead: string;
	items: GovernanceMandate[];
	principleTitle: string; // **…** im Akzent
	principleText: string;
}

export interface GovernanceStance {
	kicker: string;
	quote: string;
	citeText: string; // z.B. «Aus meinem Manifest —»
	citeLinkLabel: string; // Link-Label
	citeUrl: string; // Ziel (z.B. /manifest)
}

export interface GovernanceCtaCard {
	title: string;
	text: string;
	ctaLabel: string;
	ctaHref: string; // mailto: oder Anker
}

// Dunkle Karte: der Button verlinkt auf das Dossier-PDF (im Backend ersetzbar).
export interface GovernanceCtaDarkCard {
	title: string;
	text: string;
	ctaLabel: string;
	dossierUrl: string; // Link zum Dossier-PDF
	email: string;
	phone: string;
}

export interface GovernanceCta {
	dark: GovernanceCtaDarkCard;
	light: GovernanceCtaCard;
}

export interface GovernanceContent {
	hero: GovernanceHero;
	chair: GovernanceChair;
	contributions: GovernanceContributions;
	matrix: GovernanceMatrix;
	mandates: GovernanceMandates;
	stance: GovernanceStance;
	cta: GovernanceCta;
	faq: FaqContent;
}

// ─── Keynotes / Bühne (Keynotes, Panels, Workshops) ───
export interface KeynoteItem {
	key?: string;
	title: string;
	desc: string;
	date: string; // ISO-Datum 'YYYY-MM-DD' (Start) — steuert kommend/vergangen automatisch
	endDate?: string; // optionales Enddatum für mehrtägige Anlässe
	location: string; // Ort / Venue + Stadt
	event?: string; // Veranstaltung / Host (z.B. «Dänksymposium»)
	format?: string; // Keynote / Panel / Workshop
	url?: string; // Programm / Anmeldung
	image?: string;
	tags: string[];
	featured?: boolean;
	blogSlug?: string; // optionaler Rückblick-Link auf einen Blogbeitrag (Slug)
}

export interface KeynotesContent {
	items: KeynoteItem[];
}

// ─── Keynotes-Seite (redaktioneller Inhalt der Subseite /keynotes) ───
// Die Termine (kommend/vergangen) kommen weiterhin aus KeynotesContent.
// Felder mit **fett**/*kursiv* werden via renderMarkdown im Akzent gesetzt.

export interface KeynotesHero {
	kicker: string;
	title: string; // **…** im Akzent
	subline: string;
	ctaPrimary: string; // scrollt zu #talks
	ctaSecondary: string; // scrollt zu #kontakt
}

export interface KeynotesTalk {
	kicker: string; // z.B. «Die Simulation · Premiere Dänksymposium 2026»
	title: string;
	desc: string;
	takeawaysLabel: string; // z.B. «Was bleibt hängen»
	takeaways: string[];
	meta: string[]; // z.B. «Keynote 30–60'», «GL · VR · Fachpublikum»
	linkLabel: string;
	linkUrl: string;
	image?: string; // optionales Bild als Kartenkopf (Hintergrund mit Overlay)
}

export interface KeynotesSignature {
	kicker: string;
	title: string;
	lead: string;
	items: KeynotesTalk[];
}

export interface KeynotesUsp {
	kicker: string;
	big: string; // *…* kursiv im Akzent
	small: string;
	demo: string; // Callout «So sieht der Moment aus …»
}

export interface KeynotesFormat {
	label: string; // z.B. «30–60 Minuten»
	title: string;
	desc: string;
}

export interface KeynotesFormats {
	kicker: string;
	title: string;
	lead: string;
	items: KeynotesFormat[];
}

export interface KeynotesLehreItem {
	role: string; // z.B. «Studiengangsleitung»
	title: string; // z.B. «CAS Projektmanagement»
	org: string; // z.B. «Berner Fachhochschule»
	note?: string; // optionaler Zusatz, z.B. «ehemals» oder «ab 2027»
	url?: string; // optionaler Link zum Lehrgang (Anmeldung / Info)
}

export interface KeynotesLehre {
	kicker: string;
	title: string;
	text: string;
	quote: string;
	items: KeynotesLehreItem[];
}

export interface KeynotesAuftritte {
	kicker: string;
	title: string;
	lead: string; // Kopf; die Termine selbst kommen aus KeynotesContent
}

export interface KeynotesCtaDark {
	title: string;
	text: string;
	ctaLabel: string;
	speakerKitUrl: string; // Speaker-Kit-PDF; leer → E-Mail-Fallback
	mailtoHref: string; // Fallback (mailto:…)
}

export interface KeynotesCtaLight {
	title: string;
	text: string;
	ctaLabel: string;
	ctaHref: string;
}

export interface KeynotesPostCard {
	title: string;
	desc: string;
	url: string;
}

export interface KeynotesPostEvent {
	kicker: string;
	title: string;
	cards: KeynotesPostCard[];
}

export interface KeynotesPageContent {
	hero: KeynotesHero;
	signature: KeynotesSignature;
	usp: KeynotesUsp;
	formats: KeynotesFormats;
	lehre: KeynotesLehre;
	auftritte: KeynotesAuftritte;
	cta: { dark: KeynotesCtaDark; light: KeynotesCtaLight };
	postEvent: KeynotesPostEvent;
	faq: FaqContent;
}

// ─── FAQ ───
export interface FaqItem {
	question: string;
	answer: string;
}

export interface FaqContent {
	items: FaqItem[];
}

// ─── Blog ───
export interface BlogPost {
	key: string;
	tag: string;
	title: string;
	excerpt: string;
	url?: string;
}

export interface BlogContent {
	posts: BlogPost[];
}

// ─── Block Editor Types ───
export type EditorBlockType =
	| 'paragraph'
	| 'header'
	| 'image'
	| 'quote'
	| 'list'
	| 'code'
	| 'delimiter'
	| 'linkButton';

export interface ParagraphBlockData {
	text: string;
}

export interface HeaderBlockData {
	text: string;
	level: 2 | 3 | 4;
}

export interface ImageBlockData {
	file: { url: string };
	caption?: string;
	withBorder?: boolean;
	stretched?: boolean;
	withBackground?: boolean;
}

export interface QuoteBlockData {
	text: string;
	caption?: string;
	alignment?: 'left' | 'center';
}

export interface ListBlockData {
	style: 'ordered' | 'unordered';
	items: string[];
}

export interface CodeBlockData {
	code: string;
}

export interface DelimiterBlockData {
	// no data
}

export interface LinkButtonBlockData {
	text: string;
	url: string;
	style?: 'link' | 'button';
}

export interface EditorBlock {
	id: string;
	type: EditorBlockType;
	data:
		| ParagraphBlockData
		| HeaderBlockData
		| ImageBlockData
		| QuoteBlockData
		| ListBlockData
		| CodeBlockData
		| DelimiterBlockData
		| LinkButtonBlockData;
}

export interface BlogContentBlocks {
	time: number;
	blocks: EditorBlock[];
	version: string;
}

// ─── AI Response Types ───
export interface SeoSuggestion {
	type: 'title' | 'content' | 'meta' | 'structure' | 'keywords';
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface SeoScoreResult {
	score: number;
	suggestions: SeoSuggestion[];
}

export interface SeoOptimizationResult {
	optimizedText: string;
	changes: string[];
}

// ─── Sektionen der Landing (Reihenfolge, Sichtbarkeit, Kopftexte) ───
export interface SectionSetting {
	key: string; // fester Sektions-Key der Landing (z.B. 'angebot', 'faq')
	visible: boolean;
	kicker: string; // '' = Standardtext
	title: string; // '' = Standardtext
	subtitle: string; // '' = Standardtext
}

export interface SectionsContent {
	sections: SectionSetting[];
}

// ─── Hero ───
/** Handschrift-Notiz am Frucht-Bild (klassischer Hero). */
export interface HeroAnnotation {
	title: string;
	sub: string;
}

/** Klassischer Hero: Headline, Subline, Signatur + drei Notizen am Bild. */
export interface HeroClassic {
	titleLine1: string; // «Gibt es»
	titleLine2Pre: string; // «nur »
	titleLine2Em: string; // «selten» (Akzentfarbe)
	sub: string;
	accent: string; // kursive Zeile («Eine Mischung, die trägt.»)
	signature: string; // Handschrift-Signatur
	ctaLabel: string;
	annotations: HeroAnnotation[]; // genau 3 Positionen am Bild
}

/** Eine der zwei Welten im Slider-Hero. */
export interface HeroWorld {
	kicker: string; // «Im Gremium»
	title: string;
	text: string;
	image?: string; // leer = Standard-Verlauf
}

/** Slider-Hero: asymmetrischer Kopf (Headline links, Tagline+CTA rechts) + Zwei-Welten-Panel in voller Breite. */
export interface HeroSlider {
	titleLine1: string; // «KI ist überall.»
	titleAccent: string; // Akzentzeile («Urteilskraft ist selten.»)
	sub: string; // Tagline / Positionierungszeile (rechte Spalte)
	left: HeroWorld; // dunkle Welt
	right: HeroWorld; // Akzent-Welt
	caption: string; // «Beide Welten.»
	captionAccent: string; // «Dieselbe Person.»
	hint: string; // «zum Entdecken ziehen»
}

/** Ein benannter Hero (Variante + Inhalte). Themes referenzieren Presets per id. */
export interface HeroPreset {
	id: string;
	name: string;
	variant: 'classic' | 'slider';
	classic: HeroClassic;
	slider: HeroSlider;
}

export interface HeroContent {
	presets: HeroPreset[];
}

// ─── Theme ───
export interface ThemeColors {
	primary: string; // Hauptfarbe — Buttons, Links, Akzente
	primaryDark: string; // Hover / dunkle Variante
	ink: string; // Überschriften & Fliesstext
	cream: string; // Seitenhintergrund
	soft?: string; // Helle Akzentfläche — Badges, Tags, Banner (leer = aus Primär abgeleitet)
	header?: string; // Navbar-Hintergrund (leer = Seitenhintergrund); Textfarben werden nach Kontrast abgeleitet
}

/** Ein hochgeladenes Bild in der gemeinsamen Bibliothek. */
export interface ThemeImageAsset {
	id: string;
	url: string;
	name: string;
}

/** Mediathek: gemeinsame Bild-Bibliothek (eigener Admin-Bereich). */
export interface MediaContent {
	library: ThemeImageAsset[];
}

/** Gewählte Schriften (Keys aus der Font-Registry in $lib/config/fonts). */
export interface ThemeFontSelection {
	heading: string;
	body: string;
	hand: string;
}

export interface Theme {
	id: string;
	name: string;
	colors: ThemeColors;
	fonts?: ThemeFontSelection; // fehlt = Standard-Fonts (Fraunces/Inter/Shadows)
	heroImage?: string; // URL aus der Bibliothek; leer = Standard-Hero
	heroPresetId?: string; // Hero-Preset für dieses Theme; leer = erstes Preset
	pillarImages?: Record<string, string>; // pillarKey → Bild-URL
}

export interface ThemeContent {
	activeId: string;
	library?: ThemeImageAsset[]; // Legacy — die Bibliothek lebt heute in der Mediathek ('media')
	themes: Theme[];
}

// ─── Section Union ───
export type SectionKey =
	| 'pillars'
	| 'about'
	| 'walkthetalk'
	| 'references'
	| 'blog'
	| 'angebot'
	| 'testimonials'
	| 'experiments'
	| 'experimentierraum'
	| 'metrics'
	| 'partners'
	| 'manifest'
	| 'referenzprojekte'
	| 'transformation'
	| 'governance'
	| 'keynotes'
	| 'keynotespage'
	| 'faq'
	| 'hero'
	| 'sections'
	| 'media'
	| 'theme';

export type SectionContent =
	| PillarsContent
	| AboutContent
	| WalkTheTalkContent
	| ReferencesContent
	| BlogContent
	| AngebotContent
	| TestimonialsContent
	| ExperimentsContent
	| ExperimentierraumContent
	| MetricsContent
	| PartnersContent
	| ManifestContent
	| ReferenceProjectsContent
	| TransformationContent
	| GovernanceContent
	| KeynotesContent
	| KeynotesPageContent
	| FaqContent
	| HeroContent
	| SectionsContent
	| MediaContent
	| ThemeContent;
