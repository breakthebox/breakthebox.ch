// ═══════════════════════════════════════════════════════════
// Admin-Navigation — einzige Quelle für Sidebar UND Dashboard.
// Reihenfolge, Gruppierung, Titel und Beschreibungen leben nur hier,
// damit die beiden Navigationsflächen nie mehr auseinanderlaufen.
// `id` ist zugleich das Routen-Segment unter /admin/ und der Icon-Key.
// ═══════════════════════════════════════════════════════════

export interface AdminNavItem {
	id: string;
	title: string;
	description: string;
}

export interface AdminNavGroup {
	label: string;
	items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
	{
		label: 'Startseite',
		items: [
			{ id: 'sections', title: 'Sektionen', description: 'Reihenfolge, Sichtbarkeit und Kopftexte der Startseiten-Sektionen' },
			{ id: 'hero', title: 'Hero', description: 'Startseiten-Hero — Variante (klassisch oder Zwei-Welten-Slider) und Texte' },
			{ id: 'pillars', title: 'Pillars', description: 'Pillar-Karten — Anzahl, Reihenfolge und Inhalte' },
			{ id: 'angebot', title: 'Angebot', description: 'Angebots-Kacheln der Landing-Section «Angebot»' },
			{ id: 'about', title: 'Über mich', description: 'Texte, Qualifikationen und Rollen' },
			{ id: 'testimonials', title: 'Stimmen', description: 'Testimonials — «Fremdbild statt Eigenlob»' },
			{ id: 'references', title: 'Kundenlogos', description: 'Logos der Referenz-Marquee' },
			{ id: 'metrics', title: 'Kennzahlen', description: 'Die Kennzahlen-Leiste unterhalb der Kundenlogos' },
			{ id: 'partners', title: 'Netzwerk / Partner', description: 'Partnerfirmen mit Personen (Name, Rolle, Expertise)' }
		]
	},
	{
		label: 'Unterseiten',
		items: [
			{ id: 'transformation', title: 'Transformation', description: 'Die Service-Seite — Stufen, Spiegel, Case' },
			{ id: 'governance', title: 'Governance', description: 'Die Dossier-Seite — VR, Stiftungs- & Aufsichtsrat' },
			{ id: 'keynotes-seite', title: 'Keynotes-Seite', description: 'Redaktioneller Inhalt — Talks, USP, Formate, Lehre, CTA' },
			{ id: 'experimentierraum', title: 'Experimentierraum', description: 'Die Werkstatt-Seite — Regeln, Werkbank, Verworfen, Transfer' },
			{ id: 'manifest', title: 'Manifest', description: 'Provokante Thesen für die Scroll-Seite «Mein Manifest»' }
		]
	},
	{
		label: 'Inhalte',
		items: [
			{ id: 'blog', title: 'Blog / Impulse', description: 'Blogposts erstellen, bearbeiten und veröffentlichen' },
			{ id: 'keynotes', title: 'Keynotes / Termine', description: 'Auftritts-Termine — speist Startseite und Keynotes-Seite' },
			{ id: 'faq', title: 'Häufige Fragen (FAQ)', description: 'Alle FAQ zentral — Startseite und Unterseiten in Tabs' }
		]
	},
	{
		label: 'Einstellungen',
		items: [
			{ id: 'mediathek', title: 'Mediathek', description: 'Gemeinsame Bild-Bibliothek für alle Bild-Slots' },
			{ id: 'themes', title: 'Themes', description: 'Farben und Schriften der Website' }
		]
	}
];

// Flache Liste (z.B. für Lookups).
export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((g) => g.items);
