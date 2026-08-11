// ═══════════════════════════════════════════════════════════
// Root Layout — Server Load (aktives Theme + Navigation, site-wide)
// ═══════════════════════════════════════════════════════════
// Lädt aktives Theme (Farben + Bilder) UND die admin-verwaltete Navigation
// für ALLE Seiten. Damit gibt es genau EINEN Ladepunkt für das Menü, das
// jede öffentliche Seite über data.menu bezieht. Fällt bei Fehlern (z.B. DB
// nicht erreichbar) auf Standard-Theme/-Menü zurück, damit Seiten ohne
// eigenen DB-Load (z.B. Login) weiter funktionieren.

import type { LayoutServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { resolveActiveTheme, normalizeMenu } from '$lib/server/content-defaults';
import type { ThemeContent, MenuContent } from '$lib/types/content';

export const load: LayoutServerLoad = async () => {
	try {
		const [theme, menu] = await Promise.all([
			getSectionContent<ThemeContent>('theme'),
			getSectionContent<MenuContent>('menu')
		]);
		return { theme: resolveActiveTheme(theme), menu: normalizeMenu(menu) };
	} catch {
		return { theme: resolveActiveTheme(null), menu: normalizeMenu(null) };
	}
};
