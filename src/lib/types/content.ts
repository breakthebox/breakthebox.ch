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
	url?: string;
	image?: string; // optionales Bild (transparent), quadratisch links in der Karte auf blauem Verlauf
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
}

/** Ein hochgeladenes Bild in der gemeinsamen Bibliothek. */
export interface ThemeImageAsset {
	id: string;
	url: string;
	name: string;
}

export interface Theme {
	id: string;
	name: string;
	colors: ThemeColors;
	heroImage?: string; // URL aus der Bibliothek; leer = Standard-Hero
	heroPresetId?: string; // Hero-Preset für dieses Theme; leer = erstes Preset
	pillarImages?: Record<string, string>; // pillarKey → Bild-URL
}

export interface ThemeContent {
	activeId: string;
	library: ThemeImageAsset[]; // gemeinsamer Pool hochgeladener Bilder
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
	| 'metrics'
	| 'partners'
	| 'manifest'
	| 'referenzprojekte'
	| 'keynotes'
	| 'faq'
	| 'hero'
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
	| MetricsContent
	| PartnersContent
	| ManifestContent
	| ReferenceProjectsContent
	| KeynotesContent
	| FaqContent
	| HeroContent
	| ThemeContent;
