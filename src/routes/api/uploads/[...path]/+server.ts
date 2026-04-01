// ═══════════════════════════════════════════════════════════
// Serve Uploaded Files
// ═══════════════════════════════════════════════════════════
// Serves files from the uploads directory with proper MIME types.

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './uploads';

const MIME_TYPES: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	svg: 'image/svg+xml',
	gif: 'image/gif'
};

export const GET: RequestHandler = async ({ params }) => {
	const filePath = params.path;

	if (!filePath) {
		throw error(404, 'Datei nicht gefunden.');
	}

	// Prevent path traversal
	const sanitized = path.basename(filePath);
	const fullPath = path.join(path.resolve(UPLOAD_DIR), sanitized);

	if (!existsSync(fullPath)) {
		throw error(404, 'Datei nicht gefunden.');
	}

	const ext = sanitized.split('.').pop()?.toLowerCase() ?? '';
	const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

	const buffer = await readFile(fullPath);

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
