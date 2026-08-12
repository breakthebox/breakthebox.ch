// ═══════════════════════════════════════════════════════════
// Root Layout — Server Load (aktives Theme + Navigation, site-wide)
// ═══════════════════════════════════════════════════════════
// Lädt aktives Theme (Farben + Bilder), die admin-verwaltete Navigation UND
// die Kopftexte des Kontakt-Bands für ALLE Seiten. Damit gibt es genau EINEN
// Ladepunkt je Sache; das Kontakt-Band steht auf jeder Unterseite und zieht
// seine Texte aus derselben Sektions-Konfiguration wie die Startseite.
// Fällt bei Fehlern (z.B. DB nicht erreichbar) auf Standardwerte zurück,
// damit Seiten ohne eigenen DB-Load (z.B. Login) weiter funktionieren.

import type { LayoutServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { resolveActiveTheme, normalizeMenu, normalizeSections } from '$lib/server/content-defaults';
import type { ThemeContent, MenuContent, SectionsContent, SectionSetting } from '$lib/types/content';

function kontaktSetting(raw: SectionsContent): SectionSetting {
	return (
		raw.sections.find((s) => s.key === 'kontakt') ?? {
			key: 'kontakt',
			visible: true,
			kicker: '',
			title: '',
			subtitle: ''
		}
	);
}

export const load: LayoutServerLoad = async () => {
	try {
		const [theme, menu, sections] = await Promise.all([
			getSectionContent<ThemeContent>('theme'),
			getSectionContent<MenuContent>('menu'),
			getSectionContent<SectionsContent>('sections')
		]);
		return {
			theme: resolveActiveTheme(theme),
			menu: normalizeMenu(menu),
			kontakt: kontaktSetting(normalizeSections(sections))
		};
	} catch {
		return {
			theme: resolveActiveTheme(null),
			menu: normalizeMenu(null),
			kontakt: kontaktSetting(normalizeSections(null))
		};
	}
};
