<script lang="ts">
	// Hybrid-Chat mit Miss Bizzy:
	//  • Onprem: kuratierte Q&A-Chips → sofortige, lokale Antwort (gratis, unbegrenzt).
	//  • Remote: Freitext → /api/chat → n8n-Webhook, max. 10 Fragen pro Session.
	// Bot-Antworten werden als reiner Text gerendert (kein @html) — sicher gegen XSS.
	import { onMount } from 'svelte';

	type Msg = { from: 'bot' | 'user'; text: string; error?: boolean };

	const REMOTE_LIMIT = 10;

	let open = $state(false);
	let busy = $state(false);
	let input = $state('');
	let sessionId = $state('');
	let remoteCount = $state(0);
	let messages = $state<Msg[]>([
		{
			from: 'bot',
			text: 'Hoi! Ich bin Miss Bizzy 🤖 Klick eine Frage für eine schnelle Antwort — oder tippe unten, dann antwortet mein KI-Agent live.'
		}
	]);
	let scroller = $state<HTMLElement>();
	let inputEl = $state<HTMLInputElement>();
	let timers: ReturnType<typeof setTimeout>[] = [];

	let remoteLeft = $derived(Math.max(0, REMOTE_LIMIT - remoteCount));

	// ─── Onprem: kuratierte Q&A (sofort, lokal, gratis) ───
	const qa: { q: string; a: string }[] = [
		{
			q: 'Wer bist du?',
			a: 'Ich bin ein selbstgebautes KI-Agenten-Ökosystem (n8n + spezialisierte Agenten) — für E-Mail, Controlling, Recherche und CRM. Kein Experiment, sondern täglicher Einsatz.'
		},
		{
			q: 'Was baut Brigitte sonst?',
			a: 'Ductivo (KI-Lernplattform), Ent.Orakel (Systemik-Werkzeug) und diese Website hier. Sie empfiehlt nur, was sie selbst betreibt.'
		},
		{
			q: 'Kann ich Brigitte engagieren?',
			a: 'Klar — für IT-Strategie, Governance/VR oder Keynotes. Schreib ihr an info@breakthebox.ch. Ich leite es weiter. 😉'
		},
		{
			q: 'Zeig mir was für Nerds',
			a: 'Psst… probier den Konami-Code: ↑ ↑ ↓ ↓ ← → ← → B A. Und schau mal in die Browser-Konsole. 🕹️'
		},
		{
			q: 'Bist du ein echter KI-Chat?',
			a: 'Beides! Die Kurzantworten hier sind kuratiert (schnell & gratis). Für echte Fragen tippe unten — dann antwortet mein KI-Agent live (pro Session 10 Fragen).'
		}
	];

	onMount(() => {
		try {
			sessionId = sessionStorage.getItem('mb_session') || crypto.randomUUID();
			sessionStorage.setItem('mb_session', sessionId);
			remoteCount = Number(sessionStorage.getItem('mb_remote_count')) || 0;
		} catch {
			sessionId = crypto.randomUUID();
		}
		return () => timers.forEach(clearTimeout);
	});

	function persistCount(n: number) {
		remoteCount = n;
		try {
			sessionStorage.setItem('mb_remote_count', String(n));
		} catch {
			/* sessionStorage nicht verfügbar — nur In-Memory-Zähler */
		}
	}

	function scrollSoon() {
		timers.push(
			setTimeout(() => scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' }), 40)
		);
	}

	function toggle() {
		open = !open;
		if (open) timers.push(setTimeout(() => inputEl?.focus(), 60));
	}

	// Onprem: sofortige lokale Antwort, kein Remote-Call, kein Zähler.
	function ask(item: { q: string; a: string }) {
		if (busy) return;
		messages.push({ from: 'user', text: item.q });
		busy = true;
		scrollSoon();
		timers.push(
			setTimeout(
				() => {
					busy = false;
					messages.push({ from: 'bot', text: item.a });
					scrollSoon();
				},
				Math.min(1100, 400 + item.a.length * 6)
			)
		);
	}

	// Remote: Freitext an den KI-Agenten (limitiert).
	async function send(text: string) {
		const q = text.trim();
		if (!q || busy) return;
		if (remoteLeft <= 0) {
			messages.push({
				from: 'bot',
				text: 'Für diese Session hast du das Limit von 10 Fragen an den KI-Agenten erreicht 🙏 Für mehr schreib Brigitte direkt: info@breakthebox.ch.'
			});
			scrollSoon();
			return;
		}
		if (!sessionId) sessionId = crypto.randomUUID();

		const history = messages
			.filter((m) => !m.error)
			.slice(-8)
			.map((m) => ({ role: m.from === 'bot' ? 'assistant' : 'user', content: m.text }));

		messages.push({ from: 'user', text: q });
		input = '';
		busy = true;
		scrollSoon();

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: q, history, sessionId })
			});
			const data = await res.json().catch(() => null);
			const reply = typeof data?.reply === 'string' ? data.reply : null;

			if (data?.limitReached) {
				persistCount(REMOTE_LIMIT);
			} else if (res.ok && reply && !data?.offline) {
				persistCount(remoteCount + 1);
			}

			messages.push({
				from: 'bot',
				text: reply ?? 'Da ist etwas schiefgelaufen. Versuch es bitte nochmal.',
				error: !res.ok || !reply
			});
		} catch {
			messages.push({
				from: 'bot',
				text: 'Keine Verbindung — bitte versuch es gleich nochmal.',
				error: true
			});
		} finally {
			busy = false;
			scrollSoon();
			timers.push(setTimeout(() => inputEl?.focus(), 40));
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send(input);
		}
	}
</script>

<div class="mb">
	{#if open}
		<div class="mb-panel" role="dialog" aria-label="Chat mit Miss Bizzy">
			<div class="mb-head">
				<span class="mb-avatar" aria-hidden="true">🤖</span>
				<div class="mb-head-txt">
					<strong>Miss Bizzy</strong>
					<span>KI-Agentin</span>
				</div>
				<button class="mb-close" onclick={() => (open = false)} aria-label="Chat schliessen">×</button>
			</div>

			<div class="mb-body" bind:this={scroller} aria-live="polite">
				{#each messages as msg}
					<div class="mb-msg mb-msg-{msg.from}" class:mb-msg-error={msg.error}>{msg.text}</div>
				{/each}
				{#if busy}
					<div class="mb-msg mb-msg-bot mb-typing" aria-label="Miss Bizzy schreibt">
						<span></span><span></span><span></span>
					</div>
				{/if}
			</div>

			<div class="mb-quick" aria-label="Schnellfragen">
				{#each qa as item}
					<button type="button" class="mb-chip" onclick={() => ask(item)} disabled={busy}>{item.q}</button>
				{/each}
			</div>

			<div class="mb-input">
				<input
					bind:this={inputEl}
					bind:value={input}
					onkeydown={onKey}
					type="text"
					placeholder={remoteLeft > 0 ? 'Frag den KI-Agenten…' : 'Frage-Limit erreicht'}
					aria-label="Nachricht an den KI-Agenten"
					maxlength="2000"
					disabled={busy || remoteLeft <= 0}
				/>
				<button
					type="button"
					class="mb-send"
					onclick={() => send(input)}
					disabled={busy || remoteLeft <= 0 || !input.trim()}
					aria-label="Senden"
				>→</button>
			</div>
			<p class="mb-note">
				{#if remoteLeft > 0}
					Noch {remoteLeft} von {REMOTE_LIMIT} Fragen an den KI-Agenten · Eingaben gehen an einen KI-Dienst.
				{:else}
					KI-Agent-Limit erreicht — Schnellfragen oben gehen weiter. Für mehr: info@breakthebox.ch.
				{/if}
			</p>
		</div>
	{/if}

	<button
		class="mb-fab"
		class:mb-fab-open={open}
		onclick={toggle}
		aria-label={open ? 'Chat schliessen' : 'Chat mit Miss Bizzy öffnen'}
	>
		{#if open}×{:else}<span class="mb-fab-emoji" aria-hidden="true">🤖</span> Miss Bizzy{/if}
	</button>
</div>

<style>
	.mb {
		position: fixed;
		right: 24px;
		bottom: 24px;
		z-index: var(--z-modal, 1000);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 12px;
	}
	.mb-fab {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 13px 20px;
		border: none;
		border-radius: 999px;
		background: var(--btb-steel);
		color: #fff;
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		box-shadow: 0 14px 34px -12px rgba(120, 20, 40, 0.55);
		transition: transform 0.2s, background 0.2s;
	}
	.mb-fab:hover {
		transform: translateY(-2px);
		background: var(--btb-steel-hover);
	}
	.mb-fab-open {
		width: 48px;
		height: 48px;
		justify-content: center;
		padding: 0;
		font-size: 1.4rem;
	}
	.mb-fab-emoji {
		font-size: 1.1rem;
	}
	.mb-panel {
		width: min(360px, calc(100vw - 32px));
		height: 500px;
		max-height: calc(100vh - 120px);
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 18px;
		box-shadow: 0 30px 70px -30px rgba(20, 20, 40, 0.5);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.mb-head {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		background: var(--btb-steel);
		color: #fff;
	}
	.mb-avatar {
		font-size: 1.4rem;
	}
	.mb-head-txt {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
		flex: 1;
	}
	.mb-head-txt strong {
		font-family: var(--ff-serif);
		font-size: 1rem;
	}
	.mb-head-txt span {
		font-size: 0.7rem;
		opacity: 0.85;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.mb-close {
		background: none;
		border: none;
		color: #fff;
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0.85;
	}
	.mb-close:hover {
		opacity: 1;
	}
	.mb-body {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--bg-page);
	}
	.mb-msg {
		max-width: 82%;
		padding: 10px 13px;
		border-radius: 14px;
		font-size: 0.88rem;
		line-height: 1.5;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.mb-msg-bot {
		align-self: flex-start;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		color: var(--text-primary);
		border-bottom-left-radius: 4px;
	}
	.mb-msg-user {
		align-self: flex-end;
		background: var(--btb-steel);
		color: #fff;
		border-bottom-right-radius: 4px;
	}
	.mb-msg-error {
		border-color: var(--color-error, #fb7185);
		color: var(--color-error, #fb7185);
	}
	.mb-typing {
		display: inline-flex;
		gap: 4px;
		align-items: center;
	}
	.mb-typing span {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--text-muted);
		animation: mb-bounce 1.2s infinite ease-in-out;
	}
	.mb-typing span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.mb-typing span:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes mb-bounce {
		0%,
		80%,
		100% {
			transform: translateY(0);
			opacity: 0.4;
		}
		40% {
			transform: translateY(-4px);
			opacity: 1;
		}
	}
	.mb-quick {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 10px 12px;
		border-top: 1px solid var(--border);
		background: var(--bg-surface);
	}
	.mb-chip {
		padding: 7px 12px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--bg-page);
		color: var(--text-secondary);
		font-size: 0.78rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}
	.mb-chip:hover:not(:disabled) {
		border-color: var(--btb-steel);
		color: var(--btb-steel);
	}
	.mb-chip:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.mb-input {
		display: flex;
		gap: 8px;
		padding: 10px 12px 8px;
		background: var(--bg-surface);
	}
	.mb-input input {
		flex: 1;
		min-width: 0;
		padding: 10px 14px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--bg-page);
		color: var(--text-primary);
		font-family: var(--ff-ui);
		font-size: 0.88rem;
	}
	.mb-input input:focus {
		outline: none;
		border-color: var(--btb-steel);
	}
	.mb-input input:disabled {
		opacity: 0.6;
	}
	.mb-send {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 50%;
		background: var(--btb-steel);
		color: #fff;
		font-size: 1.2rem;
		line-height: 1;
		cursor: pointer;
		transition: background 0.15s;
	}
	.mb-send:hover:not(:disabled) {
		background: var(--btb-steel-hover);
	}
	.mb-send:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.mb-note {
		margin: 0;
		padding: 0 14px 12px;
		background: var(--bg-surface);
		font-size: 0.66rem;
		color: var(--text-muted);
		line-height: 1.4;
	}
	@media (prefers-reduced-motion: reduce) {
		.mb-typing span {
			animation: none;
		}
		.mb-fab:hover {
			transform: none;
		}
	}
	@media (max-width: 560px) {
		.mb {
			right: 14px;
			bottom: 14px;
		}
	}
</style>
