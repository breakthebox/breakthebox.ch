// ═══════════════════════════════════════════════════════════
// Menü-Ziele — einzige Quelle der erlaubten Link-Ziele.
// Menü-Items (Admin) referenzieren ein Ziel per `id`; daraus wird
// der konkrete href pro Seite aufgelöst ($lib/utils/menu).
// Nur Ziele, die real existieren (Homepage-Anker bzw. Unterseiten-Routen),
// damit im Backoffice keine toten Links entstehen.
// ═══════════════════════════════════════════════════════════

export interface MenuTarget {
	id: string;
	/** 'section' = Anker auf der Startseite; 'subpage' = eigene Route. */
	kind: 'section' | 'subpage';
	/** section: Anker-Fragment (z.B. '#angebot'). */
	anchor?: string;
	/** subpage: Routen-Pfad (z.B. '/impulse'). */
	path?: string;
	/** Anzeige-/Default-Titel für Dropdown und Item-Vorbefüllung. */
	labelDe: string;
	labelEn: string;
	labelFr: string;
}

// Reihenfolge = Reihenfolge im Admin-Dropdown.
export const MENU_TARGETS: MenuTarget[] = [
	// ─── Sektionen auf der Startseite (Anker müssen auf der Homepage existieren) ───
	{ id: 'angebot', kind: 'section', anchor: '#angebot', labelDe: 'Angebot', labelEn: 'Services', labelFr: 'Offre' },
	{ id: 'about', kind: 'section', anchor: '#about', labelDe: 'Über mich', labelEn: 'About', labelFr: 'À propos' },
	{ id: 'pillars', kind: 'section', anchor: '#pillars', labelDe: 'Ansatz', labelEn: 'Approach', labelFr: 'Approche' },
	{ id: 'netzwerk', kind: 'section', anchor: '#netzwerk', labelDe: 'Netzwerk', labelEn: 'Network', labelFr: 'Réseau' },
	{ id: 'stimmen', kind: 'section', anchor: '#stimmen', labelDe: 'Stimmen', labelEn: 'Voices', labelFr: 'Témoignages' },
	{ id: 'faq', kind: 'section', anchor: '#faq', labelDe: 'Häufige Fragen', labelEn: 'FAQ', labelFr: 'FAQ' },
	{ id: 'kontakt', kind: 'section', anchor: '#kontakt', labelDe: 'Kontakt', labelEn: 'Contact', labelFr: 'Contact' },
	// ─── Unterseiten (eigene Routen) ───
	{ id: 'impulse', kind: 'subpage', path: '/impulse', labelDe: 'Impulse', labelEn: 'Insights', labelFr: 'Impulsions' },
	{ id: 'transformation', kind: 'subpage', path: '/transformation', labelDe: 'Transformation', labelEn: 'Transformation', labelFr: 'Transformation' },
	{ id: 'governance', kind: 'subpage', path: '/governance', labelDe: 'Governance', labelEn: 'Governance', labelFr: 'Gouvernance' },
	{ id: 'keynotes', kind: 'subpage', path: '/keynotes', labelDe: 'Keynotes', labelEn: 'Keynotes', labelFr: 'Keynotes' },
	{ id: 'experimentierraum', kind: 'subpage', path: '/experimentierraum', labelDe: 'Experimentierraum', labelEn: 'Lab', labelFr: 'Laboratoire' },
	{ id: 'manifest', kind: 'subpage', path: '/manifest', labelDe: 'Manifest', labelEn: 'Manifesto', labelFr: 'Manifeste' }
];

export const MENU_TARGET_IDS = MENU_TARGETS.map((t) => t.id);

export function getMenuTarget(id: string): MenuTarget | undefined {
	return MENU_TARGETS.find((t) => t.id === id);
}
