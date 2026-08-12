// ═══════════════════════════════════════════════════════════
// Bestehende Uploads nachträglich optimieren
// ═══════════════════════════════════════════════════════════
// Konvertiert Rasterbilder im Upload-Verzeichnis nach WebP, begrenzt sie auf
// 1920 px Kantenlänge und schreibt die neuen Dateinamen in die Content-JSONs
// der Datenbank zurück. Neu hochgeladene Bilder werden bereits beim Upload
// konvertiert — dieses Skript holt den Altbestand nach.
//
// Ablauf:
//   1. Trockenlauf:  node scripts/optimize-uploads.js
//   2. Anwenden:     node scripts/optimize-uploads.js --apply
//
// Sicherheit:
//   - Ohne --apply wird nichts geschrieben, nur berichtet.
//   - Originaldateien bleiben liegen (nie gelöscht), damit alte Referenzen
//     aus Blogbeiträgen oder externen Links weiter funktionieren.
//   - Die DB wird nur angefasst, wenn die WebP-Datei erfolgreich entstand
//     und kleiner ist als das Original.
//
// Optionen:
//   --apply              Änderungen wirklich schreiben
//   --min-bytes=200000   nur Dateien ab dieser Grösse anfassen (Default 200 KB)

import postgres from 'postgres';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const MAX_EDGE = 1920;
const WEBP_QUALITY = 82;
const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const minBytes = Number(
	(args.find((a) => a.startsWith('--min-bytes=')) ?? '--min-bytes=200000').split('=')[1]
);

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? './uploads');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('DATABASE_URL fehlt.');
	process.exit(1);
}
if (!fs.existsSync(UPLOAD_DIR)) {
	console.error(`Upload-Verzeichnis nicht gefunden: ${UPLOAD_DIR}`);
	process.exit(1);
}

const fmt = (n) => `${(n / 1024).toFixed(0)} KB`;

async function main() {
	const files = fs
		.readdirSync(UPLOAD_DIR)
		.filter((f) => CONVERTIBLE.has(path.extname(f).toLowerCase()))
		.map((f) => ({ name: f, size: fs.statSync(path.join(UPLOAD_DIR, f)).size }))
		.filter((f) => f.size >= minBytes)
		.sort((a, b) => b.size - a.size);

	if (!files.length) {
		console.log(`Keine Dateien ab ${fmt(minBytes)} gefunden.`);
		return;
	}

	console.log(
		`${files.length} Datei(en) ab ${fmt(minBytes)} in ${UPLOAD_DIR}` +
			(apply ? '' : '  — TROCKENLAUF, es wird nichts geschrieben')
	);
	console.log('');

	/** @type {Map<string,string>} alter Dateiname → neuer Dateiname */
	const renames = new Map();
	let before = 0;
	let after = 0;

	for (const file of files) {
		const src = path.join(UPLOAD_DIR, file.name);
		const base = path.basename(file.name, path.extname(file.name));
		const targetName = `${base}.webp`;
		const target = path.join(UPLOAD_DIR, targetName);

		try {
			const input = fs.readFileSync(src);
			const pipeline = sharp(input, { failOn: 'none' }).rotate();
			const meta = await pipeline.metadata();
			const needsResize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;
			const out = needsResize
				? pipeline.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
				: pipeline;
			const buffer = await out.webp({ quality: WEBP_QUALITY }).toBuffer();

			if (buffer.length >= file.size) {
				console.log(`  = ${file.name} — bereits optimal (${fmt(file.size)}), übersprungen`);
				continue;
			}

			before += file.size;
			after += buffer.length;
			const saved = (100 * (1 - buffer.length / file.size)).toFixed(0);
			console.log(`  → ${file.name}  ${fmt(file.size)} → ${fmt(buffer.length)}  (−${saved}%)`);

			if (apply) {
				fs.writeFileSync(target, buffer);
			}
			if (targetName !== file.name) {
				renames.set(file.name, targetName);
			}
		} catch (err) {
			console.error(`  ! ${file.name} — Konvertierung fehlgeschlagen: ${err.message}`);
		}
	}

	console.log('');
	console.log(`Bilder gesamt: ${fmt(before)} → ${fmt(after)}  (−${fmt(before - after)})`);

	if (!renames.size) {
		console.log('Keine Dateinamen-Änderungen — DB bleibt unangetastet.');
		return;
	}

	// ─── DB-Referenzen umschreiben ───
	const sql = postgres(DATABASE_URL, { max: 1 });
	try {
		const rows = await sql`SELECT section, data FROM site_content`;
		let touched = 0;

		for (const row of rows) {
			let json = JSON.stringify(row.data);
			let changed = false;
			for (const [from, to] of renames) {
				if (json.includes(from)) {
					json = json.split(from).join(to);
					changed = true;
				}
			}
			if (!changed) continue;
			touched++;
			console.log(`  DB: Sektion '${row.section}' aktualisiert`);
			if (apply) {
				await sql`UPDATE site_content SET data = ${sql.json(JSON.parse(json))} WHERE section = ${row.section}`;
			}
		}

		const posts = await sql`SELECT id, slug, content, content_blocks, header_image, og_image FROM blog_posts`;
		for (const post of posts) {
			let content = post.content ?? '';
			let blocks = post.content_blocks ? JSON.stringify(post.content_blocks) : null;
			let header = post.header_image ?? null;
			let og = post.og_image ?? null;
			let changed = false;
			for (const [from, to] of renames) {
				if (content.includes(from)) {
					content = content.split(from).join(to);
					changed = true;
				}
				if (blocks?.includes(from)) {
					blocks = blocks.split(from).join(to);
					changed = true;
				}
				if (header?.includes(from)) {
					header = header.split(from).join(to);
					changed = true;
				}
				if (og?.includes(from)) {
					og = og.split(from).join(to);
					changed = true;
				}
			}
			if (!changed) continue;
			touched++;
			console.log(`  DB: Beitrag '${post.slug}' aktualisiert`);
			if (apply) {
				await sql`UPDATE blog_posts
					SET content = ${content},
					    content_blocks = ${blocks === null ? null : sql.json(JSON.parse(blocks))},
					    header_image = ${header},
					    og_image = ${og}
					WHERE id = ${post.id}`;
			}
		}

		console.log('');
		console.log(
			apply
				? `Fertig. ${touched} DB-Eintrag/Einträge aktualisiert, ${renames.size} Bild(er) konvertiert.`
				: `Trockenlauf beendet. Mit --apply würden ${touched} DB-Eintrag/Einträge und ${renames.size} Bild(er) geschrieben.`
		);
	} finally {
		await sql.end();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
