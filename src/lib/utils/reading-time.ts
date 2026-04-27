// Lesezeit-Schätzung — 200 Wörter/Minute, mind. 1 Minute.
export function readingTimeMinutes(text: string | null | undefined): number {
	if (!text) return 1;
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
