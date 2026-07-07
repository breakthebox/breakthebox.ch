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
		postalCode?: string;
		streetAddress?: string;
	};
	areaServed?: string | string[];
	hasOfferCatalog?: OfferCatalog;
}

export interface OfferCatalog {
	'@type': 'OfferCatalog';
	name: string;
	itemListElement: Array<{
		'@type': 'Offer';
		itemOffered: {
			'@type': 'Service';
			name: string;
			description: string;
			serviceType?: string;
		};
	}>;
}

export interface FAQPage {
	'@type': 'FAQPage';
	'@id': string;
	mainEntity: Array<{
		'@type': 'Question';
		name: string;
		acceptedAnswer: { '@type': 'Answer'; text: string };
	}>;
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

export interface Event {
	'@type': 'Event';
	'@id': string;
	name: string;
	startDate: string;
	endDate?: string;
	eventStatus: string;
	eventAttendanceMode: string;
	description?: string;
	image?: string;
	url?: string;
	location?: {
		'@type': 'Place';
		name: string;
		address: {
			'@type': 'PostalAddress';
			addressLocality: string;
			addressCountry: string;
		};
	};
	performer?: { '@id': string };
	organizer?: { '@type': 'Organization'; name: string };
}

export type SchemaNode = Person | Organization | Article | BreadcrumbList | WebSite | FAQPage | Event;

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
	orgPostalCode?: string;
	orgStreetAddress?: string;
	orgAreaServed?: string | string[];
	orgServices?: Array<{ name: string; description: string; serviceType?: string }>;
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
			...(id.orgLocality ? { addressLocality: id.orgLocality } : {}),
			...(id.orgPostalCode ? { postalCode: id.orgPostalCode } : {}),
			...(id.orgStreetAddress ? { streetAddress: id.orgStreetAddress } : {})
		},
		...(id.orgAreaServed ? { areaServed: id.orgAreaServed } : {}),
		...(id.orgServices && id.orgServices.length
			? {
					hasOfferCatalog: {
						'@type': 'OfferCatalog' as const,
						name: `${id.orgName} — Leistungen`,
						itemListElement: id.orgServices.map((s) => ({
							'@type': 'Offer' as const,
							itemOffered: {
								'@type': 'Service' as const,
								name: s.name,
								description: s.description,
								...(s.serviceType ? { serviceType: s.serviceType } : {})
							}
						}))
					}
				}
			: {})
	};
}

export interface FaqItem {
	question: string;
	answer: string;
}

export function buildFaqPage(pageUrl: string, items: FaqItem[]): FAQPage {
	return {
		'@type': 'FAQPage',
		'@id': `${pageUrl}#faq`,
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer }
		}))
	};
}

export interface EventInput {
	siteUrl: string; // ohne trailing slash — für @id und performer-Referenz
	id: string; // eindeutiges Fragment, z.B. 'keynote-0'
	name: string;
	startDate: string; // ISO 'YYYY-MM-DD'
	endDate?: string;
	description?: string;
	image?: string; // absolute URL
	url?: string; // absolute URL (Programm / Anmeldung)
	location?: string; // Ort / Stadt
	locationCountry?: string; // ISO-Ländercode, Default 'CH'
	organizer?: string; // Veranstaltung / Host
}

export function buildEvent(input: EventInput): Event {
	return {
		'@type': 'Event',
		'@id': `${input.siteUrl}/#${input.id}`,
		name: input.name,
		startDate: input.startDate,
		...(input.endDate ? { endDate: input.endDate } : {}),
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		...(input.description ? { description: input.description } : {}),
		...(input.image ? { image: input.image } : {}),
		...(input.url ? { url: input.url } : {}),
		...(input.location
			? {
					location: {
						'@type': 'Place' as const,
						name: input.location,
						address: {
							'@type': 'PostalAddress' as const,
							addressLocality: input.location,
							addressCountry: input.locationCountry ?? 'CH'
						}
					}
				}
			: {}),
		performer: { '@id': `${input.siteUrl}/#person` },
		...(input.organizer
			? { organizer: { '@type': 'Organization' as const, name: input.organizer } }
			: {})
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
