// ═══════════════════════════════════════════════════════════
// Statische Bilder → WebP-Variante
// ═══════════════════════════════════════════════════════════
// Hero-Bilder können aus der DB kommen und dort noch auf die alten PNG-Pfade
// zeigen. Diese Zuordnung leitet bekannte Pfade auf die optimierte WebP-Datei
// um, ohne dass die DB angefasst werden muss. Nur Pfade, deren WebP-Datei
// tatsächlich in `static/` liegt — sonst gibt es ein totes Bild.

const STATIC_WEBP: Record<string, string> = {
	'/fruits/hero.png': '/fruits/hero.webp',
	'/spices/hero.png': '/spices/hero.webp',
	'/foto_brigitte_2025.jpg': '/foto_brigitte_2025.webp'
};

/** Optimierte Variante eines statischen Bildes, sonst der Pfad unverändert. */
export function optimizedImage(src: string): string {
	return STATIC_WEBP[src] ?? src;
}
