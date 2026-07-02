// ═══════════════════════════════════════════════════════════
// Default Content — Fallback when DB has no entries
// ═══════════════════════════════════════════════════════════
// Extracted from messages/de.json. Used as initial seed and
// fallback when the database has no content for a section.

import type {
	PillarsContent,
	AboutContent,
	WalkTheTalkContent,
	ReferencesContent,
	BlogContent,
	AngebotContent,
	TestimonialsContent,
	ExperimentsContent,
	MetricsContent,
	PartnersContent,
	ManifestContent,
	FaqContent
} from '$lib/types/content';

export const defaultPillars: PillarsContent = {
	pillars: [
		{
			key: 'strategy',
			title: 'Strategieberatung & IT-Beratung',
			note: 'mein Kerngeschäft seit über 10 Jahren',
			desc: 'Ich begleite Geschäftsleitungen von KMU bei strategischen IT- und Digitalfragen — von der IT-Gesamtstrategie über Digitalisierungs-Roadmaps bis hin zu KI-Readiness. Dazu gehören Evaluationen, Machbarkeitsstudien, Architektur-Reviews und die Begleitung bei der Umsetzung.',
			tags: ['IT-Strategie', 'Digitalisierung', 'KI-Strategie', 'Evaluationen', 'Security', 'Machbarkeitsstudien'],
			examples: [
				{ label: 'IT-Strategie', desc: 'Standortbestimmung und Roadmap für Treuhand-Unternehmen' },
				{ label: 'CRM-Evaluation', desc: 'Variantenstudie und Anforderungskatalog für Medizinaltechnik' },
				{ label: 'Digitalisierung', desc: 'Digitale Transformation für Industriegruppe' },
				{ label: 'KI-Bewertung', desc: 'AI-Proposal-Evaluation für Fachgesellschaft' },
				{ label: 'IT-Security', desc: 'Netzwerk-Segmentierung und Security-Strategie' }
			]
		},
		{
			key: 'governance',
			title: 'Governance & Verwaltungsrat',
			note: 'Digitalkompetenz, wo es zählt',
			desc: 'Drei aktive VR-Mandate, CAS Verwaltungsrat abgeschlossen. Brückenfunktion zwischen Aufsichtsgremium und operativer IT — IT-Governance, Budget-Benchmarking und strategische Digital-Aufsicht.',
			tags: ['VR-Mandate', 'IT-Governance', 'Digital-Aufsicht', 'CAS Verwaltungsrat'],
			examples: [
				{ label: 'IT-Governance', desc: 'Aufbau IT-Governance-Framework für Versicherung' },
				{ label: 'Digital-Aufsicht', desc: 'Digitalkompetenz-Assessment für VR-Gremium' },
				{ label: 'Budget-Review', desc: 'IT-Budget-Benchmarking für Industrieunternehmen' }
			]
		},
		{
			key: 'teaching',
			title: 'Lehre & Thought Leadership',
			note: 'Praxis lehren, nicht Theorie',
			desc: 'Projektmanagement, Innovation und digitale Transformation praxisnah lehren — an der BFH und der Feusi. Keynotes und Workshops zu Themen wie Shadow AI Governance, systemisches Denken und Strategieentwicklung.',
			tags: ['BFH', 'Feusi', 'Keynotes', 'Workshops', 'Shadow AI'],
			examples: [
				{ label: 'PM-Ausbildung', desc: 'Praxismodul Projektmanagement an der BFH' },
				{ label: 'Keynote', desc: 'Shadow AI Governance an der Swiss IT Conference' },
				{ label: 'Workshop', desc: 'Systemisches Denken für Führungskräfte' }
			]
		},
		{
			key: 'innovation',
			title: 'Walk the Talk',
			note: 'Technologie aus erster Hand kennen',
			desc: 'Was mich von anderen Beraterinnen unterscheidet: Ich baue selbst. Eigene KI-Plattformen und ein AI-Agent-Ökosystem sind mein tägliches Arbeitsinstrument — und die Grundlage für fundierte Empfehlungen.',
			tags: ['KI-Plattformen', 'AI Agents', 'SvelteKit', 'Claude Code'],
			examples: [
				{ label: 'Ductivo', desc: 'KI-Tutor für PM-Ausbildung an Hochschulen' },
				{ label: 'Ent.Orakel', desc: 'Interaktives Systemik-Werkzeug mit KI' },
				{ label: 'Miss Bizzy', desc: 'AI-Agent-Ökosystem im täglichen Einsatz' }
			],
			subpageUrl: '/experimentierraum'
		}
	]
};

export const defaultAbout: AboutContent = {
	title: 'Strategin, Verwaltungsrätin, Dozentin — und Builderin',
	texts: [
		'Ich bin Brigitte Hulliger — der Kopf hinter Break the Box. Seit über zehn Jahren begleite ich Unternehmen bei IT-Strategie, Digitalisierung und Transformation. Meine Kunden reichen von Versicherungen über Industrieunternehmen bis zu Anwaltskanzleien — überall dort, wo IT strategisch gedacht werden muss.',
		'Heute arbeite ich zunehmend auf strategischer Ebene: als Beraterin von Geschäftsleitungen, als Mitglied in drei Verwaltungsräten und als Dozentin an zwei Hochschulen. Was mich antreibt, ist Neugier — ich baue auch selbst KI-Plattformen und betreibe ein AI-Agent-Ökosystem, weil ich Technologie verstehen will, bevor ich sie empfehle.',
		'Mein Hintergrund verbindet Informatik, strategisches Management und Corporate Governance. Dazu kommt eine Leidenschaft für Visualisierung, die mir hilft, Komplexität greifbar zu machen — ob auf dem Whiteboard oder im Verwaltungsrat.'
	],
	qualifications: ['BSc Informatik', 'EMBA — mit Auszeichnung', 'CAS Verwaltungsrat'],
	roles: [
		{ title: 'Vizepräsidentin VR', org: 'Nexplore AG' },
		{ title: 'Verwaltungsrätin', org: 'GVB Bern' },
		{ title: 'Aufsichtsrätin', org: 'AKB / IVBE' },
		{ title: 'Dozentin', org: 'BFH & Feusi' }
	],
	socials: [
		{ platform: 'linkedin', url: 'https://www.linkedin.com/in/bhulliger/' },
		{ platform: 'instagram', url: 'https://www.instagram.com/brigitte.hulliger/' }
	],
	videoLabel: 'mein CV in 2 Minuten'
};

// Härtet einen (evtl. unvollständigen oder legacy) About-DB-Eintrag gegen
// fehlende/null Array-Felder, die auf den Public-Seiten dereferenziert werden.
export function normalizeAbout(raw: unknown): AboutContent {
	const c = { ...defaultAbout, ...((raw as Partial<AboutContent>) ?? {}) };
	return {
		...c,
		texts: Array.isArray(c.texts) ? c.texts : defaultAbout.texts,
		qualifications: Array.isArray(c.qualifications) ? c.qualifications : defaultAbout.qualifications,
		roles: Array.isArray(c.roles) ? c.roles : defaultAbout.roles,
		socials: Array.isArray(c.socials) ? c.socials : defaultAbout.socials
	};
}

export const defaultMetrics: MetricsContent = {
	items: [
		{ value: '10', label: 'Jahre', caption: 'Erfahrung' },
		{ value: '50+', label: 'Kunden', caption: 'Wirtschaft & öffentliche Hand' },
		{ value: '3', label: 'VR-Mandate', caption: 'aktuell aktiv' },
		{ value: '2', label: 'Hochschulen', caption: 'Lehre & Forschung' },
		{ value: '80+', label: 'Projekte', caption: 'begleitet & umgesetzt' }
	]
};

export const defaultManifest: ManifestContent = {
	kicker: 'Klartext · ein Manifest',
	title: 'KI ist überall.\n**Urteilsvermögen** ist selten.',
	subtitle:
		'Ein paar Sätze darüber, worauf es bei Digitalisierung und KI wirklich ankommt. Keine Buzzwords. Kein Hype. Klartext.',
	theses: [
		{
			text: 'IT ist keine Kostenstelle.\nSie ist eine **Wirkungsfrage**.',
			note: 'Die Kostenseite sehen alle. Ob ein Franken das Unternehmen wirklich zukunftsfähig macht, beurteilt fast niemand. **Genau dort entscheidet sich die Zukunft — nicht im Budget.**'
		},
		{
			text: 'Die meisten KI-Projekte scheitern nicht an der Technik.\nSondern am **Urteil**.',
			note: 'Ob ein Vorhaben trägt, entscheidet sich, bevor die erste Zeile Code entsteht. **Es braucht jemanden, der das beurteilen kann** — nicht jemanden, der nickt.'
		},
		{
			text: 'Wer KI empfiehlt,\nsollte sie auch **bauen** können.',
			note: 'Empfehlungen aus Folien sind billig. Wer eigene Plattformen betreibt und täglich mit KI-Agenten arbeitet, sieht hinter die Fassade — und **erkennt den Hype vom Substanziellen.**'
		},
		{
			text: 'Ein gutes Gremium braucht keinen Ja-Sager.\nEs braucht jemanden, der **nachfragt**.',
			note: '«Habt ihr das bedacht?» ist die wertvollste Frage im Verwaltungsrat. **Verantwortung nach OR 716a heisst: beurteilen können — nicht abnicken.**'
		},
		{
			text: 'Hype ist laut.\n**Substanz** ist ruhig.',
			note: 'Der Markt ist voll von Stimmen, die mehr versprechen als verstehen. **Klartext statt Buzzwords — das ist keine Pose, sondern Haltung.**'
		}
	],
	closingKicker: 'neugierig. unabhängig. fundiert.',
	closingTitle: 'Haltung ist gut.\nBeweis ist besser.',
	closingText:
		'Strategin im Verwaltungsrat · Architektin der Digitalstrategie · Builderin im Maschinenraum.'
};

export const defaultPartners: PartnersContent = {
	items: [
		{
			key: 'partner-1',
			name: 'Partnerfirma',
			website: '',
			logo: '',
			persons: [{ name: 'Vor- Nachname', role: 'Rolle', expertise: 'Fachgebiet / Expertise' }]
		}
	]
};

export const defaultWalkTheTalk: WalkTheTalkContent = {
	platforms: [
		{
			key: 'ductivo',
			name: 'Ductivo',
			sketch: 'KI-Tutor «Duci» — Hinweise statt Lösungen',
			desc: [
				'KI-gestützte Lernplattform für Projektmanagement-Ausbildung an Schweizer Hochschulen.',
				'Der Scaffolding-Tutor begleitet Studierende durch den PM-Lebenszyklus.'
			],
			url: 'https://ductivo.app',
			image: '/platforms/ductivo.png'
		},
		{
			key: 'entorakel',
			name: 'Ent.Orakel',
			sketch: 'Systemik erfahrbar machen',
			desc: [
				'Interaktives Systemik-Werkzeug, das komplexe Zusammenhänge sichtbar macht.',
				'Mit DCIA-Matrix, Szenarien, Wirkungsgefüge und Frühwarnindikatoren.'
			],
			url: 'https://entorakel.app',
			image: '/platforms/entorakel.png'
		},
		{
			key: 'marketing',
			name: 'marketing-strategy.ai',
			sketch: 'Strategie als lebendiger Prozess',
			desc: [
				'KI-gestützte Marketing-Strategien nach Lombriser/Abplanalp.',
				'10 Bausteine von der Analyse bis zur Balanced Scorecard mit Cockpit.'
			],
			url: 'https://marketing-strategy.ai',
			image: '/platforms/marketing.png'
		}
	],
	missbizzy: {
		title: 'Miss Bizzy — AI-Agent-Ökosystem',
		sketch: 'mein tägliches Arbeitsinstrument seit über einem Jahr',
		desc: 'Selbst gehostetes n8n-System mit spezialisierten Agenten für E-Mail, Controlling, Wissensmanagement, Recherche und CRM — kein Experiment, sondern gelebte Praxis.'
	}
};

export const defaultAngebot: AngebotContent = {
	items: [
		{
			key: 'digitalstrategie',
			title: 'Digitalstrategie & IT-Beratung',
			desc: 'Kerngeschäft seit über 10 Jahren: von der IT-Gesamtstrategie über Digitalisierungs-Roadmaps bis zur KI-Readiness — Analyse bis Umsetzung.'
		},
		{
			key: 'governance',
			title: 'Governance & Verwaltungsrat',
			desc: 'Digitale Urteilsfähigkeit ins Gremium: IT auf der Wirkungsseite beurteilen, nicht nur als Kosten. Verantwortung nach OR 716a.'
		},
		{
			key: 'keynotes',
			title: 'Keynotes & Lehre',
			desc: 'KI und digitale Transformation praxisnah und greifbar — Hype auf Substanz heruntergebrochen. Dozentin an zwei Hochschulen.'
		},
		{
			key: 'walkthetalk',
			title: 'Walk the Talk',
			desc: 'Eigene Plattformen und ein KI-Agenten-Ökosystem im täglichen Einsatz: Miss Bizzy, Ent.Orakel, Ductivo. Technologie aus erster Hand.'
		}
	]
};

export const defaultTestimonials: TestimonialsContent = {
	items: [
		{
			quote:
				'Sie ist **das Bindeglied zwischen Technik und Business** — kann eine Verordnung lesen und daraus ableiten, wie der Prozess aussehen muss.',
			author: 'Fippu Suter',
			role: 'früherer Vorgesetzter'
		},
		{
			quote: 'Ihre KI-Skills gehören zu den **obersten fünf Prozent** — und dabei ist sie nie abgehoben.',
			author: 'Marcel Zahnd',
			role: 'Co-Dozent'
		},
		{
			quote:
				'Sehr **bodenständig, mit ausgeprägter Bodenhaftung**. Was sie sagt, ist fundiert. Kein Blabla.',
			author: 'Aschi',
			role: 'VR-Kollege'
		}
	]
};

export const defaultExperiments: ExperimentsContent = {
	platforms: defaultWalkTheTalk.platforms,
	missbizzy: defaultWalkTheTalk.missbizzy,
	projects: [
		{
			key: 'miss-bizzy',
			name: 'Miss Bizzy',
			sketch: 'AI-Agent-Ökosystem im täglichen Einsatz',
			desc: 'Selbst gehostetes n8n-System mit spezialisierten Agenten für E-Mail, Controlling, Wissensmanagement, Recherche und CRM.',
			status: 'Im täglichen Einsatz'
		},
		{
			key: 'break-the-box-web',
			name: 'breakthebox.ch',
			sketch: 'Diese Website — selbst gebaut',
			desc: 'SvelteKit-Plattform mit eigenem CMS, KI-gestütztem Blog-Editor und Design-System. Gebaut mit Claude Code.',
			status: 'Laufend'
		}
	]
};

export const defaultReferences: ReferencesContent = {
	clients: [
		{ name: 'GVB', sortOrder: 0 },
		{ name: 'Nexplore', sortOrder: 1 },
		{ name: 'PostFinance', sortOrder: 2 },
		{ name: 'BLS', sortOrder: 3 },
		{ name: 'EWB', sortOrder: 4 },
		{ name: 'BFH', sortOrder: 5 },
		{ name: 'BEKB', sortOrder: 6 },
		{ name: 'Kanton Bern', sortOrder: 7 },
		{ name: 'SGAIM', sortOrder: 8 },
		{ name: 'Meier Tobler', sortOrder: 9 },
		{ name: 'Bracher & Partner', sortOrder: 10 },
		{ name: 'Michel Gruppe', sortOrder: 11 },
		{ name: 'ORTHO TEAM', sortOrder: 12 },
		{ name: 'BAFU', sortOrder: 13 },
		{ name: 'Identitas', sortOrder: 14 },
		{ name: 'Kellerhals Carrard', sortOrder: 15 },
		{ name: 'GASCHE', sortOrder: 16 },
		{ name: 'Milchgold Käse', sortOrder: 17 }
	]
};

export const defaultFaq: FaqContent = {
	items: [
		{
			question: 'Für wen bin ich die richtige Beraterin?',
			answer:
				'Für Dich als KMU-Geschäftsleitung oder Verwaltungsrat in der Schweiz, wenn Du strategische IT-, Digitalisierungs- oder KI-Fragen klären musst — typischerweise Unternehmen mit 20 bis 500 Mitarbeitenden, ohne eigene CIO-Funktion oder mit Bedarf an einer unabhängigen Zweitmeinung.'
		},
		{
			question: 'Was unterscheidet mich von anderen IT-Beraterinnen?',
			answer:
				'Drei Dinge: über zehn Jahre Strategieerfahrung mit BSc Informatik und EMBA, drei aktive Verwaltungsratsmandate (CAS Verwaltungsrat) und das tägliche Bauen eigener KI-Plattformen. Meine Empfehlungen kommen aus eigener Praxis, nicht aus Folien.'
		},
		{
			question: 'Welche Themen decke ich ab?',
			answer:
				'IT-Strategie, IT-Governance, Digitalisierungs-Roadmaps, KI-Strategie und Shadow-AI-Governance, Evaluationen und Machbarkeitsstudien, Architektur- und Security-Reviews sowie Keynotes und Workshops.'
		},
		{
			question: 'Wie läuft ein typisches Mandat mit mir ab?',
			answer:
				'In vier Schritten: Verstehen (Standortbestimmung), Verorten (Reifegrad und Benchmarking), Visionieren (Strategie und Roadmap), Verankern (Umsetzungsbegleitung). Ein Mandat dauert bei mir typischerweise zwischen drei Wochen und sechs Monaten.'
		},
		{
			question: 'Arbeite ich auch ausserhalb der Schweiz?',
			answer:
				'Mein Schwerpunkt ist die Deutschschweiz. Mandate in Deutschland und Österreich sind möglich, sofern sie remote oder mit punktuellen Vor-Ort-Tagen durchführbar sind.'
		}
	]
};

export const defaultBlog: BlogContent = {
	posts: [
		{
			key: 'blog1',
			tag: 'KI · Erfahrungsbericht',
			title: 'AI Agenten: Wie Miss Bizzy mein Arbeitsleben revolutionierte',
			excerpt: 'Ein ehrlicher Erfahrungsbericht über 9 Monate mit AI-Agenten im Arbeitsalltag.'
		},
		{
			key: 'blog2',
			tag: 'Strategie · Beratung',
			title: 'Subcontracting: Wie lange darf die Kette sein?',
			excerpt: 'Subcontracting von beiden Seiten erfahren. Meine Erfahrungen sind durchmischt.'
		},
		{
			key: 'blog3',
			tag: 'Governance · Persönlich',
			title: 'Mein erstes VR-Mandat',
			excerpt: 'Verwaltungsräte waren ein Buch mit sieben Siegeln. Nun sitze ich in dreien.'
		}
	]
};

// Normalisiert Experiments-Content: legacy String-desc → Array (Abschnitte).
export function normalizeExperiments(raw: unknown): ExperimentsContent {
	const c = (raw ?? {}) as {
		platforms?: Array<Record<string, unknown>>;
		projects?: unknown;
		missbizzy?: ExperimentsContent['missbizzy'];
	};
	const platforms = (Array.isArray(c.platforms) ? c.platforms : []).map((p) => {
		const d = (p as { desc?: unknown }).desc;
		return {
			...(p as object),
			desc: Array.isArray(d) ? (d as string[]) : d ? [String(d)] : []
		};
	}) as ExperimentsContent['platforms'];
	return {
		platforms,
		missbizzy: c.missbizzy ?? defaultExperiments.missbizzy,
		projects: (Array.isArray(c.projects) ? c.projects : []) as ExperimentsContent['projects']
	};
}
