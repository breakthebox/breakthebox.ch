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
}

export interface PillarsContent {
	pillars: Pillar[];
}

// ─── About ───
export interface AboutRole {
	title: string;
	org: string;
}

export interface AboutContent {
	texts: string[]; // 3 paragraphs
	qualifications: string[];
	roles: AboutRole[];
	videoLabel: string;
}

// ─── Walk the Talk ───
export interface Platform {
	key: string;
	name: string;
	sketch: string;
	desc: string;
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

// ─── Section Union ───
export type SectionKey = 'pillars' | 'about' | 'walkthetalk' | 'references' | 'blog';

export type SectionContent =
	| PillarsContent
	| AboutContent
	| WalkTheTalkContent
	| ReferencesContent
	| BlogContent;
