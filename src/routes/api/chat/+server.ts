// ═══════════════════════════════════════════════════════════
// Miss Bizzy Chat — Server-Proxy zum n8n-Webhook
// ═══════════════════════════════════════════════════════════
// Der Browser spricht ausschliesslich mit diesem Endpoint. Die n8n-Webhook-URL
// und das Secret bleiben serverseitig, damit der Webhook nicht direkt
// missbraucht werden kann. Rate-Limit + Timeout + generische Fallbacks.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { rateLimit } from '$lib/server/rate-limit';

const MAX_MESSAGE = 2000;
const MAX_HISTORY = 8;
const TIMEOUT_MS = 25_000;

// Abuse-Schutz: pro IP begrenzt (öffentlicher Chat → LLM-Kosten).
const CHAT_MAX = 20;
const CHAT_WINDOW_MS = 5 * 60 * 1000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const OFFLINE_REPLY =
	'Miss Bizzy macht gerade Pause 🤖 — für eine echte Antwort schreib Brigitte direkt an info@breakthebox.ch.';
const ERROR_REPLY =
	'Da ist gerade etwas schiefgelaufen. Versuch es bitte nochmal — oder schreib Brigitte an info@breakthebox.ch.';
const TIMEOUT_REPLY = 'Das hat leider zu lange gedauert. Versuch es bitte gleich nochmal.';
const RATELIMIT_REPLY =
	'Uff, viele Fragen auf einmal! Gib mir kurz eine Pause — oder schreib Brigitte direkt: info@breakthebox.ch.';
const EMPTY_REPLY = 'Stell mir zuerst eine Frage 🙂';

export const POST: RequestHandler = async ({ request, getClientAddress, cookies }) => {
	// ─── Rate limit pro IP ───
	if (rateLimit(`chat:${getClientAddress()}`, CHAT_MAX, CHAT_WINDOW_MS).limited) {
		return json({ reply: RATELIMIT_REPLY }, { status: 429 });
	}

	let body: { message?: unknown; history?: unknown; sessionId?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ reply: EMPTY_REPLY }, { status: 400 });
	}

	const message = typeof body.message === 'string' ? body.message.trim() : '';
	if (!message) return json({ reply: EMPTY_REPLY }, { status: 400 });
	if (message.length > MAX_MESSAGE) {
		return json({ reply: 'Das ist mir etwas gar lang — fass es bitte kürzer zusammen.' }, { status: 400 });
	}

	const history: ChatMessage[] = Array.isArray(body.history)
		? body.history
				.filter(
					(m): m is ChatMessage =>
						!!m &&
						typeof m === 'object' &&
						((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant') &&
						typeof (m as ChatMessage).content === 'string'
				)
				.slice(-MAX_HISTORY)
				.map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE) }))
		: [];

	const webhookUrl = env.CHAT_WEBHOOK_URL;
	if (!webhookUrl) {
		return json({ reply: OFFLINE_REPLY, offline: true });
	}

	const locale = cookies.get('locale') || 'de';
	const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : undefined;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(env.CHAT_WEBHOOK_SECRET ? { 'X-BTB-Secret': env.CHAT_WEBHOOK_SECRET } : {})
			},
			body: JSON.stringify({ message, history, locale, sessionId }),
			signal: controller.signal
		});

		if (!res.ok) {
			console.error(`[chat] webhook responded ${res.status}`);
			return json({ reply: ERROR_REPLY }, { status: 502 });
		}

		const data: unknown = await res.json().catch(() => null);
		const reply =
			typeof data === 'string'
				? data
				: data && typeof data === 'object'
					? ((data as Record<string, unknown>).reply ??
						(data as Record<string, unknown>).output ??
						(data as Record<string, unknown>).text)
					: null;

		if (typeof reply !== 'string' || !reply.trim()) {
			console.error('[chat] webhook returned no usable reply');
			return json({ reply: ERROR_REPLY }, { status: 502 });
		}

		return json({ reply: reply.trim() });
	} catch (err) {
		if (err instanceof Error && err.name === 'AbortError') {
			return json({ reply: TIMEOUT_REPLY }, { status: 504 });
		}
		console.error('[chat] webhook error:', err);
		return json({ reply: ERROR_REPLY }, { status: 502 });
	} finally {
		clearTimeout(timeout);
	}
};
