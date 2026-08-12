// ═══════════════════════════════════════════════════════════
// Schema.org JSON-LD Builders
// ═══════════════════════════════════════════════════════════
// Typsichere Konstruktoren für strukturierte Daten.
// E-E-A-T-Signale für GEO (Generative Engine Optimization):
// LLMs zitieren bevorzugt Quellen mit Person + Organization Schema.

export interface EducationalOccupationalCredential {
	'@type': 'EducationalOccupationalCredential';
	name: string;
	credentialCategory?: string;
	educationalLevel?: string;
	dateCreated?: string;
	recognizedBy?: { '@id': string };
}

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
	worksFor?: Array<{ '@id': string }>;
	memberOf?: Array<{ '@id': string }>;
	alumniOf?: Array<{ '@id': string }>;
	hasCredential?: EducationalOccupationalCredential[];
}

export interface Organization {
	// ProfessionalService ist eine Unterklasse von LocalBusiness und damit von
	// Organization — sie erlaubt Geokoordinaten und lokale Signale.
	'@type': 'Organization' | 'ProfessionalService';
	'@id': string;
	name: string;
	url: string;
	logo?: string;
	image?: string;
	founder?: { '@id': string };
	sameAs?: string[];
	telephone?: string;
	email?: string;
	address?: {
		'@type': 'PostalAddress';
		addressCountry: string;
		addressLocality?: string;
		postalCode?: string;
		streetAddress?: string;
		addressRegion?: string;
	};
	geo?: {
		'@type': 'GeoCoordinates';
		latitude: number;
		longitude: number;
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

export interface Review {
	'@type': 'Review';
	'@id': string;
	itemReviewed: { '@id': string };
	author: { '@type': 'Person'; name: string; jobTitle?: string };
	reviewBody: string;
}

export interface ItemList {
	'@type': 'ItemList';
	'@id': string;
	name: string;
	numberOfItems: number;
	itemListElement: Array<{
		'@type': 'ListItem';
		position: number;
		item: SchemaNode;
	}>;
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

export type SchemaNode =
	| Person
	| Organization
	| Article
	| BreadcrumbList
	| WebSite
	| FAQPage
	| Event
	| Review
	| ItemList;

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

/**
 * Organisation, mit der die Person verbunden ist (Hochschule, Mandat, Firma).
 * Wird als eigener Organization-Knoten in den Graph geschrieben, damit
 * alumniOf/memberOf/worksFor per @id auf eine Entität zeigen statt auf einen String.
 */
export interface Affiliation {
	/** Fragment für die @id, z.B. 'bfh' → https://.../#bfh */
	id: string;
	name: string;
	url: string;
	alumniOf?: boolean;
	memberOf?: boolean;
	worksFor?: boolean;
}

export interface CredentialInput {
	name: string;
	/** schema.org credentialCategory, z.B. 'degree' oder 'certification' */
	credentialCategory?: string;
	/** z.B. 'Master', 'Bachelor' */
	educationalLevel?: string;
	/** Abschlussjahr */
	year?: string;
	/** Fragment einer Affiliation, die den Abschluss verliehen hat */
	issuerId?: string;
}

export interface SiteIdentity {
	siteUrl: string; // ohne trailing slash
	personName: string;
	personJobTitle: string;
	personDescription: string;
	personImage?: string;
	personSameAs: string[];
	personKnowsAbout: string[];
	personAffiliations?: Affiliation[];
	personCredentials?: CredentialInput[];
	orgName: string;
	orgLogo: string;
	orgSameAs: string[];
	orgCountry: string;
	orgLocality?: string;
	orgRegion?: string;
	orgPostalCode?: string;
	orgStreetAddress?: string;
	orgLatitude?: number;
	orgLongitude?: number;
	orgTelephone?: string;
	orgEmail?: string;
	orgAreaServed?: string | string[];
	orgServices?: Array<{ name: string; description: string; serviceType?: string }>;
}

export function buildPerson(id: SiteIdentity): Person {
	const affiliations = id.personAffiliations ?? [];
	const ownOrg = { '@id': `${id.siteUrl}/#organization` };
	const ref = (a: Affiliation) => ({ '@id': `${id.siteUrl}/#${a.id}` });
	const refsWhere = (pick: (a: Affiliation) => boolean | undefined) =>
		affiliations.filter(pick).map(ref);

	const alumniOf = refsWhere((a) => a.alumniOf);
	const memberOf = refsWhere((a) => a.memberOf);
	const credentials = (id.personCredentials ?? []).map(
		(c): EducationalOccupationalCredential => ({
			'@type': 'EducationalOccupationalCredential',
			name: c.name,
			...(c.credentialCategory ? { credentialCategory: c.credentialCategory } : {}),
			...(c.educationalLevel ? { educationalLevel: c.educationalLevel } : {}),
			...(c.year ? { dateCreated: c.year } : {}),
			...(c.issuerId ? { recognizedBy: { '@id': `${id.siteUrl}/#${c.issuerId}` } } : {})
		})
	);

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
		// Eigene Firma ist immer dabei; externe Mandate kommen aus den Affiliations.
		worksFor: [ownOrg, ...refsWhere((a) => a.worksFor)],
		...(memberOf.length ? { memberOf: [ownOrg, ...memberOf] } : {}),
		...(alumniOf.length ? { alumniOf } : {}),
		...(credentials.length ? { hasCredential: credentials } : {})
	};
}

/**
 * Organization-Knoten für alle Affiliations — Ziel der @id-Referenzen aus buildPerson.
 */
export function buildAffiliations(id: SiteIdentity): Organization[] {
	return (id.personAffiliations ?? []).map((a) => ({
		'@type': 'Organization',
		'@id': `${id.siteUrl}/#${a.id}`,
		name: a.name,
		url: a.url,
		sameAs: [a.url]
	}));
}

export function buildOrganization(id: SiteIdentity): Organization {
	return {
		'@type': 'ProfessionalService',
		'@id': `${id.siteUrl}/#organization`,
		name: id.orgName,
		url: id.siteUrl,
		logo: id.orgLogo,
		image: id.orgLogo,
		founder: { '@id': `${id.siteUrl}/#person` },
		sameAs: id.orgSameAs,
		...(id.orgTelephone ? { telephone: id.orgTelephone } : {}),
		...(id.orgEmail ? { email: id.orgEmail } : {}),
		address: {
			'@type': 'PostalAddress',
			addressCountry: id.orgCountry,
			...(id.orgLocality ? { addressLocality: id.orgLocality } : {}),
			...(id.orgRegion ? { addressRegion: id.orgRegion } : {}),
			...(id.orgPostalCode ? { postalCode: id.orgPostalCode } : {}),
			...(id.orgStreetAddress ? { streetAddress: id.orgStreetAddress } : {})
		},
		...(id.orgLatitude != null && id.orgLongitude != null
			? {
					geo: {
						'@type': 'GeoCoordinates' as const,
						latitude: id.orgLatitude,
						longitude: id.orgLongitude
					}
				}
			: {}),
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

export interface ReviewInput {
	quote: string;
	author: string;
	role?: string;
}

/**
 * Stimmen als Review-Knoten. Bewusst ohne `reviewRating` — es gibt keine
 * Sternebewertungen, und erfundene wären falsch. Google zeigt Reviews auf der
 * eigenen Website ohnehin nicht als Rich Result; der Wert liegt in der
 * Entitätsbeschreibung für LLMs.
 */
export function buildReviews(siteUrl: string, items: ReviewInput[]): Review[] {
	// Die Zitate sind im CMS mit **fett**/*kursiv* ausgezeichnet — in
	// strukturierten Daten gehört Klartext.
	const stripEmphasis = (text: string) => text.replace(/\*\*|__|(?<!\w)[*_](?!\w)/g, '').trim();

	return items
		.filter((item) => item.quote?.trim() && item.author?.trim())
		.map((item, i) => ({
			'@type': 'Review' as const,
			'@id': `${siteUrl}/#review-${i}`,
			itemReviewed: { '@id': `${siteUrl}/#organization` },
			author: {
				'@type': 'Person' as const,
				name: item.author,
				...(item.role?.trim() ? { jobTitle: item.role } : {})
			},
			reviewBody: stripEmphasis(item.quote)
		}));
}

/** Geordnete Liste gleichartiger Knoten — z.B. alle Auftritte auf /keynotes. */
export function buildItemList(id: string, name: string, items: SchemaNode[]): ItemList {
	return {
		'@type': 'ItemList',
		'@id': id,
		name,
		numberOfItems: items.length,
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem' as const,
			position: i + 1,
			item
		}))
	};
}

/** Zweistufiger Breadcrumb Startseite → Unterseite. */
export function buildPageBreadcrumb(siteUrl: string, name: string, path: string): BreadcrumbList {
	return buildBreadcrumb([
		{ name: 'Startseite', url: `${siteUrl}/` },
		{ name, url: siteUrl + path }
	]);
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
