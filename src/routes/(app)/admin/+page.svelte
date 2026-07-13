<script lang="ts">
	import { adminNavGroups } from '$lib/config/admin-nav';
	import AdminNavIcon from '$lib/components/admin/AdminNavIcon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard — Break the Box</title>
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<h1>Dashboard</h1>
		<p class="dashboard-subtitle">Willkommen, {data.user.name}. Hier kannst du die Inhalte deiner Website verwalten.</p>
	</div>

	{#each adminNavGroups as group}
		<section class="dash-group">
			<h2 class="dash-group-title">{group.label}</h2>
			<div class="sections-grid">
				{#each group.items as item}
					<a href="/admin/{item.id}" class="section-card">
						<span class="section-icon"><AdminNavIcon id={item.id} /></span>
						<div>
							<h3>{item.title}</h3>
							<p>{item.description}</p>
						</div>
						<span class="section-arrow">&rarr;</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.dashboard-header {
		margin-bottom: 36px;
	}
	.dashboard-header h1 {
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.dashboard-subtitle {
		font-size: 0.92rem;
		color: var(--text-secondary);
	}

	.dash-group {
		margin-bottom: 32px;
	}
	.dash-group-title {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 12px;
	}

	.sections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 12px;
	}
	.section-card {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 20px;
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card-lg);
		text-decoration: none;
		transition: box-shadow 0.2s, border-color 0.2s;
	}
	.section-card:hover {
		box-shadow: var(--shadow-card-hover);
		border-color: var(--btb-steel);
	}
	.section-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--bg-elevated);
		border: 1.5px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--btb-steel);
	}
	.section-card h3 {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-heading);
		margin-bottom: 2px;
	}
	.section-card p {
		font-size: 0.8rem;
		color: var(--text-secondary);
		line-height: 1.4;
	}
	.section-arrow {
		margin-left: auto;
		font-size: 1.2rem;
		color: var(--text-muted);
		transition: color 0.2s;
	}
	.section-card:hover .section-arrow {
		color: var(--btb-steel);
	}
</style>
