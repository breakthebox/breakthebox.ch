<script lang="ts">
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { user: { name: string; email: string; avatarUrl: string | null; role: string } }; children: Snippet } = $props();
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
				<a href="/admin" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="12" height="12" rx="2"/><path d="M3 8h12"/></svg>
					Dashboard
				</a>
				<span class="admin-sidebar-divider"></span>
				<a href="/admin/pillars" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h4v4H4zM10 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4z"/></svg>
					Was ich anbiete
				</a>
				<a href="/admin/about" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16c0-3 2.7-5 6-5s6 2 6 5"/></svg>
					Über mich
				</a>
				<a href="/admin/walkthetalk" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="6"/><path d="M9 6v3l2 2"/></svg>
					Walk the Talk
				</a>
				<a href="/admin/references" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3h12v12H3z"/><path d="M3 7h12M7 3v12"/></svg>
					Kunden & Partner
				</a>
				<a href="/admin/blog" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 3h10v12H4z"/><path d="M7 6h4M7 9h4M7 12h2"/></svg>
					Blog
				</a>
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
	.admin-sidebar-divider {
		display: block;
		height: 1px;
		background: var(--border);
		margin: 8px 0;
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
