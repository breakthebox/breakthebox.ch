// ═══════════════════════════════════════════════════════════
// Menü-Auflösung — verwandelt die admin-verwaltete Menü-Liste in
// konkrete Nav-Links. EINE Quelle für Startseite und alle Unterseiten,
// damit keine navLinks-Arrays mehr pro Seite gepflegt werden müssen.
// ═══════════════════════════════════════════════════════════

import { localizeHref, getLocale } from '$lib/paraglide/runtime';
import { getMenuTarget } from '$lib/config/menu-targets';
import type { MenuContent, MenuItem } from '$lib/types/content';

export interface NavLink {
	href: string;
	label: string;
	active?: boolean;
}

interface ResolveOpts {
	/** Aktueller Pfad (page.url.pathname) — für den Active-State von Unterseiten. */
	currentPath: string;
	/** Ist dies die Startseite? Steuert, ob Section-Anker lokal (#x) oder als /#x zeigen. */
	isHome: boolean;
	/** Aktive Section aus dem Scroll-Spy (nur Startseite). */
	activeSection?: string;
}

function titleFor(item: MenuItem, locale: string): string {
	if (locale === 'en') return item.titleEn || item.titleDe;
	if (locale === 'fr') return item.titleFr || item.titleDe;
	return item.titleDe;
}

/**
 * Löst die Menü-Liste in Nav-Links für die aktuelle Seite und Sprache auf.
 * Unbekannte Ziele und leere Titel werden übersprungen.
 */
export function resolveMenuLinks(
	menu: MenuContent | null | undefined,
	{ currentPath, isHome, activeSection = '' }: ResolveOpts
): NavLink[] {
	const locale = getLocale();
	const home = localizeHref('/');
	const links: NavLink[] = [];

	for (const item of menu?.items ?? []) {
		const target = getMenuTarget(item.target);
		if (!target) continue;
		const label = titleFor(item, locale).trim();
		if (!label) continue;

		if (target.kind === 'section') {
			const anchor = target.anchor ?? '';
			links.push({
				href: isHome ? anchor : `${home}${anchor}`,
				label,
				active: isHome && activeSection === target.id
			});
		} else {
			const href = localizeHref(target.path ?? '/');
			links.push({
				href,
				label,
				active: !isHome && currentPath.startsWith(href)
			});
		}
	}

	return links;
}
