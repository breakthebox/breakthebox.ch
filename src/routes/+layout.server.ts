// ═══════════════════════════════════════════════════════════
// Root Layout — Server Load (aktives Theme, site-wide)
// ═══════════════════════════════════════════════════════════
// Lädt das aktive Theme (Farben + Bilder) für ALLE Seiten. Fällt bei
// Fehlern (z.B. DB nicht erreichbar) auf das Standard-Theme zurück, damit
// Seiten ohne eigenen DB-Load (z.B. Login) weiter funktionieren.

import type { LayoutServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { resolveActiveTheme } from '$lib/server/content-defaults';
import type { ThemeContent } from '$lib/types/content';

export const load: LayoutServerLoad = async () => {
	try {
		const content = await getSectionContent<ThemeContent>('theme');
		return { theme: resolveActiveTheme(content) };
	} catch {
		return { theme: resolveActiveTheme(null) };
	}
};
