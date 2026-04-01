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
					const items = data.items as (string | { content?: string })[];
					return items.map((i) => {
						const text = typeof i === 'string' ? i : (i?.content ?? '');
						return `- ${stripHtml(text)}`;
					}).join('\n');
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

	return callClaude(systemPrompt, userMessage, { maxTokens: 256, temperature: 0.6 });
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

	const systemPrompt = `Du bist ein SEO-Analyst. Bewerte den SEO-Score eines Blogposts auf einer Skala von 0–100.

Antworte ausschliesslich als JSON-Objekt im folgenden Format:
{
  "score": <number 0-100>,
  "suggestions": [
    { "type": "title|content|meta|structure|keywords", "message": "<konkreter Verbesserungsvorschlag>", "priority": "high|medium|low" }
  ]
}

Bewertungskriterien:
- Titel-Qualität (Länge, Keywords, Ansprechend) — 20 Punkte
- Meta-Beschreibung (Vorhanden, Länge 140-160 Zeichen) — 15 Punkte
- Inhaltslänge (mind. 300 Wörter ideal, 600+ optimal) — 20 Punkte
- Strukturierung (Überschriften, Listen, Absätze) — 15 Punkte
- Medien (Bilder mit Alt-Text) — 10 Punkte
- Lesbarkeit (Satzlänge, Absatzlänge) — 10 Punkte
- Interne/externe Links — 10 Punkte

Verwende Schweizer Rechtschreibung (ss statt ß). Maximal 5 Vorschläge.`;

	const userMessage = `Titel: ${title}
Meta-Titel: ${metaTitle ?? '(nicht gesetzt)'}
Meta-Beschreibung: ${metaDescription ?? '(nicht gesetzt)'}
Wortanzahl: ${wordCount}
Bilder: ${hasImages ? 'Ja' : 'Nein'}
Überschriften: ${hasHeadings ? 'Ja' : 'Nein'}
Listen: ${hasLists ? 'Ja' : 'Nein'}

Inhalt (Auszug):
${plainText.slice(0, 3000)}`;

	const result = await callClaudeJson<SeoScoreResult>(systemPrompt, userMessage, {
		maxTokens: 1024,
		temperature: 0.3
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
		maxTokens: 2048,
		temperature: 0.5
	});
}
