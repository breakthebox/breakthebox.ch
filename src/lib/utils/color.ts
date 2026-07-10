// Farb-Utilities für Theme-Ableitungen. Hex-Mischung in JS statt CSS
// color-mix, damit abgeleitete Töne auch in Inline-Styles und im
// <head>-injizierten Theme-CSS als konkrete Werte landen.

/** Nur gültige Hex-Farben durchlassen, sonst Fallback (verhindert CSS-Injection). */
export function safeColor(value: string | undefined, fallback: string): string {
	return value && /^#[0-9a-fA-F]{3,8}$/.test(value.trim()) ? value.trim() : fallback;
}

function toRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '');
	const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
	const n = parseInt(full, 16);
	if (Number.isNaN(n) || full.length !== 6) return [177, 30, 44];
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mischt zwei Hex-Farben; weightA = Anteil von `a` (0–1). */
export function mixHex(a: string, b: string, weightA: number): string {
	const ra = toRgb(a);
	const rb = toRgb(b);
	const w = Math.min(1, Math.max(0, weightA));
	return (
		'#' +
		ra
			.map((v, i) => Math.round(v * w + rb[i] * (1 - w)))
			.map((v) => v.toString(16).padStart(2, '0'))
			.join('')
	);
}

/** Helle Akzentfläche aus der Primärfarbe ableiten (Fallback, wenn «soft» im Theme fehlt). */
export function softFromPrimary(primary: string): string {
	return mixHex(primary, '#ffffff', 0.16);
}
