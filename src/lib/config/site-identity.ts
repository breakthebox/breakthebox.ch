// ═══════════════════════════════════════════════════════════
// Site Identity — Quelle für Person/Organization JSON-LD
// ═══════════════════════════════════════════════════════════
// Stammdaten für E-E-A-T-Signale (Google) und GEO (LLMs).
// Wird bei jedem Render in JSON-LD eingespiesen — Änderungen hier
// wirken sich global auf strukturierte Daten aus.

import type { SiteIdentity } from '$lib/utils/schema';

export function buildSiteIdentity(siteUrl: string): SiteIdentity {
	const cleanUrl = siteUrl.replace(/\/$/, '');
	return {
		siteUrl: cleanUrl,
		personName: 'Brigitte Hulliger',
		personJobTitle: 'IT-Beraterin & Strategy Consultant',
		personDescription:
			'IT-Beraterin spezialisiert auf IT-Strategie, Governance, Digitalisierung und KI. Begleitet Unternehmen mit Substanz und Umsetzungskraft.',
		personImage: `${cleanUrl}/avatar_bhu.svg`,
		personSameAs: [
			'https://www.linkedin.com/in/bhulliger/',
			'https://www.instagram.com/brigitte.hulliger/'
		],
		personKnowsAbout: [
			'IT-Strategie',
			'IT-Governance',
			'Digital Governance',
			'Digitalisierung',
			'Künstliche Intelligenz',
			'Digitale Transformation',
			'Digital Transformation',
			'Innovation Management',
			'Verwaltungsrat',
			'Board'
		],
		// Hochschule und Mandate — Ziel der alumniOf/memberOf/worksFor-Referenzen.
		personAffiliations: [
			{
				id: 'bfh',
				name: 'Berner Fachhochschule BFH',
				url: 'https://www.bfh.ch',
				alumniOf: true,
				memberOf: true,
				worksFor: true
			},
			{
				id: 'gvb',
				name: 'GVB Gebäudeversicherung Bern',
				url: 'https://www.gvb.ch',
				memberOf: true,
				worksFor: true
			},
			{
				id: 'nexplore',
				name: 'Nexplore AG',
				url: 'https://www.nexplore.ch',
				memberOf: true,
				worksFor: true
			}
		],
		// Abschlüsse als E-E-A-T-Signal. `issuerId` verweist auf eine Affiliation.
		personCredentials: [
			{
				name: 'Executive Master of Business Administration (EMBA) in Innovative Business Creation',
				credentialCategory: 'degree',
				educationalLevel: 'Master',
				year: '2024',
				issuerId: 'bfh'
			},
			{
				name: 'Bachelor of Science in Computer Science, with Specialization in Computer Perception and Virtual Reality',
				credentialCategory: 'degree',
				educationalLevel: 'Bachelor',
				year: '2009'
			},
			{
				name: 'Certified Board Member',
				credentialCategory: 'certification',
				year: '2025'
			}
		],
		orgName: 'Break the Box GmbH',
		orgLogo: `${cleanUrl}/logo.webp`,
		orgSameAs: [
			'https://www.linkedin.com/company/break-the-box-gmbh',
			'https://www.instagram.com/breakthebox_ch/',
			'https://www.youtube.com/channel/UC1b1A2dUD8zVEtwah1de2zQ'
		],
		orgCountry: 'CH',
		orgLocality: 'Kirchberg',
		orgRegion: 'BE',
		orgPostalCode: '3422',
		orgStreetAddress: 'Mülibüüne 4',
		// Koordinaten der Geschäftsadresse (OpenStreetMap-Geocoding).
		orgLatitude: 47.0924981,
		orgLongitude: 7.5765547,
		orgTelephone: '+41763092088',
		orgEmail: 'info@breakthebox.ch',
		orgAreaServed: ['Schweiz', 'Deutschland', 'Österreich'],
		orgServices: [
			{
				name: 'IT-Strategieberatung',
				description:
					'Begleitung von Geschäftsleitungen bei IT-Gesamtstrategie, Digitalisierungs-Roadmaps, KI-Readiness und Architektur-Reviews.',
				serviceType: 'IT-Strategie'
			},
			{
				name: 'IT-Governance & Verwaltungsrat',
				description:
					'IT-Governance-Frameworks, Digital-Aufsicht, Budget-Benchmarking und Brückenfunktion zwischen Verwaltungsrat und operativer IT.',
				serviceType: 'Corporate Governance'
			},
			{
				name: 'KI-Strategie & KI-Readiness',
				description:
					'KI-Bewertungen, Shadow-AI-Governance und strategische Begleitung beim Einsatz generativer KI in Schweizer KMU.',
				serviceType: 'AI Strategy'
			},
			{
				name: 'Evaluationen & Machbarkeitsstudien',
				description:
					'Strukturierte Variantenstudien, Anforderungskataloge und Machbarkeitsstudien für IT-Investitionsentscheide.',
				serviceType: 'IT-Evaluation'
			},
			{
				name: 'Keynotes & Workshops',
				description:
					'Praxisnahe Vorträge und Workshops zu IT-Strategie, KI-Governance, systemischem Denken und digitaler Transformation.',
				serviceType: 'Education'
			}
		]
	};
}
