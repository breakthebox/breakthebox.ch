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
	BlogContent
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
			]
		}
	]
};

export const defaultAbout: AboutContent = {
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
	videoLabel: 'mein CV in 2 Minuten'
};

export const defaultWalkTheTalk: WalkTheTalkContent = {
	platforms: [
		{
			key: 'ductivo',
			name: 'Ductivo',
			sketch: 'KI-Tutor «Duci» — Hinweise statt Lösungen',
			desc: 'KI-gestützte Lernplattform für Projektmanagement-Ausbildung an Schweizer Hochschulen. Scaffolding-Tutor begleitet Studierende durch den PM-Lebenszyklus.',
			url: 'https://ductivo.app',
			image: '/platforms/ductivo.png'
		},
		{
			key: 'entorakel',
			name: 'Ent.Orakel',
			sketch: 'Systemik erfahrbar machen',
			desc: 'Interaktives Systemik-Werkzeug. Macht komplexe Zusammenhänge sichtbar mit DCIA-Matrix, Szenarien, Wirkungsgefüge und Frühwarnindikatoren.',
			url: 'https://entorakel.app',
			image: '/platforms/entorakel.png'
		},
		{
			key: 'marketing',
			name: 'marketing-strategy.ai',
			sketch: 'Strategie als lebendiger Prozess',
			desc: 'KI-gestützte Marketing-Strategien nach Lombriser/Abplanalp. 10 Bausteine von der Analyse bis zur Balanced Scorecard mit Cockpit.',
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
