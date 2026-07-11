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
	ReferenceProjectsContent,
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
			title: 'Verwaltungsrat',
			note: 'Digitalkompetenz, wo es zählt',
			desc: 'Digitale Urteilskraft dauerhaft im Gremium: Ich stelle die unbequemen Fragen, gehe in Vorleistung und bewahre vor teuren Fehlentscheiden. Verantwortung nach OR 716a.',
			tags: ['VR-Mandate', 'IT-Governance', 'OR 716a', 'Digital-Aufsicht'],
			examples: [],
			subpageUrl: '/vr'
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
