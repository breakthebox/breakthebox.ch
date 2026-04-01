<script lang="ts">
	import { page } from '$app/stores';

	const errorMessages: Record<string, string> = {
		not_allowed: 'Dein Konto ist nicht für den Admin-Bereich freigeschaltet.',
		email_exists: 'Diese E-Mail ist bereits mit einem anderen Provider verknüpft.',
		callback_failed: 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.'
	};

	let errorParam = $derived($page.url.searchParams.get('error'));
	let errorMessage = $derived(errorParam ? errorMessages[errorParam] ?? 'Ein Fehler ist aufgetreten.' : null);
</script>

<svelte:head>
	<title>Anmelden — Break the Box</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<img src="/box.svg" alt="" class="login-logo" width="64" height="64" />
		<h1>Break the Box</h1>
		<p class="login-subtitle">Admin-Bereich</p>
		{#if errorMessage}
			<div class="login-error">{errorMessage}</div>
		{/if}
		<form method="POST">
			<button type="submit" class="login-btn">
				Mit Auth0 anmelden &rarr;
			</button>
		</form>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-page-dark);
		padding: 32px;
	}
	.login-card {
		background: var(--bg-surface-dark);
		border: 1px solid var(--border-dark);
		border-radius: var(--radius-card-lg);
		padding: 48px 40px;
		text-align: center;
		max-width: 400px;
		width: 100%;
	}
	.login-logo {
		margin-bottom: 16px;
		filter: invert(1) brightness(0.85);
	}
	.login-card h1 {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-heading-dark);
		margin-bottom: 4px;
	}
	.login-subtitle {
		font-family: var(--ff-sketch);
		font-size: 1.1rem;
		color: var(--btb-teal);
		margin-bottom: 32px;
	}
	.login-error {
		background: rgba(220, 53, 69, 0.1);
		border: 1px solid rgba(220, 53, 69, 0.3);
		color: #f5a3ad;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.85rem;
		margin-bottom: 20px;
		line-height: 1.5;
	}
	.login-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 14px 32px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.2s;
		width: 100%;
		justify-content: center;
	}
	.login-btn:hover {
		background: var(--btb-steel-hover);
	}
</style>
