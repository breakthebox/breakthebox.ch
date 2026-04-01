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

// ─── Section Union ───
export type SectionKey = 'pillars' | 'about' | 'walkthetalk' | 'references' | 'blog';

export type SectionContent =
	| PillarsContent
	| AboutContent
	| WalkTheTalkContent
	| ReferencesContent
	| BlogContent;
