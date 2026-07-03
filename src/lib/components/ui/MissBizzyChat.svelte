<script lang="ts">
	// Echter Chat mit Miss Bizzy: Freitext → /api/chat → n8n-Webhook.
	// Bot-Antworten werden als reiner Text gerendert (kein @html) — sicher gegen XSS.
	type Msg = { from: 'bot' | 'user'; text: string; error?: boolean };

	let open = $state(false);
	let sending = $state(false);
	let input = $state('');
	let sessionId = $state('');
	let messages = $state<Msg[]>([
		{
			from: 'bot',
			text: 'Hoi! Ich bin Miss Bizzy — Brigittes KI-Agentin. Frag mich zu IT-Strategie, KI oder Brigittes Arbeit.'
		}
	]);
	let scroller = $state<HTMLElement>();
	let inputEl = $state<HTMLInputElement>();
	let scrollTimer: ReturnType<typeof setTimeout>;

	$effect(() => () => clearTimeout(scrollTimer));

	// Gesprächseinstiege — senden echte Fragen an den Agenten.
	const starters = [
		'Was macht Brigitte genau?',
		'Wie geht ihr IT-Strategie an?',
		'Wie nutzt ihr KI konkret?',
		'Kann ich Brigitte engagieren?'
	];

	function scrollSoon() {
		scrollTimer = setTimeout(
			() => scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' }),
			40
		);
	}

	function toggle() {
		open = !open;
		if (open) setTimeout(() => inputEl?.focus(), 60);
	}

	async function send(text: string) {
		const q = text.trim();
		if (!q || sending) return;
		if (!sessionId) sessionId = crypto.randomUUID();

		// Verlauf VOR der neuen Frage (letzte 8 echten Nachrichten).
		const history = messages
			.filter((m) => !m.error)
			.slice(-8)
			.map((m) => ({ role: m.from === 'bot' ? 'assistant' : 'user', content: m.text }));

		messages.push({ from: 'user', text: q });
		input = '';
		sending = true;
		scrollSoon();

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: q, history, sessionId })
			});
			const data = await res.json().catch(() => null);
			const reply = typeof data?.reply === 'string' ? data.reply : null;
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
			sending = false;
			scrollSoon();
			setTimeout(() => inputEl?.focus(), 40);
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
				{#if sending}
					<div class="mb-msg mb-msg-bot mb-typing" aria-label="Miss Bizzy schreibt">
						<span></span><span></span><span></span>
					</div>
				{/if}

				{#if messages.length <= 1}
					<div class="mb-starters">
						{#each starters as s}
							<button type="button" class="mb-chip" onclick={() => send(s)} disabled={sending}>{s}</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="mb-input">
				<input
					bind:this={inputEl}
					bind:value={input}
					onkeydown={onKey}
					type="text"
					placeholder="Frag Miss Bizzy…"
					aria-label="Nachricht an Miss Bizzy"
					maxlength="2000"
					disabled={sending}
				/>
				<button
					type="button"
					class="mb-send"
					onclick={() => send(input)}
					disabled={sending || !input.trim()}
					aria-label="Senden"
				>→</button>
			</div>
			<p class="mb-note">Deine Eingaben werden zur Beantwortung an einen KI-Dienst gesendet.</p>
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
		height: 460px;
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
	.mb-starters {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 4px;
	}
	.mb-chip {
		padding: 7px 12px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--bg-surface);
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
		padding: 12px;
		border-top: 1px solid var(--border);
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
