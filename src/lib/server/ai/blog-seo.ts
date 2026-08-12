// ═══════════════════════════════════════════════════════════
// Blog SEO — AI-Powered SEO Analysis and Optimization
// ═══════════════════════════════════════════════════════════

import { callClaude, callClaudeJson } from './claude';
import type { BlogContentBlocks, SeoScoreResult, SeoOptimizationResult } from '$lib/types/content';

/**
 * Extract plain text from Editor.js blocks for AI analysis.
 */
function blocksToPlainText(blocks: BlogContentBlocks): string {
	return blocks.blocks
		.map((block) => {
			const data = block.data as Record<string, unknown>;
			switch (block.type) {
				case 'paragraph':
				case 'header':
				case 'quote':
					return stripHtml(data.text as string ?? '');
				case 'list': {
					const items = data.items as string[];
					return items.map((i) => `- ${stripHtml(i)}`).join('\n');
				}
				case 'code':
					return data.code as string ?? '';
				default:
					return '';
			}
		})
		.filter(Boolean)
		.join('\n\n');
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '');
}

/**
 * Generate an SEO-optimized meta description from blog content.
 */
export async function generateMetaDescription(
	title: string,
	blocks: BlogContentBlocks,
	language: string = 'de'
): Promise<string | null> {
	const plainText = blocksToPlainText(blocks);
	const langMap: Record<string, string> = {
		de: 'Deutsch (Schweizer Rechtschreibung, kein ß)',
		en: 'English',
		fr: 'Français'
	};

	const systemPrompt = `Du bist ein SEO-Spezialist. Erstelle eine Meta-Beschreibung für einen Blogpost.

Regeln:
- Sprache: ${langMap[language] ?? langMap.de}
- Exakt 140–160 Zeichen
- Enthalte das Hauptkeyword natürlich
- Verwende einen Call-to-Action oder Nutzenversprechen
- Keine Anführungszeichen um den Text
- Nur den Text der Meta-Beschreibung ausgeben, nichts anderes`;

	const userMessage = `Titel: ${title}\n\nInhalt:\n${plainText.slice(0, 2000)}`;

	return callClaude(systemPrompt, userMessage, { maxTokens: 256 });
}

/**
 * Analyze SEO score of a blog post.
 */
export async function analyzeSeoScore(
	title: string,
	blocks: BlogContentBlocks,
	metaTitle?: string,
	metaDescription?: string
): Promise<SeoScoreResult | null> {
	const plainText = blocksToPlainText(blocks);
	const wordCount = plainText.split(/\s+/).length;
	const hasImages = blocks.blocks.some((b) => b.type === 'image');
	const hasHeadings = blocks.blocks.some((b) => b.type === 'header');
	const hasLists = blocks.blocks.some((b) => b.type === 'list');

	// GEO-Signale: Sprachmodelle zitieren den Einstieg und die Zwischentitel.
	const firstParagraph = stripHtml(
		(blocks.blocks.find((b) => b.type === 'paragraph')?.data as { text?: string })?.text ?? ''
	).trim();
	const headings = blocks.blocks
		.filter((b) => b.type === 'header')
		.map((b) => stripHtml((b.data as { text?: string }).text ?? '').trim())
		.filter(Boolean);

	const systemPrompt = `Du bist SEO- und GEO-Analyst. Bewerte einen Blogpost mit zwei getrennten Werten:
"score" für klassische Suchmaschinen-Optimierung und "geoScore" für Zitierfähigkeit
in generativen Suchmaschinen (ChatGPT, Perplexity, Google AI Overviews).

Antworte ausschliesslich als JSON-Objekt im folgenden Format:
{
  "score": <number 0-100>,
  "geoScore": <number 0-100>,
  "suggestions": [
    { "type": "title|content|meta|structure|keywords|geo", "message": "<konkreter Verbesserungsvorschlag>", "priority": "high|medium|low" }
  ]
}

SEO-Bewertungskriterien ("score"):
- Titel-Qualität (Länge, Keywords, Ansprechend) — 20 Punkte
- Meta-Beschreibung (Vorhanden, Länge 140-160 Zeichen) — 15 Punkte
- Inhaltslänge (mind. 300 Wörter ideal, 600+ optimal) — 20 Punkte
- Strukturierung (Überschriften, Listen, Absätze) — 15 Punkte
- Medien (Bilder mit Alt-Text) — 10 Punkte
- Lesbarkeit (Satzlänge, Absatzlänge) — 10 Punkte
- Interne/externe Links — 10 Punkte

GEO-Bewertungskriterien ("geoScore") — entscheidend ist, ob ein Sprachmodell
einen Abschnitt wörtlich als Antwort zitieren kann:
- Antwort zuerst: Beantwortet der erste Absatz die Frage aus dem Titel bereits
  vollständig und eigenständig, ohne Vorgeplänkel? — 25 Punkte
- Zitierfähige Passagen: Gibt es in sich geschlossene Abschnitte von 40–60 Wörtern,
  die ohne umgebenden Kontext verständlich bleiben? — 20 Punkte
- Frage-Antwort-Struktur: Sind Zwischenüberschriften als echte Fragen oder klare
  Aussagen formuliert statt als Wortspiele? — 15 Punkte
- Benannte Entitäten: Werden Personen, Organisationen, Normen, Orte und Werkzeuge
  ausgeschrieben statt umschrieben ("OR 716a" statt "die gesetzliche Grundlage")? — 15 Punkte
- Konkrete Belege: Zahlen, Daten, Beispiele und Erfahrungen aus erster Hand
  statt allgemeiner Aussagen — 15 Punkte
- Eigenständigkeit: Versteht man den Beitrag ohne die übrige Website? — 10 Punkte

Gib mindestens einen Vorschlag vom Typ "geo", wenn geoScore unter 80 liegt.
Verwende Schweizer Rechtschreibung (ss statt ß). Maximal 6 Vorschläge.`;

	const userMessage = `Titel: ${title}
Meta-Titel: ${metaTitle ?? '(nicht gesetzt)'}
Meta-Beschreibung: ${metaDescription ?? '(nicht gesetzt)'}
Wortanzahl: ${wordCount}
Bilder: ${hasImages ? 'Ja' : 'Nein'}
Überschriften: ${hasHeadings ? 'Ja' : 'Nein'}
Listen: ${hasLists ? 'Ja' : 'Nein'}
Erster Absatz (${firstParagraph.split(/\s+/).filter(Boolean).length} Wörter): ${firstParagraph || '(keiner)'}
Zwischenüberschriften: ${headings.length ? headings.join(' | ') : '(keine)'}

Inhalt (Auszug):
${plainText.slice(0, 3000)}`;

	const result = await callClaudeJson<SeoScoreResult>(systemPrompt, userMessage, {
		maxTokens: 1024
	});

	return result;
}

/**
 * Optimize text content for SEO/SEA.
 */
export async function optimizeContentForSeo(
	text: string,
	targetKeywords?: string[],
	language: string = 'de'
): Promise<SeoOptimizationResult | null> {
	const langMap: Record<string, string> = {
		de: 'Deutsch (Schweizer Rechtschreibung, kein ß)',
		en: 'English',
		fr: 'Français'
	};

	const systemPrompt = `Du bist ein SEO/SEA-Texter. Optimiere den folgenden Text für Suchmaschinen.

Regeln:
- Sprache: ${langMap[language] ?? langMap.de}
- Behalte den Kern und die Aussage des Textes bei
- Verbessere die Keyword-Dichte natürlich
- Optimiere für Featured Snippets wo möglich
- Verbessere die Lesbarkeit
- Füge passende Transition-Wörter ein
${targetKeywords?.length ? `- Ziel-Keywords: ${targetKeywords.join(', ')}` : ''}

Antworte als JSON:
{
  "optimizedText": "<der optimierte Text als HTML>",
  "changes": ["<Änderung 1>", "<Änderung 2>", ...]
}`;

	return callClaudeJson<SeoOptimizationResult>(systemPrompt, `Text:\n${text}`, {
		maxTokens: 2048
	});
}
