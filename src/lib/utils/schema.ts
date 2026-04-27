// ═══════════════════════════════════════════════════════════
// Schema.org JSON-LD Builders
// ═══════════════════════════════════════════════════════════
// Typsichere Konstruktoren für strukturierte Daten.
// E-E-A-T-Signale für GEO (Generative Engine Optimization):
// LLMs zitieren bevorzugt Quellen mit Person + Organization Schema.

export interface Person {
	'@type': 'Person';
	'@id': string;
	name: string;
	url: string;
	image?: string;
	jobTitle?: string;
	description?: string;
	knowsAbout?: string[];
	sameAs?: string[];
	worksFor?: { '@id': string };
}

export interface Organization {
	'@type': 'Organization';
	'@id': string;
	name: string;
	url: string;
	logo?: string;
	founder?: { '@id': string };
	sameAs?: string[];
	address?: {
		'@type': 'PostalAddress';
		addressCountry: string;
		addressLocality?: string;
	};
}

export interface Article {
	'@type': 'Article' | 'BlogPosting';
	'@id': string;
	headline: string;
	description?: string;
	image?: string | string[];
	datePublished: string;
	dateModified?: string;
	author: { '@id': string };
	publisher: { '@id': string };
	mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
	keywords?: string[];
	articleSection?: string;
	inLanguage?: string;
}

export interface BreadcrumbList {
	'@type': 'BreadcrumbList';
	itemListElement: Array<{
		'@type': 'ListItem';
		position: number;
		name: string;
		item?: string;
	}>;
}

export interface WebSite {
	'@type': 'WebSite';
	'@id': string;
	url: string;
	name: string;
	inLanguage?: string;
	publisher?: { '@id': string };
}

export type SchemaNode = Person | Organization | Article | BreadcrumbList | WebSite;

export interface SchemaGraph {
	'@context': 'https://schema.org';
	'@graph': SchemaNode[];
}

export function buildGraph(nodes: SchemaNode[]): SchemaGraph {
	return {
		'@context': 'https://schema.org',
		'@graph': nodes
	};
}

// ─── Site-spezifische Builder ───

export interface SiteIdentity {
	siteUrl: string; // ohne trailing slash
	personName: string;
	personJobTitle: string;
	personDescription: string;
	personImage?: string;
	personSameAs: string[];
	personKnowsAbout: string[];
	orgName: string;
	orgLogo: string;
	orgSameAs: string[];
	orgCountry: string;
	orgLocality?: string;
}

export function buildPerson(id: SiteIdentity): Person {
	return {
		'@type': 'Person',
		'@id': `${id.siteUrl}/#person`,
		name: id.personName,
		url: id.siteUrl,
		image: id.personImage,
		jobTitle: id.personJobTitle,
		description: id.personDescription,
		knowsAbout: id.personKnowsAbout,
		sameAs: id.personSameAs,
		worksFor: { '@id': `${id.siteUrl}/#organization` }
	};
}

export function buildOrganization(id: SiteIdentity): Organization {
	return {
		'@type': 'Organization',
		'@id': `${id.siteUrl}/#organization`,
		name: id.orgName,
		url: id.siteUrl,
		logo: id.orgLogo,
		founder: { '@id': `${id.siteUrl}/#person` },
		sameAs: id.orgSameAs,
		address: {
			'@type': 'PostalAddress',
			addressCountry: id.orgCountry,
			...(id.orgLocality ? { addressLocality: id.orgLocality } : {})
		}
	};
}

export function buildWebSite(id: SiteIdentity, inLanguage = 'de-CH'): WebSite {
	return {
		'@type': 'WebSite',
		'@id': `${id.siteUrl}/#website`,
		url: id.siteUrl,
		name: id.orgName,
		inLanguage,
		publisher: { '@id': `${id.siteUrl}/#organization` }
	};
}

export interface BlogArticleInput {
	siteUrl: string;
	pageUrl: string;
	title: string;
	description?: string;
	image?: string;
	datePublished: string | Date;
	dateModified?: string | Date | null;
	tags?: string[];
	inLanguage?: string;
}

export function buildArticle(input: BlogArticleInput): Article {
	const toIso = (d: string | Date) => (typeof d === 'string' ? d : d.toISOString());
	return {
		'@type': 'BlogPosting',
		'@id': `${input.pageUrl}#article`,
		headline: input.title,
		description: input.description,
		image: input.image,
		datePublished: toIso(input.datePublished),
		dateModified: input.dateModified ? toIso(input.dateModified) : undefined,
		author: { '@id': `${input.siteUrl}/#person` },
		publisher: { '@id': `${input.siteUrl}/#organization` },
		mainEntityOfPage: { '@type': 'WebPage', '@id': input.pageUrl },
		keywords: input.tags,
		inLanguage: input.inLanguage ?? 'de-CH'
	};
}

export function buildBreadcrumb(
	items: Array<{ name: string; url?: string }>
): BreadcrumbList {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			...(item.url ? { item: item.url } : {})
		}))
	};
}
