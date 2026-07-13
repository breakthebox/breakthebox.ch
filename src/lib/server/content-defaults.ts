// ═══════════════════════════════════════════════════════════
// Default Content — Fallback when DB has no entries
// ═══════════════════════════════════════════════════════════
// Extracted from messages/de.json. Used as initial seed and
// fallback when the database has no content for a section.

/**
 * Tiefes Zusammenführen von Default und gespeichertem Content.
 * Gespeicherte Werte gewinnen; verschachtelte Objekte werden rekursiv
 * gemergt, sodass später hinzugefügte Felder immer aus den Defaults
 * kommen (statt zu fehlen, wenn eine ältere Zeile in der DB liegt).
 * Arrays und Primitive werden ganz ersetzt (gespeicherter Wert gewinnt).
 */
export function mergeContent<T>(base: T, override: unknown): T {
	if (override === undefined || override === null) return base;
	if (
		Array.isArray(base) ||
		Array.isArray(override) ||
		typeof base !== 'object' ||
		typeof override !== 'object'
	) {
		return override as T;
	}
	const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
	for (const key of Object.keys(override as Record<string, unknown>)) {
		const b = (base as Record<string, unknown>)[key];
		const o = (override as Record<string, unknown>)[key];
		out[key] = key in (base as Record<string, unknown>) ? mergeContent(b, o) : o;
	}
	return out as T;
}

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
	ReferenceProjectsContent,
	TransformationContent,
	GovernanceContent,
	KeynotesContent,
	FaqContent,
	HeroContent,
	HeroPreset,
	SectionSetting,
	SectionsContent,
	MediaContent,
	ThemeImageAsset,
	Theme,
	ThemeContent
} from '$lib/types/content';

export const defaultPillars: PillarsContent = {
	pillars: [
		{
			key: 'transformation',
			title: 'Transformation',
			note: 'über Monate, nicht als Kurzeinsatz',
			desc: 'Ich begleite Organisationen durch die digitale Transformation — von Standortbestimmung über Strategie bis zur Umsetzung. Als Katalysatorin auf Zeit, mit klarem Exit.',
			tags: ['IT-Strategie', 'Digitalisierung', 'KI-Readiness', 'Umsetzung'],
			examples: [],
			subpageUrl: '/transformation'
		},
		{
			key: 'governance',
			title: 'Governance',
			note: 'Digitalkompetenz, wo es zählt',
			desc: 'Digitale Urteilskraft dauerhaft im Gremium: Ich stelle die unbequemen Fragen, gehe in Vorleistung und bewahre vor teuren Fehlentscheiden. Verantwortung nach OR 716a.',
			tags: ['VR-Mandate', 'IT-Governance', 'OR 716a', 'Digital-Aufsicht'],
			examples: [],
			subpageUrl: '/governance'
		},
		{
			key: 'keynotes',
			title: 'Keynotes',
			note: 'gefunden werden statt suchen',
			desc: 'Keynotes, Panels und Workshops zu KI, Governance und digitaler Urteilskraft — praxisnah, weil ich baue und verantworte, worüber ich spreche. Dozentin an zwei Hochschulen.',
			tags: ['Keynotes', 'Workshops', 'Lehre', 'Shadow AI'],
			examples: [],
			subpageUrl: '/keynotes'
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
	videoLabel: 'mein CV in 2 Minuten',
	videoUrl: 'https://www.youtube.com/watch?v=uCzVUW3xY8I'
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

// Aufsteigende Beweis-Kette: Erfahrung → Umsetzung → Vertrauen → Verantwortung.
export const defaultMetrics: MetricsContent = {
	items: [
		{ value: '10+', label: 'Jahre', caption: 'Erfahrung' },
		{ value: '80+', label: 'Projekte', caption: 'begleitet & umgesetzt' },
		{ value: '50+', label: 'Kunden', caption: 'Wirtschaft & öffentliche Hand' },
		{ value: '3', label: 'VR-Mandate', caption: 'aktuell aktiv' }
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
			note: 'mein Kerngeschäft seit über 10 Jahren',
			desc: 'Kerngeschäft seit über 10 Jahren: von der IT-Gesamtstrategie über Digitalisierungs-Roadmaps bis zur KI-Readiness — Analyse bis Umsetzung.',
			tags: ['IT-Strategie', 'Digitalisierung', 'KI-Readiness']
		},
		{
			key: 'governance',
			title: 'Governance & Verwaltungsrat',
			note: 'Digitalkompetenz, wo es zählt',
			desc: 'Digitale Urteilsfähigkeit ins Gremium: IT auf der Wirkungsseite beurteilen, nicht nur als Kosten. Verantwortung nach OR 716a.',
			tags: ['IT-Governance', 'OR 716a', 'VR-Mandate']
		},
		{
			key: 'keynotes',
			title: 'Keynotes & Lehre',
			note: 'gefunden werden statt suchen',
			desc: 'KI und digitale Transformation praxisnah und greifbar — Hype auf Substanz heruntergebrochen. Dozentin an zwei Hochschulen.',
			tags: ['Keynotes', 'Workshops', 'Lehre']
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

// Bewusst leer: Die Bühnen-Section und der Ankündigungs-Streifen bleiben
// verborgen, bis im Backoffice ein echter Auftritt erfasst wird.
export const defaultKeynotes: KeynotesContent = {
	items: []
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
		},
		{
			question: 'Für wen bin ich nicht die Richtige?',
			answer:
				'Für träge Organisationen ohne echten Veränderungswillen und für reines Projektmanagement oder Daily-Business. Ich bin auch nicht die «KI-Stimme» der Schweiz und nicht die Infrastruktur-Ingenieurin — sondern die strategische Übersetzerin zwischen Business und Technik. Es zählt die Haltung, nicht die Branche.'
		},
		{
			question: 'Ist KI bei mir ein Verkaufsargument?',
			answer:
				'Nein. KI ist für mich selbstverständliches Werkzeug, keine Überschrift. Ich betreibe selbst ein AI-Agenten-Ökosystem (Miss Bizzy), EntOrakel und Ductivo — ich verstehe Technik von innen und empfehle nur Erprobtes. «Walk the talk» statt heisse Luft.'
		},
		{
			question: 'Warum die Personenmarke Brigitte Hulliger — und was ist mit der Wucht GmbH?',
			answer:
				'Vertrauen gilt der Person: VR-Mandate, Beratung und Bühne laufen über mich, nicht über eine Firma. «Break the Box» ist Claim und Haltung — die bestehende GmbH mit Domain, Verträgen und Referenzen bleibt vollständig erhalten und trägt die Marke weiter.'
		},
		{
			question: 'Wie komme ich am besten zu Dir — und was kostet ein Erstgespräch?',
			answer:
				'Am direktesten über eine kurze Mail an info@breakthebox.ch oder eine Empfehlung aus meinem Netzwerk. Ein erstes Kennenlernen ist unverbindlich und kostenlos — darin klären wir, ob Anliegen und Zusammenarbeit passen, bevor wir über ein Mandat sprechen.'
		}
	]
};

export const defaultReferenceProjects: ReferenceProjectsContent = {
	items: [
		{
			key: 'transformation',
			title: 'IT-Gesamtstrategie & Transformation',
			subtitle: 'Versicherung · GL-Begleitung',
			description:
				'Begleitung der Geschäftsleitung von der Standortbestimmung über die Digitalisierungs-Roadmap bis zur Umsetzung — Strategie und Realisierung aus einer Hand, über 6 bis 12 Monate. Kein Konzept, das liegen bleibt, sondern eine Roadmap, die verankert wird.'
		},
		{
			key: 'governance',
			title: 'Digitale Urteilskraft im Verwaltungsrat',
			subtitle: 'VR-Mandat · Governance',
			description:
				'Als Verwaltungsrätin bringe ich digitale und KI-Fragen auf die Wirkungsseite ins Gremium — IT wird beurteilt, nicht nur als Kostenblock verwaltet. Verantwortung nach OR 716a heisst: beurteilen können statt abnicken.'
		},
		{
			key: 'ki-readiness',
			title: 'KI-Readiness & Shadow-AI-Governance',
			subtitle: 'KMU · Strategie & Sicherheit',
			description:
				'Evaluation der KI-Reife, Aufbau eines pragmatischen Governance-Rahmens für den Umgang mit KI-Werkzeugen und Identifikation der Anwendungsfälle mit echtem Hebel — ohne Hype, mit Substanz aus eigener Praxis.'
		},
		{
			key: 'keynote',
			title: 'Keynotes & Befähigung',
			subtitle: 'Hochschulen & Unternehmen',
			description:
				'Vorträge und Workshops zu KI, Digitalisierung und digitaler Urteilskraft — gebaut aus gelebter Praxis (BFH, Feusi, CAS). Substanz statt Show: befähigen statt dozieren, damit das Publikum mitkommt und weiterträgt.'
		}
	]
};

export const defaultTransformation: TransformationContent = {
	hero: {
		kicker: 'Transformation · IT-, Digital- & KI-Strategie',
		title: 'Transformation, **die trägt.**',
		subline:
			'Von der Standortbestimmung bis zur verankerten Umsetzung — in Stufen, die einzeln bestehen. Für Geschäftsleitungen und Verwaltungsräte, die souverän entscheiden wollen statt getrieben zu werden.',
		ctaPrimary: 'So arbeiten wir',
		ctaSecondary: 'Direkt anfragen'
	},
	mirror: {
		kicker: 'Woran es sich zeigt',
		title: 'Kommt dir eine dieser Situationen bekannt vor?',
		lead: 'Transformation beginnt selten mit einem grossen Plan. Sie beginnt mit einem Moment, in dem eine Frage im Raum steht.',
		situations: [
			{
				quote:
					'«Auf dem Tisch liegt ein Investitionsantrag über eine Million — und niemand im Gremium kann beurteilen, ob die Zahlen tragen.»',
				answer: 'Der Einstieg: **eine unabhängige Stellungnahme.** Stufe 1.'
			},
			{
				quote:
					'«Wir haben eine Digitalstrategie. Sie liegt seit achtzehn Monaten in der Schublade, und keiner kann sagen, was davon umgesetzt ist.»',
				answer: 'Der Einstieg: **Standortbestimmung — was trägt, was ist Papier.** Stufe 2.'
			},
			{
				quote:
					'«Der VR fragt nach unserer KI-Strategie. Die Mitarbeitenden nutzen längst ChatGPT — mit Kundendaten, ohne Regeln.»',
				answer: 'Der Einstieg: **KI-Readiness und ein Governance-Rahmen, der gelebt wird.** Stufe 2–3.'
			},
			{
				quote:
					'«Unser IT-Partner empfiehlt schon wieder sein eigenes Produkt. Wir bräuchten jemanden, der nichts verkauft ausser seinem Urteil.»',
				answer: 'Der Einstieg: **eine Zweitmeinung ohne eigene Agenda.** Stufe 1.'
			}
		]
	},
	steps: {
		kicker: 'So arbeiten wir',
		title: 'Drei Stufen. Drei Ausgänge.',
		claim: 'Jede Stufe endet mit einem Ergebnis — **und mit einer freien Entscheidung.** Keine Stufe verkauft automatisch die nächste.',
		items: [
			{
				no: '01',
				durationTag: 'Tage',
				title: 'Der Spiegel',
				question: '«Entscheiden wir richtig?»',
				description:
					'Ein klar umrissener Auftrag mit klarem Ende: Ich schaue von aussen auf das, was auf eurem Tisch liegt, und sage, was ich sehe — schriftlich, begründet, ohne Rücksicht auf eine Verlängerung.',
				tags: [
					'Review Investitions- & Projektanträge',
					'Zweitmeinung System- & Sourcing-Entscheide',
					'Durchsicht IT-Strategien & Statusberichte',
					'Vertrags- & Offert-Reviews'
				],
				result: 'Schriftliche Stellungnahme + Besprechung',
				duration: 'Wenige Tage, fixer Rahmen',
				exit: 'Hier können wir aufhören. Ihr seid klüger — mit oder ohne mich.'
			},
			{
				no: '02',
				durationTag: '3–6 Monate',
				title: 'Die Strategie',
				question: '«Wo stehen wir — und wohin?»',
				description:
					'Wenn der Spiegel Handlungsbedarf zeigt: IT-, Digital- oder KI-Strategie — von der Standortbestimmung über das Zielbild bis zur Roadmap mit messbaren Etappen. Erarbeitet mit der GL, nicht für sie.',
				tags: [
					'IT-Gesamtstrategie',
					'Digital-Strategie',
					'KI-Strategie & KI-Readiness',
					'Roadmap mit Etappen & Kosten'
				],
				result: 'Eine Strategie, die die GL selbst vertreten kann',
				duration: '3–6 Monate, projektförmig',
				exit: 'Auch hier: Die Roadmap gehört euch. Umsetzen könnt ihr sie selbst.'
			},
			{
				no: '03',
				durationTag: '6–12 Monate',
				title: 'Die Verankerung',
				question: '«Kommt es auch an?»',
				description:
					'Wenn gewünscht, begleite ich die Umsetzung — Roadmap in Betrieb bringen, Governance-Rahmen etablieren, Schlüsselpersonen befähigen. Mit eingebautem Ende: Mein Auftrag ist erfüllt, wenn ihr mich nicht mehr braucht.',
				tags: [
					'Umsetzungsbegleitung',
					'Governance & Shadow-AI-Rahmen',
					'Befähigung GL & Schlüsselpersonen'
				],
				result: 'Eine Organisation, die selbst steuert',
				duration: '6–12 Monate, degressiv',
				exit: 'Der geplante Ausgang: Es trägt ohne mich.'
			}
		]
	},
	impact: {
		kicker: 'Was am Ende steht',
		big: 'Kein Konzept, das liegen bleibt. Sondern eine Organisation, die digital urteilen und handeln kann — *auch wenn ich längst weg bin.*',
		small:
			'Deshalb ist die Begleitung degressiv angelegt: Am Anfang bin ich oft da, am Ende selten. Gute Beratung macht sich überflüssig — das steht so in meinem Manifest, und es steht so in meinen Offerten.'
	},
	proof: {
		kicker: 'Erprobt, nicht nachgeplappert',
		title: 'Wie das konkret aussieht',
		lead: 'Ein Beispiel aus dem letzten Winter — so entsteht aus einer Stufe die nächste. Oder eben nicht.',
		caseLabel: 'Schweizer Unternehmensgruppe · Industrie',
		caseRows: [
			{
				month: 'Dezember',
				text: 'Anfrage: **Review eines Investitionsantrags** — eine unabhängige Einschätzung vor dem VR-Entscheid.',
				tag: 'Stufe 1'
			},
			{
				month: 'Januar',
				text: '**Schriftliche Stellungnahme, abgeschlossen.** Empfehlung darin: Der Antrag braucht ein strategisches Fundament, das fehlt.'
			},
			{
				month: 'Februar',
				text: 'Rückfrage der Gruppe: **«Erarbeiten Sie die IT- und Digitalstrategie mit uns?»** Daraus wurde ein sechsmonatiges Engagement.',
				tag: 'Stufe 2'
			}
		],
		missgovern: {
			title: 'Governance kann man bei mir nicht nur buchen. Man kann sie spielen.',
			text: 'Mis(s)Govern: 15 Minuten Simulation, 7 Entscheidungen, euer KI-Readiness-Profil — selbst gebaut, self-hosted.',
			cta: 'Simulation starten',
			url: ''
		}
	},
	boundaries: {
		kicker: 'Der Ehrlichkeit halber',
		title: 'Was ich nicht mache',
		lead: 'Damit wir keine Zeit verlieren — eure nicht und meine nicht.',
		items: [
			{
				title: 'Konzepte im Kilo-Format',
				desc: 'Keine 200 Seiten fürs Archiv. Was ich abgebe, ist zum Entscheiden gedacht, nicht zum Ablegen.'
			},
			{
				title: 'Mandate ohne Ende',
				desc: 'Keine Beratung, die sich selbst verlängert. Jede Stufe hat einen Ausgang, und der steht in der Offerte.'
			},
			{
				title: 'Verkauf im Beratermantel',
				desc: 'Keine Produkte, keine Reseller-Provisionen, keine Partner-Deals. Ich verkaufe ein Urteil — sonst nichts.'
			}
		]
	},
	contact: {
		kicker: 'Der erste Schritt',
		title: '30 Minuten, unverbindlich',
		lead: 'Kein Verkaufsgespräch — eine erste Einschätzung.',
		steps: [
			'Ihr schildert die Situation — der Antrag, die Strategie, die Frage im Raum.',
			'Ich sage, was ich sehe: wo ich helfen kann und wo ihr mich nicht braucht.',
			'Wenn es passt: ein Vorschlag für Stufe 1 — mit fixem Rahmen und fixem Ende.'
		],
		box: {
			title: 'Erzähl mir, was auf eurem Tisch liegt.',
			text: 'Du bekommst eine ehrliche erste Einschätzung — und keine Verkaufsschlaufe.',
			mgLine: 'Aus der Simulation: Euer blinder Fleck war **Governance** — bring das Factsheet mit.'
		}
	},
	faq: {
		items: [
			{
				question: 'Was kostet der Einstieg?',
				answer:
					'Stufe 1 hat einen fixen Rahmen von wenigen Tagen — du erhältst vorab eine Offerte mit Festpreis. Keine offenen Tagessätze, keine Überraschungen.'
			},
			{
				question: 'Wie lange dauert eine Strategie-Erarbeitung?',
				answer:
					'Drei bis sechs Monate, abhängig von Grösse und Entscheidungstempo der Organisation. Die Etappen und Meilensteine stehen in der Roadmap — inklusive dem Punkt, an dem mein Teil endet.'
			},
			{
				question: 'Für welche Organisationen passt das?',
				answer:
					'Schweizer KMU und Organisationen mit einer Geschäftsleitung oder einem Verwaltungsrat, der die Veränderung selbst tragen will. Branchenerfahrung u.a. Versicherung, Industrie, Bildung, öffentliche Hand.'
			},
			{
				question: 'Warum keine langfristige Betreuung?',
				answer:
					'Weil Unabhängigkeit meine wichtigste Arbeitsgrundlage ist. Wer zu lange bleibt, wird quasi-intern und verliert die Aussenperspektive — genau die bezahlt ihr aber. Deshalb: Stufen mit Ausgängen statt Mandate ohne Ende.'
			}
		]
	},
	banner: {
		utmSource: 'missgovern',
		text: 'Aus der Simulation? Euer grösster blinder Fleck war **Governance** — genau dafür gibt es hier den passenden Einstieg.',
		ctaLabel: 'Zum passenden Einstieg',
		ctaHref: '#kontakt'
	}
};

export const defaultGovernance: GovernanceContent = {
	hero: {
		kicker: 'Verwaltungsrat · Digitale Urteilskraft im Gremium',
		title: 'Digitalisierung lässt sich nicht delegieren. **Auch nicht im Verwaltungsrat.**',
		subline:
			'Die Oberleitung der Gesellschaft ist unübertragbar — **OR 716a** kennt keine Ausnahme für IT und KI. Was sich ändern lässt: wer mit am Tisch sitzt, wenn diese Entscheide fallen.',
		ctaPrimary: 'VR-Dossier anfordern',
		ctaSecondary: 'Direkt anfragen'
	},
	chair: {
		kicker: 'Der leere Stuhl',
		big: 'KI-Entscheide sind Oberleitungs-Entscheide geworden: Investitionen, Risiken, Reputation. Aber am Tisch sitzt selten jemand, der die Vorlage dahinter *wirklich beurteilen kann.*',
		small:
			'Das Resultat kennt jedes Gremium: Man vertraut der Management-Präsentation, dem externen Gutachten, dem Bauchgefühl. Genau diese Lücke in der Kompetenz-Matrix fülle ich — als Verwaltungsrätin, nicht als zugekaufte Expertin ohne Verantwortung.'
	},
	contributions: {
		kicker: 'Was ich an den Tisch bringe',
		title: 'Drei Beiträge, jeden Sitzungstag',
		lead: 'Keine Karten zum Umdrehen — konkrete Arbeit im Gremium.',
		items: [
			{
				title: 'Die Frage, die im Raum fehlt',
				text: 'Betriebswirtschaft auf GL-Niveau plus digitale Urteilskraft: Ich frage nach, bevor es teuer wird — bei Investitionsanträgen, Sourcing-Entscheiden und Projektampeln, die zu grün aussehen.',
				exampleLabel: 'Im Alltag',
				example: 'Vorlagen-Review vor der Sitzung, kritische Würdigung statt Kenntnisnahme.'
			},
			{
				title: 'Entscheidungsreife statt Papierberge',
				text: 'Ich arbeite in Vorleistung: Anträge werden vorgeprüft, Traktanden geschärft, Optionen echt vergleichbar gemacht — damit das Gremium entscheidet statt durchwinkt.',
				exampleLabel: 'Im Alltag',
				example: 'Strategie-Klausuren, Digital-Traktanden, Ausschussarbeit.'
			},
			{
				title: 'Erprobt, nicht nachgeplappert',
				text: 'Ich baue und betreibe eigene KI-Systeme — self-hosted, im täglichen Einsatz. Meine Einschätzungen stammen aus erster Hand, nicht aus dem Analystenbericht.',
				exampleLabel: 'Der Beweis',
				example: 'Mis(s)Govern — meine Governance-Simulation, selbst gebaut →',
				url: ''
			}
		]
	},
	matrix: {
		kicker: 'Profil auf einen Blick',
		title: 'Die Kompetenz-Matrix-Perspektive',
		lead: 'Findungskommissionen denken in Zeilen und Lücken. Das ist meine Abdeckung — ehrlich markiert.',
		rows: [
			{ label: 'Digital / IT / KI', level: 3, highlight: true, note: 'die Zeile, die oft fehlt' },
			{ label: 'Betriebswirtschaft & Finanzen', level: 2 },
			{ label: 'Governance & Aufsicht', level: 3 },
			{ label: 'Strategie & Transformation', level: 3 },
			{ label: 'Recht & Compliance', level: 1 },
			{ label: 'Branchen: Versicherung · IT · Bildung', level: 2 }
		],
		facts: [
			{ label: 'Informatik', value: 'BSc Informatik' },
			{ label: 'Betriebswirtschaft', value: 'Executive MBA' },
			{ label: 'Gremienarbeit', value: 'CAS Verwaltungsrat' },
			{ label: 'Lehre', value: 'Dozentin BFH' },
			{ label: 'Praxis', value: 'Eigene KI-Systeme, self-hosted' },
			{ label: 'Bühne', value: 'Keynotes zu KI & Governance' }
		],
		note: 'Bewusst keine Vollabdeckung — ein Gremium braucht Zeilen, die sich ergänzen, nicht sechs Generalisten.'
	},
	mandates: {
		kicker: 'Aktuelle Mandate',
		title: 'Wo ich Verantwortung trage',
		lead: 'Öffentlich, transparent, mit Rolle — Interessenbindungen auf Anfrage vollständig offengelegt.',
		items: [
			{
				org: 'Nexplore AG',
				role: 'Verwaltungsratspräsidentin',
				president: true,
				desc: 'Präsidium eines IT-Dienstleisters — Strategie, Aufsicht und Führung des Gremiums.'
			},
			{
				org: 'GVB Gebäudeversicherung Bern',
				role: 'Verwaltungsrätin',
				desc: 'Digitale Urteilskraft in einem regulierten Versicherungsumfeld.'
			},
			{
				org: 'AKB / IVBE',
				role: 'Verwaltungsrätin',
				desc: 'Governance und Digitalisierung.'
			}
		],
		principleTitle: 'Ich sammle keine Mandate. **Ich wähle sie.**',
		principleText:
			'Bewusst, gezielt und im Rahmen meiner Kapazität — jedes Gremium hat Anspruch auf eine Verwaltungsrätin, die vorbereitet in die Sitzung kommt. Und: keine Interessenbindungen zu IT-Anbietern, keine Reseller-Verhältnisse. Mein Urteil gehört dem Gremium.'
	},
	stance: {
		kicker: 'Haltung',
		quote: '«Ein gutes Gremium braucht keine Ja-Sager. Es braucht jemanden, der nachfragt.»',
		citeText: 'Aus meinem Manifest —',
		citeLinkLabel: 'alle Ansagen lesen →',
		citeUrl: '/manifest'
	},
	cta: {
		dark: {
			title: 'Für Findungskommissionen & Headhunter',
			text: 'Das VR-Dossier als PDF: Profil, Kompetenz-Matrix, Mandate und Interessenbindungen auf einer Seite — zum internen Weiterreichen.',
			ctaLabel: 'Dossier öffnen (PDF) →',
			dossierUrl: '/governance-dossier.pdf',
			email: 'info@breakthebox.ch',
			phone: '+41 76 309 20 88'
		},
		light: {
			title: 'Für den direkten Austausch',
			text: 'Ihr sucht die Digital-Zeile für eure Matrix — oder eine Zweitmeinung, ob ihr sie braucht? Ein Gespräch klärt das schneller als jedes Dossier.',
			ctaLabel: 'Lass uns reden →',
			ctaHref: 'mailto:info@breakthebox.ch'
		}
	}
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

// ─── Sektionen der Landing ───
// Feste Keys in der Standard-Reihenfolge. Hero ist fix zuoberst (eigenes
// System), der Footer fix zuunterst — beide sind hier bewusst nicht dabei.
export const LANDING_SECTION_KEYS = [
	'angebot',
	'logos',
	'pillars',
	'tension',
	'about',
	'haltung',
	'buehne',
	'netzwerk',
	'stimmen',
	'impulse',
	'faq',
	'kontakt'
] as const;

// Sektionen, die standardmässig ausgeblendet sind (z.B. die alten Pillars).
const DEFAULT_HIDDEN_KEYS: readonly string[] = ['pillars'];

export const defaultSections: SectionsContent = {
	sections: LANDING_SECTION_KEYS.map((key) => ({
		key,
		visible: !DEFAULT_HIDDEN_KEYS.includes(key),
		kicker: '',
		title: '',
		subtitle: ''
	}))
};

// Robust auflösen: gespeicherte Reihenfolge übernehmen, unbekannte Keys
// verwerfen, fehlende (z.B. später hinzugekommene) Sektionen hinten anfügen.
export function normalizeSections(raw: unknown): SectionsContent {
	const saved = Array.isArray((raw as Partial<SectionsContent>)?.sections)
		? ((raw as SectionsContent).sections as Partial<SectionSetting>[])
		: [];
	const out: SectionSetting[] = [];
	for (const s of saved) {
		if (!s?.key) continue;
		if (!(LANDING_SECTION_KEYS as readonly string[]).includes(s.key)) continue;
		if (out.some((o) => o.key === s.key)) continue;
		out.push({
			key: s.key,
			visible: s.visible !== false,
			kicker: s.kicker ?? '',
			title: s.title ?? '',
			subtitle: s.subtitle ?? ''
		});
	}
	for (const key of LANDING_SECTION_KEYS) {
		if (out.some((o) => o.key === key)) continue;
		const entry: SectionSetting = {
			key,
			visible: !DEFAULT_HIDDEN_KEYS.includes(key),
			kicker: '',
			title: '',
			subtitle: ''
		};
		// An der Standard-Position einfügen: nach der nächsten vorangehenden
		// Sektion (gemäss Default-Reihenfolge), die bereits in der Liste steht.
		const defaultIdx = LANDING_SECTION_KEYS.indexOf(key);
		let insertAt = 0;
		for (let i = defaultIdx - 1; i >= 0; i--) {
			const prevIdx = out.findIndex((o) => o.key === LANDING_SECTION_KEYS[i]);
			if (prevIdx >= 0) {
				insertAt = prevIdx + 1;
				break;
			}
		}
		out.splice(insertAt, 0, entry);
	}
	return { sections: out };
}

// ─── Hero ───
// Defaults = bisherige Texte aus messages/de.json (der Look ändert sich nicht,
// bis im Admin etwas angepasst wird). Heros sind benannte Presets; welches
// Preset lädt, bestimmt das aktive Theme (heroPresetId).
export const defaultHero: HeroContent = {
	presets: [
		{
			id: 'standard',
			name: 'Standard',
			variant: 'classic',
			classic: {
				titleLine1: 'Gibt es',
				titleLine2Pre: 'nur ',
				titleLine2Em: 'selten',
				sub: 'Wenn Neugier, Urteilskraft und Umsetzungsstärke wirklich zusammenkommen, entsteht etwas, das man nicht oft sieht.',
				accent: 'Eine Mischung, die trägt.',
				signature: 'Brigitte Hulliger',
				ctaLabel: 'Lass uns sprechen',
				annotations: [
					{ title: 'Neugier', sub: 'stellt Fragen' },
					{ title: 'Umsetzungsstärke', sub: 'macht es echt' },
					{ title: 'Urteilskraft', sub: 'ordnet ein' }
				]
			},
			slider: {
				titleLine1: 'KI ist überall.',
				titleAccent: 'Urteilskraft ist selten.',
				sub: 'Digitale Urteilskraft für Verwaltungsräte und Geschäftsleitungen — mehr als IT: Substanz statt Hype, erprobt statt nachgelesen.',
				left: {
					kicker: 'Im Gremium',
					title: 'Die Frage, die im Raum fehlt.',
					text: 'Betriebswirtschaft auf GL-Niveau, Governance, digitale Urteilskraft. Kein Ja-Sager.',
					image: ''
				},
				right: {
					kicker: 'Im Maschinenraum',
					title: 'Selbst erprobt, nicht nachgelesen.',
					text: 'Eigene KI-Systeme, self-hosted, im täglichen Einsatz. Sieht hinter die Fassade.',
					image: ''
				},
				caption: 'Beide Welten.',
				captionAccent: 'Dieselbe Person.',
				hint: 'zum Entdecken ziehen'
			}
		}
	]
};

// Einzelnes Preset robust mit Defaults mergen (verschachtelte Teile einzeln).
function normalizeHeroPreset(raw: Partial<HeroPreset> | undefined, fallbackId: string): HeroPreset {
	const d = defaultHero.presets[0];
	const annotations = Array.isArray(raw?.classic?.annotations)
		? d.classic.annotations.map((a, i) => ({ ...a, ...raw!.classic!.annotations[i] }))
		: d.classic.annotations;
	return {
		id: raw?.id || fallbackId,
		name: raw?.name?.trim() || 'Hero',
		variant: raw?.variant === 'slider' ? 'slider' : 'classic',
		classic: { ...d.classic, ...(raw?.classic ?? {}), annotations },
		slider: {
			...d.slider,
			...(raw?.slider ?? {}),
			left: { ...d.slider.left, ...(raw?.slider?.left ?? {}) },
			right: { ...d.slider.right, ...(raw?.slider?.right ?? {}) }
		}
	};
}

// Hero robust auflösen. Legacy-Form (einzelner Hero ohne presets-Liste)
// wird als Preset «Standard» übernommen.
export function normalizeHero(raw: unknown): HeroContent {
	const c = raw as ({ presets?: unknown } & Partial<HeroPreset>) | null | undefined;
	if (!c) return structuredClone(defaultHero);
	if (!Array.isArray(c.presets)) {
		if (c.classic || c.slider || c.variant) {
			return { presets: [normalizeHeroPreset({ ...c, id: 'standard', name: 'Standard' }, 'standard')] };
		}
		return structuredClone(defaultHero);
	}
	const presets = (c.presets as Partial<HeroPreset>[]).map((p, i) => normalizeHeroPreset(p, `hero-${i}`));
	return presets.length > 0 ? { presets } : structuredClone(defaultHero);
}

// Aktives Preset auflösen: Referenz aus dem Theme, sonst das erste.
export function resolveActiveHero(content: HeroContent, presetId?: string): HeroPreset {
	return content.presets.find((p) => p.id === presetId) ?? content.presets[0];
}

// ─── Mediathek ───
export const defaultMedia: MediaContent = { library: [] };

// Mediathek robust auflösen. Solange die Mediathek noch nie gespeichert wurde,
// dient die Legacy-Bibliothek aus dem Theme-Content als Quelle (Migration).
export function normalizeMedia(raw: unknown, legacyTheme?: ThemeContent | null): MediaContent {
	const lib = Array.isArray((raw as Partial<MediaContent>)?.library)
		? ((raw as MediaContent).library as ThemeImageAsset[])
		: null;
	if (lib) return { library: lib.filter((i) => i?.url) };
	const legacy = Array.isArray(legacyTheme?.library) ? legacyTheme.library : [];
	return { library: legacy.filter((i) => i?.url) };
}

// ─── Theme ───
export const DEFAULT_HERO_IMAGE = '/fruits/hero.png';

// Standard-Theme = aktueller Look (nichts ändert sich, bis ein Theme editiert wird).
export const defaultTheme: ThemeContent = {
	activeId: 'standard',
	library: [],
	themes: [
		{
			id: 'standard',
			name: 'Standard',
			colors: {
				primary: '#b11e2c',
				primaryDark: '#8e1622',
				ink: '#2b1a1c',
				cream: '#fbf1ec',
				soft: '#f6d9d5'
			},
			fonts: { heading: 'fraunces', body: 'inter', hand: 'shadows' },
			heroImage: DEFAULT_HERO_IMAGE,
			pillarImages: {}
		}
	]
};

// Aktives Theme robust auflösen (fällt auf das erste bzw. Standard-Theme zurück).
export function resolveActiveTheme(content: ThemeContent | null | undefined): Theme {
	const c = content ?? defaultTheme;
	const themes = Array.isArray(c.themes) && c.themes.length > 0 ? c.themes : defaultTheme.themes;
	return themes.find((t) => t.id === c.activeId) ?? themes[0];
}
