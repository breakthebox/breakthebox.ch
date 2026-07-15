<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { BlogPostRow } from '$lib/server/db/queries/blog';
	import SiteNav from '$lib/components/ui/SiteNav.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import ContactBand from '$lib/components/ui/ContactBand.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';

	let { data } = $props();
	const posts = data.posts as BlogPostRow[];

	const home = localizeHref('/');
	const navLinks = [
		{ href: `${home}#angebot`, label: m.nav_services() },
		{ href: `${home}#about`, label: m.nav_about() },
		{ href: localizeHref('/impulse'), label: m.nav_blog() }
	];

	// Neuster Beitrag prominent, der Rest als Jahres-Archiv.
	const featured = posts[0] ?? null;
	const rest = posts.slice(1);

	// Gruppierung nach Jahr (absteigend) — Lücken werden Struktur, nicht Makel.
	const byYear: [number, BlogPostRow[]][] = (() => {
		const groups = new Map<number, BlogPostRow[]>();
		for (const p of rest) {
			const y = p.publishDate ? new Date(p.publishDate).getFullYear() : 0;
			if (!groups.has(y)) groups.set(y, []);
			groups.get(y)!.push(p);
		}
		return [...groups.entries()].sort((a, b) => b[0] - a[0]);
	})();

	const MONTHS = [
		'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
		'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
	];
	function monthYear(date: Date | string | null): string {
		if (!date) return '';
		const d = new Date(date);
		return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
	}
</script>

<svelte:head>
	<title>Impulse — Brigitte Hulliger | Break the Box</title>
	<meta name="description" content={m.blog_hero_lead()} />
</svelte:head>

<div class="impulse">
	<ScrollProgress />
	<SiteNav theme={data.theme} links={navLinks} subtitle="Impulse" />

	<!-- ═══════ Hero ═══════ -->
	<header class="hero">
		<div class="wrap">
			<span class="kick">{m.blog_hero_kicker()}</span>
			<h1 class="md">{@html renderMarkdown(m.blog_hero_title())}</h1>
			<p class="sub">{m.blog_hero_lead()}</p>
			<span class="principle">{m.blog_principle()}</span>
		</div>
	</header>

	{#if posts.length === 0}
		<section class="block">
			<div class="wrap"><p class="empty">{m.blog_empty_state()}</p></div>
		</section>
	{:else}
		<!-- ═══════ Featured (neuster Impuls) ═══════ -->
		{#if featured}
			<section class="block feat-block">
				<div class="wrap">
					<a class="featured" class:has-img={!!featured.headerImage} href={localizeHref(`/impulse/${featured.slug}`)}>
						{#if featured.headerImage}
							<div class="featured-img"><img src={featured.headerImage} alt={featured.title} loading="lazy" decoding="async" /></div>
						{/if}
						<div class="featured-body">
							<span class="fk">★ {m.blog_featured_label()}</span>
							<h2>{featured.title}</h2>
							{#if featured.excerpt}<p>{featured.excerpt}</p>{/if}
							<div class="meta">
								<span class="d">{monthYear(featured.publishDate)}</span>
								{#each featured.tags as tag}<span class="tag">{tag}</span>{/each}
								<span class="more">{m.blog_read_more()} →</span>
							</div>
						</div>
					</a>
				</div>
			</section>
		{/if}

		<!-- ═══════ Jahres-Archiv ═══════ -->
		{#if byYear.length}
			<section class="block archive">
				<div class="wrap">
					{#each byYear as [year, items]}
						<div class="yr">{year}</div>
						{#each items as post}
							<a class="post" class:has-thumb={!!post.headerImage} href={localizeHref(`/impulse/${post.slug}`)}>
								{#if post.headerImage}
									<div class="post-thumb"><img src={post.headerImage} alt={post.title} loading="lazy" decoding="async" /></div>
								{/if}
								<div class="post-body">
									<h3>{post.title}</h3>
									{#if post.excerpt}<p>{post.excerpt}</p>{/if}
									{#if post.tags.length}
										<div class="tags">{#each post.tags as tag}<span class="tag">{tag}</span>{/each}</div>
									{/if}
								</div>
								<span class="post-date">{monthYear(post.publishDate)}</span>
							</a>
						{/each}
					{/each}
				</div>
			</section>
		{/if}

		<!-- ═══════ Warum-Notiz ═══════ -->
		<section class="block why-block">
			<div class="wrap">
				<div class="why">
					<b>{m.blog_why_title()}</b>
					<p>{m.blog_why_text()}</p>
				</div>
			</div>
		</section>
	{/if}

	<ContactBand />
	<SiteFooter />
</div>

<style>
	.impulse {
		--imp-accent: var(--btb-steel);
		--imp-accent-strong: var(--btb-steel-hover);
		--imp-accent-soft: var(--btb-teal-light);
		--imp-ink: var(--text-heading);
		--imp-line: var(--border);
		--imp-muted: var(--text-muted);
		--imp-graphite: var(--text-secondary);

		background: var(--bg-page);
		color: var(--text-primary);
		min-height: 100vh;
	}
	.wrap {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* Akzent-Auszeichnung aus Markdown */
	.md :global(strong),
	.md :global(em) {
		color: var(--imp-accent);
		font-weight: 700;
		font-style: normal;
	}

	/* ─── Section-Grundlagen ─── */
	.block {
		padding: 40px 0;
	}
	.kick {
		display: block;
		font-family: var(--ff-ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--imp-accent);
		margin-bottom: 14px;
	}

	/* ─── Hero ─── */
	.hero {
		padding: 72px 0 32px;
	}
	.hero h1 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1.1;
		max-width: 20ch;
		color: var(--text-heading);
	}
	.hero .sub {
		color: var(--imp-graphite);
		font-size: 1.02rem;
		line-height: 1.65;
		max-width: 54ch;
		margin: 18px 0 0;
	}
	.principle {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		margin-top: 22px;
		padding: 9px 18px;
		border: 1.5px dashed color-mix(in srgb, var(--imp-accent) 45%, transparent);
		border-radius: 100px;
		font-family: var(--ff-ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--imp-accent-strong);
		background: color-mix(in srgb, var(--imp-accent) 5%, transparent);
	}

	/* ─── Featured ─── */
	.feat-block {
		padding-top: 8px;
	}
	.featured {
		display: block;
		background: var(--bg-surface);
		border: 1px solid var(--imp-line);
		border-left: 4px solid var(--imp-accent);
		border-radius: 16px;
		overflow: hidden;
		text-decoration: none;
		color: var(--text-primary);
		box-shadow: var(--shadow-card);
		transition: transform 0.15s, border-color 0.2s;
	}
	.featured:hover {
		transform: translateY(-3px);
		border-left-color: var(--imp-accent-strong);
	}
	.featured.has-img {
		display: grid;
		grid-template-columns: 340px 1fr;
		align-items: stretch;
	}
	.featured-img {
		overflow: hidden;
		border-right: 1px solid var(--imp-line);
	}
	.featured-img img {
		width: 100%;
		height: 100%;
		min-height: 220px;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}
	.featured:hover .featured-img img {
		transform: scale(1.03);
	}
	.featured-body {
		padding: 30px 34px;
	}
	.fk {
		display: block;
		font-family: var(--ff-ui);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--imp-accent-strong);
		margin-bottom: 12px;
	}
	.featured h2 {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: clamp(1.35rem, 3.2vw, 1.8rem);
		line-height: 1.2;
		color: var(--text-heading);
		margin-bottom: 10px;
	}
	.featured p {
		color: var(--imp-graphite);
		font-size: 0.92rem;
		line-height: 1.65;
		max-width: 64ch;
	}
	.meta {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 18px;
	}
	.meta .d {
		font-family: var(--ff-ui);
		font-size: 0.75rem;
		color: var(--imp-muted);
		margin-right: 6px;
	}
	.more {
		color: var(--imp-accent-strong);
		font-weight: 600;
		font-size: 0.85rem;
		margin-left: auto;
	}
	.tag {
		font-family: var(--ff-ui);
		font-size: 0.68rem;
		color: var(--imp-graphite);
		border: 1px solid var(--imp-line);
		border-radius: 100px;
		padding: 3px 11px;
		background: var(--bg-section-alt);
	}

	/* ─── Jahres-Archiv ─── */
	.archive {
		padding-top: 8px;
	}
	.yr {
		display: flex;
		align-items: center;
		gap: 14px;
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--imp-muted);
		margin: 28px 0 6px;
	}
	.yr::after {
		content: '';
		flex-grow: 1;
		height: 1px;
		background: var(--imp-line);
	}
	.post {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 18px;
		align-items: center;
		padding: 18px 4px;
		border-bottom: 1px solid var(--imp-line);
		text-decoration: none;
		color: var(--text-primary);
	}
	.post.has-thumb {
		grid-template-columns: 108px 1fr auto;
	}
	.post-thumb {
		width: 108px;
		aspect-ratio: 4 / 3;
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid var(--imp-line);
	}
	.post-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}
	.post:hover .post-thumb img {
		transform: scale(1.04);
	}
	.post-body {
		min-width: 0;
	}
	.post h3 {
		font-family: var(--ff-serif);
		font-weight: 600;
		font-size: 1.1rem;
		line-height: 1.3;
		color: var(--text-heading);
		transition: color 0.15s;
	}
	.post:hover h3 {
		color: var(--imp-accent-strong);
	}
	.post p {
		font-size: 0.88rem;
		color: var(--imp-graphite);
		line-height: 1.55;
		max-width: 66ch;
		margin-top: 4px;
	}
	.post .tags {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		margin-top: 10px;
	}
	.post-date {
		font-family: var(--ff-ui);
		font-size: 0.78rem;
		color: var(--imp-muted);
		white-space: nowrap;
		align-self: start;
		padding-top: 2px;
	}

	/* ─── Warum-Notiz ─── */
	.why-block {
		padding-top: 8px;
		padding-bottom: 56px;
	}
	.why {
		border-left: 3px solid var(--imp-accent);
		background: var(--bg-section-alt);
		border-radius: 0 14px 14px 0;
		padding: 20px 24px;
	}
	.why b {
		display: block;
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--text-heading);
		margin-bottom: 6px;
	}
	.why p {
		font-size: 0.9rem;
		line-height: 1.65;
		color: var(--imp-graphite);
		max-width: 66ch;
	}

	.empty {
		text-align: center;
		color: var(--imp-muted);
		padding: 40px 0;
	}

	/* ─── Responsive ─── */
	@media (max-width: 720px) {
		.featured.has-img {
			grid-template-columns: 1fr;
		}
		.featured-img {
			border-right: none;
			border-bottom: 1px solid var(--imp-line);
		}
		.featured-img img {
			min-height: 0;
			aspect-ratio: 16 / 9;
		}
	}
	@media (max-width: 560px) {
		.wrap {
			padding: 0 18px;
		}
		.post.has-thumb {
			grid-template-columns: 84px 1fr;
		}
		.post-thumb {
			width: 84px;
		}
		.post-date {
			display: none;
		}
	}
</style>
