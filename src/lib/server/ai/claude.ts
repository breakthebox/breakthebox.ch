// ═══════════════════════════════════════════════════════════
// Claude AI Client — Anthropic SDK Integration
// ═══════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
	if (!env.ANTHROPIC_API_KEY) return null;
	if (!client) {
		client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
	}
	return client;
}

/**
 * Call Claude with a system prompt and user message.
 * Returns the text response or null if API is unavailable.
 */
export async function callClaude(
	systemPrompt: string,
	userMessage: string,
	options?: { maxTokens?: number }
): Promise<string | null> {
	const anthropic = getClient();
	if (!anthropic) return null;

	try {
		const response = await anthropic.messages.create({
			model: 'claude-sonnet-5',
			max_tokens: options?.maxTokens ?? 1024,
			// Denken aus: deterministische SEO-Hilfstasks, kein Verbrauch des Token-Budgets.
			thinking: { type: 'disabled' },
			system: systemPrompt,
			messages: [{ role: 'user', content: userMessage }]
		});

		const textBlock = response.content.find((b) => b.type === 'text');
		return textBlock?.type === 'text' ? textBlock.text : null;
	} catch (error) {
		console.error('Claude API error:', error);
		return null;
	}
}

/**
 * Call Claude and parse JSON response.
 */
export async function callClaudeJson<T>(
	systemPrompt: string,
	userMessage: string,
	options?: { maxTokens?: number }
): Promise<T | null> {
	const text = await callClaude(systemPrompt, userMessage, options);
	if (!text) return null;

	try {
		// Extract JSON from markdown code blocks if present
		const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
		return JSON.parse(jsonMatch[1]?.trim() ?? text) as T;
	} catch {
		console.error('Failed to parse Claude JSON response:', text);
		return null;
	}
}
