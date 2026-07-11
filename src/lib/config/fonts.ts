// ═══════════════════════════════════════════════════════════
// Font-Registry — wählbare Schriften pro Theme
// ═══════════════════════════════════════════════════════════
// Themes speichern nur den `key`; Familie und Google-Fonts-Spez kommen aus
// dieser Registry (kein freier CSS-Text aus der DB → keine Injection).
// Die Standard-Fonts sind in app.html fest verlinkt; alle anderen lädt das
// Root-Layout bei Bedarf über einen zusätzlichen Google-Fonts-Link nach.

export interface FontOption {
	key: string;
	label: string;
	family: string; // vollständiger CSS-Stack
	gf?: string; // Google-Fonts css2-Spez; fehlt bei Standard-Fonts (bereits geladen)
}

export interface ThemeFonts {
	heading: string; // key aus HEADING_FONTS
	body: string; // key aus BODY_FONTS
	hand: string; // key aus HAND_FONTS
}

export const DEFAULT_FONTS: ThemeFonts = { heading: 'fraunces', body: 'inter', hand: 'shadows' };

export const HEADING_FONTS: FontOption[] = [
	{ key: 'fraunces', label: 'Fraunces (Standard)', family: "'Fraunces', Georgia, serif" },
	{ key: 'playfair', label: 'Playfair Display', family: "'Playfair Display', Georgia, serif", gf: 'Playfair+Display:ital,wght@0,500;0,600;0,700;1,500' },
	{ key: 'lora', label: 'Lora', family: "'Lora', Georgia, serif", gf: 'Lora:ital,wght@0,500;0,600;0,700;1,500' },
	{ key: 'libre-baskerville', label: 'Libre Baskerville', family: "'Libre Baskerville', Georgia, serif", gf: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400' },
	{ key: 'dm-serif', label: 'DM Serif Display', family: "'DM Serif Display', Georgia, serif", gf: 'DM+Serif+Display:ital@0;1' },
	{ key: 'archivo', label: 'Archivo (Grotesk)', family: "'Archivo', system-ui, sans-serif", gf: 'Archivo:wght@500;600;700;800;900' },
	{ key: 'archivo-black', label: 'Archivo Black', family: "'Archivo Black', system-ui, sans-serif", gf: 'Archivo+Black' },
	{ key: 'space-grotesk', label: 'Space Grotesk', family: "'Space Grotesk', system-ui, sans-serif", gf: 'Space+Grotesk:wght@500;600;700' }
];

export const BODY_FONTS: FontOption[] = [
	{ key: 'inter', label: 'Inter (Standard)', family: "'Inter', -apple-system, system-ui, sans-serif" },
	{ key: 'jakarta', label: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', system-ui, sans-serif" },
	{ key: 'work-sans', label: 'Work Sans', family: "'Work Sans', system-ui, sans-serif", gf: 'Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
	{ key: 'ibm-plex', label: 'IBM Plex Sans', family: "'IBM Plex Sans', system-ui, sans-serif", gf: 'IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400' },
	{ key: 'source-sans', label: 'Source Sans 3', family: "'Source Sans 3', system-ui, sans-serif", gf: 'Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400' }
];

export const HAND_FONTS: FontOption[] = [
	{ key: 'shadows', label: 'Shadows Into Light (Standard)', family: "'Shadows Into Light', cursive" },
	{ key: 'caveat', label: 'Caveat', family: "'Caveat', cursive", gf: 'Caveat:wght@400;600' },
	{ key: 'kalam', label: 'Kalam', family: "'Kalam', cursive", gf: 'Kalam:wght@300;400' },
	{ key: 'marker', label: 'Permanent Marker', family: "'Permanent Marker', cursive", gf: 'Permanent+Marker' }
];

function pick(list: FontOption[], key: string | undefined, fallbackKey: string): FontOption {
	return list.find((f) => f.key === key) ?? list.find((f) => f.key === fallbackKey)!;
}

/** Gewählte Fonts robust auflösen (unbekannte Keys → Standard). */
export function resolveFonts(fonts: Partial<ThemeFonts> | undefined) {
	return {
		heading: pick(HEADING_FONTS, fonts?.heading, DEFAULT_FONTS.heading),
		body: pick(BODY_FONTS, fonts?.body, DEFAULT_FONTS.body),
		hand: pick(HAND_FONTS, fonts?.hand, DEFAULT_FONTS.hand)
	};
}

/** Google-Fonts-URL für alle Nicht-Standard-Fonts; null, wenn nichts nachzuladen ist. */
export function googleFontsUrl(fonts: Partial<ThemeFonts> | undefined): string | null {
	const resolved = resolveFonts(fonts);
	const specs = [resolved.heading, resolved.body, resolved.hand]
		.filter((f) => f.gf)
		.map((f) => `family=${f.gf}`);
	if (specs.length === 0) return null;
	return `https://fonts.googleapis.com/css2?${specs.join('&')}&display=swap`;
}
