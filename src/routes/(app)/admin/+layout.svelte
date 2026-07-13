<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { adminNavGroups } from '$lib/config/admin-nav';
	import AdminNavIcon from '$lib/components/admin/AdminNavIcon.svelte';

	let { data, children }: { data: { user: { name: string; email: string; avatarUrl: string | null; role: string } }; children: Snippet } = $props();

	// Aktiver Pfad für Hervorhebung (exakter Match je Bereich).
	let current = $derived(page.url.pathname.replace(/\/$/, ''));
</script>

<div class="admin-layout">
	<nav class="admin-nav">
		<div class="admin-nav-inner">
			<a href="/" class="admin-nav-logo">
				<img src="/box.svg" alt="" width="28" height="28" />
				<span>Break the Box</span>
				<span class="admin-badge">Admin</span>
			</a>
			<div class="admin-nav-right">
				<div class="admin-user">
					{#if data.user.avatarUrl}
						<img src={data.user.avatarUrl} alt="" class="admin-user-avatar" />
					{/if}
					<span class="admin-user-name">{data.user.name}</span>
				</div>
				<form method="POST" action="/auth/logout">
					<button type="submit" class="admin-logout-btn">Abmelden</button>
				</form>
			</div>
		</div>
	</nav>

	<div class="admin-body">
		<aside class="admin-sidebar">
			<nav class="admin-sidebar-nav">
				<a href="/admin" class="admin-sidebar-link" class:active={current === '/admin'}>
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="12" height="12" rx="2"/><path d="M3 8h12"/></svg>
					Dashboard
				</a>
				{#each adminNavGroups as group}
					<span class="admin-sidebar-heading">{group.label}</span>
					{#each group.items as item}
						<a href="/admin/{item.id}" class="admin-sidebar-link" class:active={current === `/admin/${item.id}`}>
							<AdminNavIcon id={item.id} />
							{item.title}
						</a>
					{/each}
				{/each}
			</nav>
		</aside>
		<main class="admin-main">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.admin-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-page);
	}

	/* ═══════ ADMIN NAV ═══════ */
	.admin-nav {
		background: var(--navy);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
	}
	.admin-nav-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 24px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.admin-nav-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: #fff;
		font-weight: 700;
		font-size: 0.95rem;
	}
	.admin-nav-logo img {
		filter: invert(1) brightness(0.9);
	}
	.admin-badge {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 2px 8px;
		border-radius: 4px;
		background: var(--btb-teal);
		color: #fff;
	}
	.admin-nav-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.admin-user {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.admin-user-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		object-fit: cover;
	}
	.admin-user-name {
		font-size: 0.82rem;
		color: rgba(255, 255, 255, 0.6);
	}
	.admin-logout-btn {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.5);
		padding: 6px 14px;
		border-radius: 6px;
		font-size: 0.78rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.admin-logout-btn:hover {
		border-color: rgba(255, 255, 255, 0.3);
		color: #fff;
	}

	/* ═══════ ADMIN BODY ═══════ */
	.admin-body {
		display: flex;
		flex: 1;
	}
	.admin-sidebar {
		width: 240px;
		background: var(--bg-surface);
		border-right: 1px solid var(--border);
		padding: 24px 16px;
		flex-shrink: 0;
	}
	.admin-sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.admin-sidebar-link {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border-radius: 8px;
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--text-secondary);
		transition: all 0.15s;
	}
	.admin-sidebar-link:hover {
		background: var(--bg-elevated);
		color: var(--text-heading);
	}
	.admin-sidebar-link.active {
		background: var(--btb-steel-subtle);
		color: var(--btb-steel-hover);
		font-weight: 600;
	}
	.admin-sidebar-heading {
		display: block;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 0 14px;
		margin: 18px 0 6px;
	}
	.admin-main {
		flex: 1;
		padding: 32px 40px;
		max-width: 1100px;
	}

	@media (max-width: 768px) {
		.admin-sidebar {
			display: none;
		}
		.admin-main {
			padding: 24px 16px;
		}
		.admin-user-name {
			display: none;
		}
	}
</style>
