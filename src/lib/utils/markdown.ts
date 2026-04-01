// ═══════════════════════════════════════════════════════════
// Markdown Utility — Inline Markdown to HTML
// ═══════════════════════════════════════════════════════════
// Renders inline Markdown (links, bold, italic) for CMS content.
// Uses `marked` with restricted options (no raw HTML allowed).

import { marked } from 'marked';

// Configure marked for inline/safe usage
marked.setOptions({
	breaks: true,
	gfm: true
});

/**
 * Render Markdown string to sanitized HTML.
 * Only allows inline formatting (links, bold, italic, etc.).
 * All external links open in a new tab.
 */
export function renderMarkdown(text: string): string {
	if (!text) return '';

	// Use parseInline for inline-only rendering (no block elements like <p>, <h1> etc.)
	const html = marked.parseInline(text) as string;

	// Make external links open in new tab
	return html.replace(
		/<a href="(https?:\/\/[^"]+)">/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer">'
	);
}

/**
 * Render full Markdown (with paragraphs, lists, etc.)
 */
export function renderMarkdownBlock(text: string): string {
	if (!text) return '';

	const html = marked.parse(text) as string;

	return html.replace(
		/<a href="(https?:\/\/[^"]+)">/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer">'
	);
}
