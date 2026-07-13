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
				<a href="/admin/sections" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 4.5h12M3 9h12M3 13.5h12"/></svg>
					Sektionen
				</a>
				<a href="/admin/hero" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="12" height="12" rx="2"/><path d="M3 11.5h12M6 6.5h3"/></svg>
					Hero
				</a>
				<a href="/admin/mediathek" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="12" height="12" rx="2"/><circle cx="6.8" cy="6.8" r="1.4"/><path d="M15 11l-3.5-3.5L4 15"/></svg>
					Mediathek
				</a>
				<a href="/admin/themes" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="6.5"/><circle cx="6.3" cy="7" r="0.9" fill="currentColor" stroke="none"/><circle cx="9" cy="5.6" r="0.9" fill="currentColor" stroke="none"/><circle cx="11.7" cy="7" r="0.9" fill="currentColor" stroke="none"/><path d="M9 15.5c1.4 0 2-.9 2-1.8 0-1.2-1.4-1.2-1.4-2.2 0-.6.5-1 1.2-1"/></svg>
					Themes
				</a>
				<a href="/admin/pillars" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h4v4H4zM10 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4z"/></svg>
					Pillars
				</a>
				<a href="/admin/angebot" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h12M3 9h12M3 12h8"/><path d="M3 3h12"/></svg>
					Angebot
				</a>
				<a href="/admin/about" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16c0-3 2.7-5 6-5s6 2 6 5"/></svg>
					Über mich
				</a>
				<a href="/admin/manifest" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 3h8l2 2v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M6 7h6M6 10h6M6 13h4"/></svg>
					Manifest
				</a>
				<a href="/admin/experimentierraum" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 3v4L3 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1L11 7V3"/><path d="M6 3h6"/></svg>
					Experimentierraum
				</a>
				<a href="/admin/testimonials" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8l-4 3V5a1 1 0 0 1 1-1z"/></svg>
					Stimmen
				</a>
				<a href="/admin/transformation" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="12" height="10" rx="1.5"/><path d="M3 8h12M9 4v10"/></svg>
					Transformation
				</a>
				<a href="/admin/governance" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 3v12M4 6h10M5.5 6l-2.2 4.5a2.2 2.2 0 0 0 4.4 0zM12.5 6l-2.2 4.5a2.2 2.2 0 0 0 4.4 0z"/></svg>
					Governance
				</a>
				<a href="/admin/references" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3h12v12H3z"/><path d="M3 7h12M7 3v12"/></svg>
					Kundenlogos
				</a>
				<a href="/admin/metrics" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 15V9M7 15V4M11 15v-6M15 15V7"/></svg>
					Kennzahlen
				</a>
				<a href="/admin/partners" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="2.5"/><circle cx="12" cy="6" r="2.5"/><path d="M2.5 15c0-2 1.6-3.5 3.5-3.5S9.5 13 9.5 15M8.5 15c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5"/></svg>
					Netzwerk
				</a>
				<a href="/admin/keynotes" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2a2.3 2.3 0 0 1 2.3 2.3v4a2.3 2.3 0 0 1-4.6 0v-4A2.3 2.3 0 0 1 9 2z"/><path d="M4.7 8.3a4.3 4.3 0 0 0 8.6 0M9 12.6V16M6.5 16h5"/></svg>
					Keynotes / Termine
				</a>
				<a href="/admin/keynotes-seite" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="12" height="12" rx="2"/><path d="M6 6.5h6M6 9h6M6 11.5h3.5"/></svg>
					Keynotes-Seite
				</a>
				<a href="/admin/blog" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 3h10v12H4z"/><path d="M7 6h4M7 9h4M7 12h2"/></svg>
					Blog
				</a>
				<a href="/admin/faq" class="admin-sidebar-link">
					<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="7"/><path d="M7 7a2 2 0 1 1 2.5 1.9c-.5.2-.5.6-.5 1.1"/><path d="M9 13h.01"/></svg>
					Häufige Fragen
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
