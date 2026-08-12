// ═══════════════════════════════════════════════════════════
// Site-Konstanten — eine Quelle für Domain und Titel
// ═══════════════════════════════════════════════════════════
// Kanonische Domain ist www.brigittehulliger.ch. `PUBLIC_APP_URL` überschreibt
// sie (Dev, Staging); der Fallback greift, wenn die Variable fehlt.

import { env } from '$env/dynamic/public';

export const SITE_URL = (env.PUBLIC_APP_URL || 'https://www.brigittehulliger.ch').replace(/\/$/, '');

export const SITE_NAME = 'Break the Box';

/** Gemeinsamer Titel-Suffix aller öffentlichen Seiten. */
export const TITLE_SUFFIX = 'Brigitte Hulliger | Break the Box';

/** Vollständiger `<title>` einer Unterseite: "Kontakt — Brigitte Hulliger | Break the Box". */
export function pageTitle(title: string): string {
	return `${title} — ${TITLE_SUFFIX}`;
}
