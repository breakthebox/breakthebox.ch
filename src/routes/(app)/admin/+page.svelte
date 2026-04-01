<script lang="ts">
	let { data } = $props();

	const sections = [
		{
			id: 'pillars',
			title: 'Was ich anbiete',
			description: '4 Pillar-Karten mit Beschreibungen, Tags und Praxisbeispielen',
			icon: '◆'
		},
		{
			id: 'about',
			title: 'Über mich',
			description: 'Texte, Qualifikationen und Rollen',
			icon: '◎'
		},
		{
			id: 'walkthetalk',
			title: 'Ich verstehe, wovon ich rede',
			description: 'KI-Plattform-Karten und Miss Bizzy',
			icon: '⚡'
		},
		{
			id: 'references',
			title: 'Kunden & Partner',
			description: 'Kundenlogos verwalten',
			icon: '★'
		},
		{
			id: 'blog',
			title: 'Blog',
			description: 'Blogposts erstellen, bearbeiten und veröffentlichen',
			icon: '✎'
		}
	];
</script>

<svelte:head>
	<title>Admin Dashboard — Break the Box</title>
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<h1>Dashboard</h1>
		<p class="dashboard-subtitle">Willkommen, {data.user.name}. Hier kannst du die Inhalte deiner Website verwalten.</p>
	</div>

	<div class="sections-grid">
		{#each sections as section}
			<a href="/admin/{section.id}" class="section-card">
				<span class="section-icon">{section.icon}</span>
				<div>
					<h3>{section.title}</h3>
					<p>{section.description}</p>
				</div>
				<span class="section-arrow">&rarr;</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.dashboard-header {
		margin-bottom: 40px;
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

	.sections-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.section-card {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 24px;
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
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--bg-elevated);
		border: 1.5px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		flex-shrink: 0;
	}
	.section-card h3 {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-heading);
		margin-bottom: 2px;
	}
	.section-card p {
		font-size: 0.82rem;
		color: var(--text-secondary);
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
