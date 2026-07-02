<script lang="ts">
	// Scripted Demo-Chat mit Miss Bizzy — kein Backend, keine Kosten, kein Missbrauch.
	type Msg = { from: 'bot' | 'user'; text: string };

	let open = $state(false);
	let typing = $state(false);
	let messages = $state<Msg[]>([
		{
			from: 'bot',
			text: 'Hoi! Ich bin Miss Bizzy — Brigittes KI-Agentin. (Demo-Modus 🤖) Frag mich was:'
		}
	]);
	let scroller = $state<HTMLElement>();

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
			a: 'Hier nicht — das ist eine kuratierte Demo (keine Kosten, kein Blödsinn). Das echte Miss-Bizzy-System läuft privat im Hintergrund.'
		}
	];

	function scrollSoon() {
		setTimeout(() => scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' }), 40);
	}

	function ask(item: { q: string; a: string }) {
		if (typing) return;
		messages.push({ from: 'user', text: item.q });
		typing = true;
		scrollSoon();
		const delay = Math.min(1400, 500 + item.a.length * 7);
		setTimeout(() => {
			typing = false;
			messages.push({ from: 'bot', text: item.a });
			scrollSoon();
		}, delay);
	}
</script>

<div class="mb">
	{#if open}
		<div class="mb-panel" role="dialog" aria-label="Chat mit Miss Bizzy">
			<div class="mb-head">
				<span class="mb-avatar" aria-hidden="true">🤖</span>
				<div class="mb-head-txt">
					<strong>Miss Bizzy</strong>
					<span>KI-Agentin · Demo</span>
				</div>
				<button class="mb-close" onclick={() => (open = false)} aria-label="Chat schliessen">×</button>
			</div>

			<div class="mb-body" bind:this={scroller}>
				{#each messages as msg}
					<div class="mb-msg mb-msg-{msg.from}">{msg.text}</div>
				{/each}
				{#if typing}
					<div class="mb-msg mb-msg-bot mb-typing" aria-label="Miss Bizzy schreibt">
						<span></span><span></span><span></span>
					</div>
				{/if}
			</div>

			<div class="mb-quick">
				{#each qa as item}
					<button type="button" class="mb-chip" onclick={() => ask(item)} disabled={typing}>{item.q}</button>
				{/each}
			</div>
		</div>
	{/if}

	<button class="mb-fab" class:mb-fab-open={open} onclick={() => (open = !open)} aria-label={open ? 'Chat schliessen' : 'Chat mit Miss Bizzy öffnen'}>
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
		padding: 12px;
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
