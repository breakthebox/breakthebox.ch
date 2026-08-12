// ═══════════════════════════════════════════════════════════
// Bildoptimierung für Uploads
// ═══════════════════════════════════════════════════════════
// Rasterbilder werden beim Upload nach WebP konvertiert und auf eine
// sinnvolle Maximalbreite begrenzt. Grund: unkomprimierte PNGs aus
// Bildgeneratoren wiegen schnell 2 MB pro Bild und dominieren die Ladezeit.
// SVG, GIF und PDF bleiben unangetastet.

import sharp from 'sharp';

/** Maximale Kantenlänge — deckt 2× auf allen Breakpoints ab. */
export const MAX_EDGE = 1920;

/** WebP-Qualität. 82 ist der übliche Punkt, an dem Artefakte unsichtbar bleiben. */
export const WEBP_QUALITY = 82;

const CONVERTIBLE = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function isConvertible(mimeType: string): boolean {
	return CONVERTIBLE.has(mimeType);
}

export interface OptimizeResult {
	buffer: Buffer;
	/** Dateiendung des Ergebnisses — 'webp' bei konvertierten Bildern. */
	ext: string;
	width?: number;
	height?: number;
}

/**
 * Bild nach WebP konvertieren und auf MAX_EDGE begrenzt verkleinern.
 * Kleinere Bilder werden nicht hochskaliert.
 */
export async function optimizeImage(input: Buffer): Promise<OptimizeResult> {
	const pipeline = sharp(input, { failOn: 'none' }).rotate();
	const meta = await pipeline.metadata();

	const needsResize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;
	const output = needsResize
		? pipeline.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
		: pipeline;

	const { data, info } = await output
		.webp({ quality: WEBP_QUALITY })
		.toBuffer({ resolveWithObject: true });

	return { buffer: data, ext: 'webp', width: info.width, height: info.height };
}
