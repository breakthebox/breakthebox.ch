// ═══════════════════════════════════════════════════════════
// Content-Migration: Themes, Mediathek & Hero → Produktion
// ═══════════════════════════════════════════════════════════
// Exportiert die Content-Sektionen 'theme', 'media' und 'hero' samt aller
// referenzierten Upload-Bilder in ein Bundle-Verzeichnis — und spielt das
// Bundle auf einer Zielumgebung wieder ein.
//
// Ablauf:
//   1. Lokal:      node scripts/content-migrate.js export
//                  → schreibt ./content-bundle/ (content.json + uploads/)
//   2. Übertragen: scp -r content-bundle server:/pfad/zur/app/
//   3. Produktion: DATABASE_URL=... UPLOAD_DIR=... \
//                  node scripts/content-migrate.js import --force
//
// Sicherheit:
//   - `import` ohne --force überschreibt KEINE bestehenden Sektionen
//     (legt nur fehlende an); mit --force werden sie ersetzt.
//   - updated_by wird beim Import auf NULL gesetzt (User-IDs sind
//     umgebungsspezifisch).
//   - Bild-Dateien werden nur kopiert, nie gelöscht.
//
// Optionen:
//   --sections=theme,media,hero   zu migrierende Sektionen (Default: alle drei)
//   --bundle=./content-bundle     Bundle-Verzeichnis (Export-Ziel / Import-Quelle)
//   --force                       bestehende Sektionen beim Import ersetzen

import postgres from 'postgres';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SECTIONS = ['theme', 'media', 'hero'];
const UPLOAD_URL_PREFIX = '/api/uploads/';

// ─── CLI-Argumente ───
const [, , command, ...rest] = process.argv;
const args = Object.fromEntries(
	rest
		.filter((a) => a.startsWith('--'))
		.map((a) => {
			const [k, v] = a.slice(2).split('=');
			return [k, v ?? true];
		})
);
const bundleDir = path.resolve(args.bundle ?? './content-bundle');
const sections = (typeof args.sections === 'string' ? args.sections.split(',') : DEFAULT_SECTIONS)
	.map((s) => s.trim())
	.filter(Boolean);
const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? './uploads');

if (command !== 'export' && command !== 'import') {
	console.error('Usage: node scripts/content-migrate.js <export|import> [--bundle=DIR] [--sections=a,b] [--force]');
	process.exit(1);
}

const connectionString = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/breakthebox_dev';
const sql = postgres(connectionString, { max: 1 });

// Alle /api/uploads/-Referenzen aus einem JSON-Baum einsammeln.
function collectUploadFiles(value, found = new Set()) {
	if (typeof value === 'string') {
		if (value.startsWith(UPLOAD_URL_PREFIX)) {
			const filename = decodeURIComponent(value.slice(UPLOAD_URL_PREFIX.length));
			// Nur flache Dateinamen — keine Pfad-Tricks.
			if (filename && !filename.includes('/') && !filename.includes('..')) found.add(filename);
		}
	} else if (Array.isArray(value)) {
		for (const v of value) collectUploadFiles(v, found);
	} else if (value && typeof value === 'object') {
		for (const v of Object.values(value)) collectUploadFiles(v, found);
	}
	return found;
}

async function doExport() {
	const rows = await sql`select section, data from site_content where section = any(${sections})`;
	if (rows.length === 0) {
		console.error(`Keine der Sektionen [${sections.join(', ')}] in der DB gefunden — nichts zu exportieren.`);
		process.exit(1);
	}
	const missing = sections.filter((s) => !rows.some((r) => r.section === s));
	if (missing.length > 0) {
		console.warn(`Hinweis: Sektion(en) ohne DB-Eintrag werden übersprungen: ${missing.join(', ')}`);
	}

	const data = Object.fromEntries(rows.map((r) => [r.section, r.data]));
	const files = [...collectUploadFiles(data)];

	fs.rmSync(bundleDir, { recursive: true, force: true });
	fs.mkdirSync(path.join(bundleDir, 'uploads'), { recursive: true });

	let copied = 0;
	const notFound = [];
	for (const filename of files) {
		const src = path.join(uploadDir, filename);
		if (!fs.existsSync(src)) {
			notFound.push(filename);
			continue;
		}
		fs.copyFileSync(src, path.join(bundleDir, 'uploads', filename));
		copied++;
	}

	fs.writeFileSync(
		path.join(bundleDir, 'content.json'),
		JSON.stringify({ exportedAt: new Date().toISOString(), sections: data }, null, 2)
	);

	console.log(`Export → ${bundleDir}`);
	console.log(`  Sektionen: ${Object.keys(data).join(', ')}`);
	console.log(`  Bilder:    ${copied} kopiert (${files.length} referenziert)`);
	if (notFound.length > 0) {
		console.warn(`  FEHLEND im Upload-Verzeichnis (${uploadDir}):`);
		for (const f of notFound) console.warn(`    - ${f}`);
	}
	console.log('\nNächste Schritte:');
	console.log('  scp -r content-bundle <server>:/pfad/zur/app/');
	console.log('  auf dem Server: DATABASE_URL=... UPLOAD_DIR=... node scripts/content-migrate.js import --force');
}

async function doImport() {
	const manifestPath = path.join(bundleDir, 'content.json');
	if (!fs.existsSync(manifestPath)) {
		console.error(`Kein Bundle gefunden unter ${manifestPath} — zuerst exportieren.`);
		process.exit(1);
	}
	const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
	const toImport = Object.entries(manifest.sections).filter(([s]) => sections.includes(s));

	// 1) Bilder kopieren (nur hinzufügen/ersetzen, nie löschen)
	const bundleUploads = path.join(bundleDir, 'uploads');
	let copied = 0;
	if (fs.existsSync(bundleUploads)) {
		fs.mkdirSync(uploadDir, { recursive: true });
		for (const filename of fs.readdirSync(bundleUploads)) {
			fs.copyFileSync(path.join(bundleUploads, filename), path.join(uploadDir, filename));
			copied++;
		}
	}

	// 2) Sektionen upserten
	const existingRows = await sql`select section from site_content where section = any(${toImport.map(([s]) => s)})`;
	const existing = new Set(existingRows.map((r) => r.section));

	const results = [];
	for (const [section, data] of toImport) {
		if (existing.has(section) && !args.force) {
			results.push(`  ~ ${section}: existiert bereits — übersprungen (mit --force ersetzen)`);
			continue;
		}
		await sql`
			insert into site_content (section, data, updated_at, updated_by)
			values (${section}, ${sql.json(data)}, now(), null)
			on conflict (section) do update
				set data = excluded.data, updated_at = now(), updated_by = null
		`;
		results.push(`  ✓ ${section}: ${existing.has(section) ? 'ersetzt' : 'angelegt'}`);
	}

	console.log(`Import ← ${bundleDir} (exportiert: ${manifest.exportedAt})`);
	console.log(`  Bilder: ${copied} nach ${uploadDir} kopiert`);
	for (const r of results) console.log(r);
}

try {
	if (command === 'export') await doExport();
	else await doImport();
} catch (error) {
	console.error(`${command} fehlgeschlagen:`, error);
	process.exitCode = 1;
} finally {
	await sql.end();
}
