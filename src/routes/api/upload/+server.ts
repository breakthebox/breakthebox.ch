// ═══════════════════════════════════════════════════════════
// Image Upload API
// ═══════════════════════════════════════════════════════════
// POST: Upload an image file, returns the URL.
// Only authenticated admins can upload.

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

export const POST: RequestHandler = async ({ request, locals }) => {
	// Auth check
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Zugriff verweigert.');
	}

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const section = formData.get('section') as string | null;

	if (!file || !file.size) {
		throw error(400, 'Keine Datei ausgewählt.');
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		throw error(400, 'Ungültiges Dateiformat. Erlaubt: JPG, PNG, WebP, SVG, GIF.');
	}

	if (file.size > MAX_FILE_SIZE) {
		throw error(400, 'Datei ist zu gross (max. 5 MB).');
	}

	// Generate unique filename
	const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
	const timestamp = Date.now();
	const prefix = section ? `${section}-` : '';
	const filename = `${prefix}header-${timestamp}.${ext}`;

	// Ensure upload directory exists
	const uploadPath = path.resolve(UPLOAD_DIR);
	if (!existsSync(uploadPath)) {
		await mkdir(uploadPath, { recursive: true });
	}

	// Write file
	const buffer = Buffer.from(await file.arrayBuffer());
	const filePath = path.join(uploadPath, filename);
	await writeFile(filePath, buffer);

	// Return the URL to access the file
	const url = `/api/uploads/${filename}`;

	return json({ url, filename });
};
