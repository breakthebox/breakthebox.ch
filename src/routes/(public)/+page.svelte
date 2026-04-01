<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { PillarsContent, AboutContent, WalkTheTalkContent, ReferencesContent, BlogContent } from '$lib/types/content';
	import type { BlogPostRow } from '$lib/server/db/queries/blog';
	import { renderMarkdown } from '$lib/utils/markdown';
	import { Coffee } from 'lucide-svelte';

	let { data } = $props();

	// Content from DB (with fallback to defaults in server load)
	const pillars: PillarsContent = data.pillars;
	const about: AboutContent = data.about;
	const walkthetalk: WalkTheTalkContent = data.walkthetalk;
	const references: ReferencesContent = data.references;
	const blog: BlogContent = data.blog;
	const latestPosts: BlogPostRow[] = data.latestPosts ?? [];
	const hasRealPosts = latestPosts.length > 0;

	// Split clients into two rows for marquee
	const refHalf = Math.ceil(references.clients.length / 2);
	const refRow1 = references.clients.slice(0, refHalf);
	const refRow2 = references.clients.slice(refHalf);

	function pickRandom<T>(arr: T[], max: number): T[] {
		if (arr.length <= max) return arr;
		const shuffled = [...arr].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, max);
	}

	const pillarFlipHints: Record<string, () => string> = {
		strategy: m.pillar_flip_hint_strategy,
		governance: m.pillar_flip_hint_governance,
		teaching: m.pillar_flip_hint_teaching,
		innovation: m.pillar_flip_hint_innovation
	};

	function getPillarExamples(pillar: typeof pillars.pillars[0]) {
		if (pillar.key === 'governance') return pillar.examples;
		return pickRandom(pillar.examples, 3);
	}

	let flipped = $state(pillars.pillars.map(() => false));
	let navScrolled = $state(false);
	let activeSection = $state('');

	function toggleFlip(index: number) {
		flipped[index] = !flipped[index];
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleFlip(index);
		}
	}

	// Scroll-aware nav: shadow + active section
	$effect(() => {
		function onScroll() {
			navScrolled = window.scrollY > 20;

			// Determine active section
			const sectionIds = ['pillars', 'about', 'walkthetalk', 'references', 'blog', 'contact'];
			let current = '';
			for (const id of sectionIds) {
				const el = document.getElementById(id);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= 120) current = id;
				}
			}
			activeSection = current;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Intersection Observer for reveal animations
	$effect(() => {
		const elements = document.querySelectorAll('.reveal');
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);
		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});

	// Count-up animation for metric numbers
	$effect(() => {
		const metricsEl = document.querySelector('.metrics-inner');
		if (!metricsEl) return;

		let animated = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !animated) {
					animated = true;
					const numbers = metricsEl.querySelectorAll('.metric-number');
					numbers.forEach((el) => {
						const text = el.textContent ?? '';
						const suffix = text.replace(/[\d]/g, '');
						const target = parseInt(text.replace(/\D/g, ''), 10);
						if (isNaN(target)) return;
						el.textContent = '0' + suffix;
						const duration = 1200;
						const start = performance.now();
						function tick(now: number) {
							const progress = Math.min((now - start) / duration, 1);
							const eased = 1 - Math.pow(1 - progress, 3);
							el.textContent = Math.round(target * eased) + suffix;
							if (progress < 1) requestAnimationFrame(tick);
						}
						requestAnimationFrame(tick);
					});
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(metricsEl);
		return () => observer.disconnect();
	});

</script>

<svelte:head>
	<title>{m.app_name()} — {m.hero_name()}</title>
	<meta name="description" content={m.hero_subline()} />
</svelte:head>

<!-- ═══════ NAVIGATION ═══════ -->
<nav class="nav" class:nav-scrolled={navScrolled}>
	<div class="nav-inner">
		<a href="/" class="nav-logo">
			<img src="/box.svg" alt="" class="nav-logo-icon" width="32" height="32" />
			<span class="nav-logo-text">Break the Box</span>
		</a>
		<div class="nav-links">
			<a href="#pillars" class:nav-active={activeSection === 'pillars'}>{m.nav_services()}</a>
			<a href="#about" class:nav-active={activeSection === 'about'}>{m.nav_about()}</a>
			<a href="#walkthetalk" class:nav-active={activeSection === 'walkthetalk'}>{m.nav_walkthetalk()}</a>
			<a href="#references" class:nav-active={activeSection === 'references'}>{m.nav_references()}</a>
			<a href="#contact" class:nav-active={activeSection === 'contact'}>{m.nav_contact()}</a>
		</div>
	</div>
</nav>

<!-- ═══════ HERO ═══════ -->
<section class="hero">
	<div class="hero-inner reveal">
		<span class="hero-badge">{m.hero_badge()}</span>
		<img src="/box.webp" alt="Break the Box" class="hero-box" />
		<h1 class="hero-title">
			{@html m.hero_name().split('.').filter(Boolean).map((word: string, i: number) => {
				const colors = ['var(--btb-steel)', 'var(--btb-teal)', 'var(--btb-steel)'];
				return `<em class="keyword-underline" style="text-decoration-color: ${colors[i]}">${word.trim()}</em>`;
			}).join('. ') + '.'}
		</h1>
		<span class="sketch-label">{m.hero_sketch_note()}</span>
		<p class="hero-subline">{m.hero_subline()}</p>
		<div class="hero-ctas">
			<a href="#contact" class="btn-primary">{m.hero_cta_primary()} &rarr;</a>
			<a href="#pillars" class="btn-secondary">{m.hero_cta_secondary()}</a>
		</div>
	</div>
	<!-- Sketch panorama: "this is my world" -->
	<div class="hero-sketch" aria-hidden="true">
		<img src="/this_is_my_world.svg" alt="" class="hero-sketch-img" />
	</div>
	<!-- Animated clouds landscape at bottom -->
	<div class="hero-clouds" aria-hidden="true">
		<div class="hero-clouds-track">
			<img src="/clouds.svg" alt="" class="hero-clouds-img" /><img src="/clouds.svg" alt="" class="hero-clouds-img" /><img src="/clouds.svg" alt="" class="hero-clouds-img" /><img src="/clouds.svg" alt="" class="hero-clouds-img" />
		</div>
	</div>
</section>

<!-- ═══════ METRICS BAR ═══════ -->
<section class="metrics">
	<div class="metrics-inner reveal-stagger">
		<div class="metric reveal" style="--stagger: 0">
			<span class="metric-number">10</span>
			<span class="metric-label">{m.metrics_years()}</span>
		</div>
		<div class="metric reveal" style="--stagger: 1">
			<span class="metric-number">50+</span>
			<span class="metric-label">{m.metrics_clients()}</span>
		</div>
		<div class="metric reveal" style="--stagger: 2">
			<span class="metric-number">3</span>
			<span class="metric-label">{m.metrics_vr()}</span>
		</div>
		<div class="metric reveal" style="--stagger: 3">
			<span class="metric-number">2</span>
			<span class="metric-label">{m.metrics_universities()}</span>
		</div>
		<div class="metric reveal" style="--stagger: 4">
			<span class="metric-number">80+</span>
			<span class="metric-label">{m.metrics_projects()}</span>
		</div>
	</div>
</section>

<!-- ═══════ FOUR PILLARS ═══════ -->
<section id="pillars" class="section-light">
	<div class="container">
		<span class="sketch-label reveal">{m.section_pillars_label()}</span>
		<h2 class="section-title reveal">
			{@html m.section_pillars_title().replace(
				/Perspektiven|Perspectives|perspectives/,
				'<em class="keyword-underline" style="text-decoration-color: var(--btb-teal)">$&</em>'
			)}
		</h2>
		<p class="section-subtitle reveal">{m.section_pillars_subtitle()}</p>
		<div class="pillars-grid reveal-stagger">
			{#each pillars.pillars as pillar, i}
				<div
					class="pillar-flip reveal"
					style="--stagger: {i}"
					class:is-flipped={flipped[i]}
					onclick={() => toggleFlip(i)}
					onkeydown={(e) => handleKeydown(e, i)}
					role="button"
					tabindex="0"
					aria-label="{pillar.title} — {m.pillar_flip_hint()}"
				>
					<div class="pillar-flip-inner">
						<div class="pillar-front">
							{#if pillar.image}
								<div class="pillar-card-image">
									<img src={pillar.image} alt={pillar.title} />
								</div>
							{/if}
							<h3>{pillar.title}</h3>
							<span class="pillar-note">{pillar.note}</span>
							<p class="pillar-desc-md">{@html renderMarkdown(pillar.desc)}</p>
							<div class="pillar-tags">
								{#each pillar.tags as tag}
									<span class="pillar-tag">{tag}</span>
								{/each}
							</div>
							<span class="pillar-flip-hint">{(pillarFlipHints[pillar.key] ?? m.pillar_flip_hint)()} &rarr;</span>
						</div>
						<div class="pillar-back">
							<span class="pillar-back-label">{(pillarFlipHints[pillar.key] ?? m.pillar_flip_hint)()}</span>
							<div class="pillar-examples">
								{#each getPillarExamples(pillar) as example}
									{#if example.url}
										<a href={example.url} class="pillar-example pillar-example-link" onclick={(e) => e.stopPropagation()}>
											<span class="pillar-example-label">{example.label}</span>
											<span class="pillar-example-desc">{example.desc}</span>
											<svg class="pillar-example-arrow" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 2l4 4-4 4"/></svg>
										</a>
									{:else}
										<div class="pillar-example">
											<span class="pillar-example-label">{example.label}</span>
											<span class="pillar-example-desc">{example.desc}</span>
										</div>
									{/if}
								{/each}
							</div>
							<span class="pillar-flip-back">&larr; {m.pillar_flip_back()}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════ WAVY DIVIDER ═══════ -->
<div class="wavy-divider" aria-hidden="true">
	<svg viewBox="0 0 1440 50" preserveAspectRatio="none">
		<path d="M0,30 C360,60 720,0 1080,30 C1260,50 1380,15 1440,30 L1440,50 L0,50 Z" fill="var(--bg-page-dark)"/>
	</svg>
</div>

<!-- ═══════ ABOUT ═══════ -->
<section id="about" class="section-dark">
	<div class="container about-grid">
		<div class="about-content reveal">
			<span class="sketch-label sketch-label-dark">{m.section_about_label()}</span>
			<h2 class="section-title section-title-dark">
				{@html m.section_about_title().replace(
					m.section_about_highlight(),
					`<em class="keyword-underline" style="text-decoration-color: var(--btb-teal)">${m.section_about_highlight()}</em>`
				)}
			</h2>
			{#each about.texts as text}
				<p class="about-text">{text}</p>
			{/each}
			<div class="about-quals">
				{#each about.qualifications as qual}
					<span class="about-qual">{qual}</span>
				{/each}
			</div>
			<div class="about-social">
				<a href="https://www.linkedin.com/in/bhulliger/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="about-social-link">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
					<span>LinkedIn</span>
				</a>
				<a href="https://www.instagram.com/brigitte.hulliger/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="about-social-link">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					<span>Instagram</span>
				</a>
			</div>
		</div>
		<div class="about-sidebar reveal">
			<div class="about-avatar">
				<img src="/avatar_bhu.svg" alt="Brigitte Hulliger" class="avatar-img" />
			</div>
			<span class="about-sketch-note">{m.about_sketch_note()}</span>
			<!-- CV Video -->
			<div class="about-video">
				<span class="about-video-label">{about.videoLabel}</span>
				<div class="about-video-wrapper">
					<iframe
						src="https://www.youtube-nocookie.com/embed/uCzVUW3xY8I"
						title="CV Brigitte Hulliger"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
			<div class="about-roles">
				{#each about.roles as role, i}
					<div class="role-card">
						<span class="role-tag" class:role-tag-teal={i % 2 === 0}>{role.title}</span>
						<span class="role-name">{role.org}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- ═══════ WAVY DIVIDER (dark → light) ═══════ -->
<div class="wavy-divider wavy-divider-reverse" aria-hidden="true">
	<svg viewBox="0 0 1440 50" preserveAspectRatio="none">
		<path d="M0,20 C360,-10 720,50 1080,20 C1260,0 1380,35 1440,20 L1440,0 L0,0 Z" fill="var(--bg-page-dark)"/>
	</svg>
</div>

<!-- ═══════ WALK THE TALK / INNOVATION ═══════ -->
<section id="walkthetalk" class="section-light">
	<div class="container">
		<span class="sketch-label reveal">{m.section_walkthetalk_label()}</span>
		<h2 class="section-title reveal">{m.section_walkthetalk_title()}</h2>
		<p class="section-subtitle reveal">{m.section_walkthetalk_subtitle()}</p>
		<div class="inno-grid reveal-stagger">
			{#each walkthetalk.platforms as platform, pi}
				<div class="inno-card reveal" style="--stagger: {pi}">
					<div class="inno-card-accent"></div>
					{#if platform.image}
						<img src={platform.image} alt={platform.name} class="inno-card-image" />
					{/if}
					<h3 class="inno-card-name">{platform.name}</h3>
					<span class="inno-card-sketch">{platform.sketch}</span>
					<p class="inno-card-desc">{platform.desc}</p>
					{#if platform.url}
						<a href={platform.url} target="_blank" rel="noopener noreferrer" class="inno-card-link">
							{m.walkthetalk_visit_platform()} →
						</a>
					{/if}
				</div>
			{/each}
		</div>
		<!-- Avatar accent -->
		<div class="section-avatar section-avatar-right" aria-hidden="true">
			<img src="/avatar2_bhu.svg" alt="" />
		</div>
		<!-- Miss Bizzy proof card -->
		<div class="inno-proof reveal">
			<div>
				<h4>{walkthetalk.missbizzy.title}</h4>
				<span class="inno-proof-sketch">{walkthetalk.missbizzy.sketch}</span>
				<p>{walkthetalk.missbizzy.desc}</p>
				{#if walkthetalk.missbizzy.url}
					<a href={walkthetalk.missbizzy.url} target="_blank" rel="noopener noreferrer" class="inno-proof-link">
						{m.walkthetalk_learn_more()} →
					</a>
				{/if}
			</div>
			{#if walkthetalk.missbizzy.image}
				<img src={walkthetalk.missbizzy.image} alt={walkthetalk.missbizzy.title} class="inno-proof-image" />
			{/if}
		</div>
	</div>
</section>

<!-- ═══════ WAVY DIVIDER ═══════ -->
<div class="wavy-divider" aria-hidden="true">
	<svg viewBox="0 0 1440 50" preserveAspectRatio="none">
		<path d="M0,30 C360,60 720,0 1080,30 C1260,50 1380,15 1440,30 L1440,50 L0,50 Z" fill="var(--bg-page-dark)"/>
	</svg>
</div>

<!-- ═══════ REFERENCES ═══════ -->
<section id="references" class="section-dark">
	<div class="container">
		<span class="sketch-label sketch-label-dark reveal">{m.section_references_label()}</span>
		<h2 class="section-title section-title-dark reveal">{m.section_references_title()}</h2>
	</div>
	<div class="marquee-wrapper reveal">
		<div class="marquee-track marquee-left">
			{#each [0, 1] as _dup}
				<div class="marquee-content" aria-hidden={_dup === 1}>
					{#each refRow1 as client}
						{#if client.websiteUrl}
							<a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" class="logo-item logo-item-link">
								{#if client.logoUrl}
									<img src={client.logoUrl} alt={client.name} class="logo-item-img" />
								{:else}
									<span class="logo-item-text">{client.name}</span>
								{/if}
							</a>
						{:else}
							<span class="logo-item">
								{#if client.logoUrl}
									<img src={client.logoUrl} alt={client.name} class="logo-item-img" />
								{:else}
									<span class="logo-item-text">{client.name}</span>
								{/if}
							</span>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
		<div class="marquee-track marquee-right">
			{#each [0, 1] as _dup}
				<div class="marquee-content" aria-hidden={_dup === 1}>
					{#each refRow2 as client}
						{#if client.websiteUrl}
							<a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" class="logo-item logo-item-link">
								{#if client.logoUrl}
									<img src={client.logoUrl} alt={client.name} class="logo-item-img" />
								{:else}
									<span class="logo-item-text">{client.name}</span>
								{/if}
							</a>
						{:else}
							<span class="logo-item">
								{#if client.logoUrl}
									<img src={client.logoUrl} alt={client.name} class="logo-item-img" />
								{:else}
									<span class="logo-item-text">{client.name}</span>
								{/if}
							</span>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════ WAVY DIVIDER (dark → light) ═══════ -->
<div class="wavy-divider wavy-divider-reverse" aria-hidden="true">
	<svg viewBox="0 0 1440 50" preserveAspectRatio="none">
		<path d="M0,20 C360,-10 720,50 1080,20 C1260,0 1380,35 1440,20 L1440,0 L0,0 Z" fill="var(--bg-page-dark)"/>
	</svg>
</div>

<!-- ═══════ BLOG ═══════ -->
<section id="blog" class="section-light">
	<div class="container">
		<span class="sketch-label reveal">{m.section_blog_label()}</span>
		<h2 class="section-title reveal">{m.section_blog_title()}</h2>
		<div class="blog-grid reveal">
			{#if hasRealPosts}
				{#each latestPosts as post, i}
					<a href={localizeHref(`/blog/${post.slug}`)} class="blog-card">
						{#if post.headerImage}
							<img src={post.headerImage} alt="" class="blog-card-img" />
						{:else}
							<div class="blog-card-img blog-card-img-{i + 1}"></div>
						{/if}
						<div class="blog-card-body">
							{#if post.tags.length > 0}
								<span class="blog-card-tag">{post.tags.join(' · ')}</span>
							{/if}
							<h3 class="blog-card-title">{post.title}</h3>
							{#if post.excerpt}
								<p class="blog-card-excerpt">{post.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			{:else}
				{#each blog.posts as post, i}
					<div class="blog-card">
						<div class="blog-card-img blog-card-img-{i + 1}"></div>
						<div class="blog-card-body">
							<span class="blog-card-tag">{post.tag}</span>
							<h3 class="blog-card-title">{post.title}</h3>
							<p class="blog-card-excerpt">{post.excerpt}</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<div class="blog-all-link">
			<a href={localizeHref('/blog')}>{m.blog_all_posts()} &rarr;</a>
		</div>
	</div>
</section>

<!-- ═══════ WAVY DIVIDER ═══════ -->
<div class="wavy-divider" aria-hidden="true">
	<svg viewBox="0 0 1440 50" preserveAspectRatio="none">
		<path d="M0,30 C360,60 720,0 1080,30 C1260,50 1380,15 1440,30 L1440,50 L0,50 Z" fill="var(--navy)"/>
	</svg>
</div>

<!-- ═══════ CTA / CONTACT ═══════ -->
<section id="contact" class="section-navy">
	<div class="container cta-content">
		<div class="section-avatar section-avatar-left" aria-hidden="true">
			<img src="/avatar3_bhu.svg" alt="" />
		</div>
		<span class="sketch-label sketch-label-dark reveal">{m.section_contact_label()}</span>
		<h2 class="cta-title reveal">{m.section_cta_title()}</h2>
		<p class="cta-text reveal">{m.section_cta_text()}</p>
		<span class="contact-sketch-note">{m.contact_sketch()} <Coffee size={20} strokeWidth={2} class="contact-coffee-icon" /></span>
		<div class="contact-methods reveal">
			<div class="contact-method">
				<span class="contact-method-label">{m.contact_email_label()}</span>
				<a href="mailto:info@breakthebox.ch">info@breakthebox.ch</a>
			</div>
			<div class="contact-method">
				<span class="contact-method-label">{m.contact_phone_label()}</span>
				<a href="tel:+41763092088">+41 76 309 20 88</a>
			</div>
		</div>
		<a href="mailto:info@breakthebox.ch" class="btn-cta">{m.cta_contact()} &rarr;</a>
	</div>
</section>

<!-- ═══════ FOOTER ═══════ -->
<footer class="footer">
	<div class="footer-inner">
		<!-- Spalte 1: Brand + Tagline -->
		<div class="footer-col footer-col-brand">
			<div class="footer-brand">
				<img src="/box.svg" alt="Break the Box" width="28" height="28" class="footer-cube" />
				<span class="footer-name">Break the Box</span>
			</div>
			<span class="footer-tagline">{m.footer_tagline()}</span>
			<div class="footer-social">
				<a href="https://www.linkedin.com/company/break-the-box-gmbh" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="footer-social-link">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
				</a>
				<a href="https://www.instagram.com/breakthebox_ch/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="footer-social-link">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
				</a>
				<a href="https://www.youtube.com/channel/UC1b1A2dUD8zVEtwah1de2zQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="footer-social-link">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
				</a>
			</div>
		</div>

		<!-- Spalte 2: Adresse -->
		<div class="footer-col footer-col-address">
			<span class="footer-col-title">Kontakt</span>
			<address class="footer-address">
				Break the Box GmbH<br />
				Mülibüüne 4<br />
				3422 Kirchberg
			</address>
			<a href="mailto:info@breakthebox.ch" class="footer-contact-link">info@breakthebox.ch</a>
		</div>

		<!-- Spalte 3: Rechtliches -->
		<div class="footer-col footer-col-legal">
			<span class="footer-col-title">Rechtliches</span>
			<nav class="footer-legal-nav">
				<a href={localizeHref('/impressum')}>{m.footer_impressum()}</a>
				<a href={localizeHref('/datenschutz')}>{m.footer_datenschutz()}</a>
				<a href={localizeHref('/agb')}>{m.footer_agb()}</a>
			</nav>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="footer-bottom">
		<span>&copy; {new Date().getFullYear()} Break the Box GmbH</span>
		<a href="/auth/login" class="footer-admin-link">Admin</a>
	</div>
</footer>

<style>
	/* ═══════ NAV ═══════ */
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-sticky);
		background: rgba(245, 245, 242, 0.92);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}
	.nav-scrolled {
		border-bottom-color: var(--border);
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
	}
	.nav-inner {
		max-width: 1160px;
		margin: 0 auto;
		padding: 0 32px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.nav-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: var(--text-heading);
		font-weight: 800;
		font-size: 1.05rem;
		letter-spacing: -0.02em;
	}
	.nav-logo-icon {
		width: 32px;
		height: 32px;
		display: block;
	}
	.nav-logo-text {
		font-family: var(--ff-ui);
	}
	.nav-links {
		display: flex;
		gap: 28px;
	}
	.nav-links a {
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-secondary);
		transition: color var(--t-fast);
	}
	.nav-links a:hover {
		color: var(--btb-steel);
	}
	.nav-links a.nav-active {
		color: var(--btb-steel);
		font-weight: 600;
	}

	/* ═══════ HERO ═══════ */
	.hero {
		position: relative;
		padding: 100px 32px 180px;
		text-align: center;
		overflow: hidden;
	}
	.hero-inner {
		max-width: 720px;
		margin: 0 auto;
		position: relative;
		z-index: 3;
	}
	.hero-badge {
		display: inline-block;
		font-family: var(--ff-sketch);
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--btb-steel);
		margin-bottom: 16px;
	}
	.hero-box {
		display: block;
		width: 140px;
		height: auto;
		margin: 0 auto 16px;
	}
	.hero-title {
		font-size: clamp(2.4rem, 5vw, 3.4rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--text-heading);
		margin-bottom: 12px;
	}
	.hero-subline {
		font-size: 1.05rem;
		color: var(--text-secondary);
		max-width: 560px;
		margin: 0 auto 36px;
		line-height: 1.6;
	}
	.hero-ctas {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}
	.hero-sketch {
		position: absolute;
		bottom: 80px;
		right: 2%;
		pointer-events: none;
		z-index: 3;
		display: none;
	}
	.hero-sketch-img {
		width: 240px;
		height: auto;
	}
	/* Sketch only visible on wide screens where it won't overlap text */
	@media (min-width: 1200px) {
		.hero-sketch {
			display: block;
		}
	}
	@media (min-width: 1400px) {
		.hero-sketch-img {
			width: 280px;
		}
	}
	.hero-clouds {
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		pointer-events: none;
		z-index: 2;
		overflow: hidden;
		height: 140px;
	}
	.hero-clouds-track {
		display: flex;
		position: absolute;
		bottom: 0;
		left: 0;
		animation: clouds-drift 120s linear infinite;
		will-change: transform;
	}
	.hero-clouds-img {
		display: block;
		flex-shrink: 0;
		height: 140px;
		width: auto;
	}

	@keyframes clouds-drift {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-25%);
		}
	}

	/* ═══════ KEYWORD UNDERLINE (Brand Signature) ═══════ */
	:global(.keyword-underline) {
		text-decoration: underline;
		text-decoration-thickness: 3px;
		text-underline-offset: 4px;
		font-style: italic;
	}

	/* ═══════ SKETCH LABEL (Brand Signature) ═══════ */
	.sketch-label {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--btb-teal);
		margin-bottom: 8px;
	}
	.sketch-label-dark {
		color: var(--btb-teal-light);
	}

	/* ═══════ BUTTONS ═══════ */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 12px 28px;
		background: var(--btb-steel);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 0.88rem;
		text-decoration: none;
		transition: background var(--t-fast), transform var(--t-fast), box-shadow var(--t-fast);
		cursor: pointer;
	}
	.btn-primary:hover {
		background: var(--btb-steel-hover);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(82, 122, 152, 0.25);
	}
	.btn-primary:active {
		transform: translateY(0);
	}
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 11px 28px;
		background: transparent;
		color: var(--text-primary);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-button);
		font-family: var(--ff-ui);
		font-weight: 500;
		font-size: 0.88rem;
		text-decoration: none;
		transition: border-color var(--t-fast), transform var(--t-fast);
		cursor: pointer;
	}
	.btn-secondary:hover {
		border-color: var(--btb-steel);
		transform: translateY(-1px);
	}
	.btn-secondary:active {
		transform: translateY(0);
	}
	.btn-cta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 14px 32px;
		background: var(--btb-teal);
		color: #fff;
		border: none;
		border-radius: var(--radius-button);
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		transition: background var(--t-fast), transform var(--t-fast), box-shadow var(--t-fast);
		cursor: pointer;
		margin-top: 32px;
	}
	.btn-cta:hover {
		background: var(--btb-teal-dark);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(43, 138, 120, 0.3);
	}
	.btn-cta:active {
		transform: translateY(0);
	}

	/* ═══════ METRICS BAR ═══════ */
	.metrics {
		background: var(--navy);
		padding: 40px 32px;
		margin-top: -40px;
	}
	.metrics-inner {
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 24px;
	}
	.metric {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		min-width: 120px;
	}
	.metric-number {
		font-family: var(--ff-sketch);
		font-size: 2.8rem;
		font-weight: 600;
		color: #fff;
		line-height: 1;
	}
	.metric-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.4);
		margin-top: 6px;
	}

	/* ═══════ SECTIONS ═══════ */
	.section-light {
		background: var(--bg-page);
		padding: 96px 32px;
	}
	.section-dark {
		background: var(--bg-page-dark);
		padding: 96px 32px;
	}
	.section-navy {
		background: var(--navy);
		padding: 96px 32px;
		position: relative;
		overflow: hidden;
	}
	.container {
		max-width: 1160px;
		margin: 0 auto;
	}
	.section-title {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text-heading);
		margin-bottom: 20px;
	}
	.section-title-dark {
		color: var(--text-heading-dark);
	}
	.section-subtitle {
		font-size: 1rem;
		color: var(--text-secondary);
		line-height: 1.7;
		max-width: 720px;
		margin-bottom: 48px;
	}

	/* ═══════ PILLARS GRID + FLIP CARDS ═══════ */
	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}
	.pillar-flip {
		perspective: 1000px;
		cursor: pointer;
		min-height: 420px;
		outline: none;
	}
	.pillar-flip:focus-visible .pillar-flip-inner {
		box-shadow: 0 0 0 3px var(--btb-teal);
		border-radius: var(--radius-card-lg);
	}
	.pillar-flip-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		transform-style: preserve-3d;
	}
	.pillar-flip.is-flipped .pillar-flip-inner {
		transform: rotateY(180deg);
	}
	.pillar-front,
	.pillar-back {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		background: var(--bg-surface);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-card-lg);
		padding: 32px;
		display: flex;
		flex-direction: column;
		transition: box-shadow var(--t-normal), border-color var(--t-normal);
	}
	.pillar-flip:hover .pillar-front,
	.pillar-flip:hover .pillar-back {
		box-shadow: var(--shadow-card-hover);
		border-color: var(--btb-steel-subtle);
	}
	.pillar-front {
		z-index: 2;
	}
	.pillar-card-image {
		width: 100%;
		height: 140px;
		border-radius: var(--radius-card-lg) var(--radius-card-lg) 0 0;
		overflow: hidden;
		margin: -32px -32px 16px -32px;
		width: calc(100% + 64px);
	}
	.pillar-card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.pillar-back {
		transform: rotateY(180deg);
		z-index: 1;
		justify-content: center;
	}
	.pillar-note {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1rem;
		font-weight: 500;
		color: var(--btb-teal);
		margin-bottom: 8px;
	}
	.pillar-front h3 {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.pillar-front p {
		font-size: 0.88rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 16px;
		flex: 1;
	}
	.pillar-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 16px;
	}
	.pillar-tag {
		font-size: 0.72rem;
		padding: 4px 11px;
		border-radius: 4px;
		background: rgba(82, 122, 152, 0.08);
		color: var(--btb-steel);
		font-weight: 500;
	}
	.pillar-flip-hint {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 0.92rem;
		color: var(--btb-teal);
		font-weight: 500;
		margin-top: auto;
		transition: color var(--t-fast);
	}
	.pillar-flip:hover .pillar-flip-hint {
		color: var(--btb-steel);
	}

	/* ═══════ PILLAR BACK (Examples) ═══════ */
	.pillar-back-label {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1.2rem;
		color: var(--btb-teal);
		font-weight: 600;
		margin-bottom: 20px;
	}
	.pillar-examples {
		display: flex;
		flex-direction: column;
		gap: 0;
		flex: 1;
	}
	.pillar-example {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px dashed var(--border);
	}
	.pillar-example:last-child {
		border-bottom: none;
	}
	.pillar-example-label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--btb-steel);
		white-space: nowrap;
		min-width: 100px;
	}
	.pillar-example-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}
	.pillar-example-link {
		text-decoration: none;
		transition: background 0.15s;
		border-radius: 6px;
		position: relative;
	}
	.pillar-example-link:hover {
		background: rgba(96, 125, 145, 0.08);
	}
	.pillar-example-link:hover .pillar-example-label {
		color: var(--btb-steel);
	}
	.pillar-example-arrow {
		position: absolute;
		right: 4px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		opacity: 0;
		transition: opacity 0.15s;
	}
	.pillar-example-link:hover .pillar-example-arrow {
		opacity: 1;
		color: var(--btb-steel);
	}
	/* ─── Markdown in Descriptions ─── */
	.pillar-desc-md :global(a) {
		color: var(--btb-steel);
		text-decoration: underline;
		text-decoration-color: var(--btb-teal);
		text-underline-offset: 2px;
		transition: color 0.15s;
	}
	.pillar-desc-md :global(a:hover) {
		color: var(--btb-teal);
	}
	.pillar-desc-md :global(strong) {
		font-weight: 700;
	}
	.pillar-flip-back {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 0.92rem;
		color: var(--text-muted);
		font-weight: 500;
		margin-top: auto;
		padding-top: 12px;
		transition: color var(--t-fast);
	}
	.pillar-flip:hover .pillar-flip-back {
		color: var(--btb-steel);
	}

	/* ═══════ WAVY DIVIDER ═══════ */
	.wavy-divider {
		height: 50px;
		overflow: hidden;
		background: var(--bg-page);
	}
	.wavy-divider svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.wavy-divider-reverse {
		background: var(--bg-page);
	}

	/* ═══════ ABOUT ═══════ */
	.about-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 64px;
		align-items: start;
	}
	.about-text {
		font-size: 0.95rem;
		color: var(--text-secondary-dark);
		line-height: 1.7;
		margin-bottom: 16px;
	}
	.about-quals {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}
	.about-qual {
		font-size: 0.78rem;
		font-weight: 500;
		padding: 6px 14px;
		border-radius: 20px;
		background: rgba(82, 122, 152, 0.1);
		color: var(--text-primary-dark);
		border: 1px solid var(--border-dark);
	}
	.about-social {
		display: flex;
		gap: 12px;
		margin-top: 20px;
	}
	.about-social-link {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.82rem;
		font-weight: 500;
		padding: 6px 14px;
		border-radius: 20px;
		background: rgba(82, 122, 152, 0.08);
		border: 1px solid var(--border-dark);
		color: var(--text-secondary-dark);
		text-decoration: none;
		transition: background var(--t-fast), color var(--t-fast), border-color var(--t-fast);
	}
	.about-social-link:hover {
		background: rgba(82, 122, 152, 0.18);
		color: var(--btb-teal-light);
		border-color: var(--btb-teal);
	}
	.about-social-link svg {
		flex-shrink: 0;
	}
	.about-sidebar {
		display: flex;
		flex-direction: column;
		gap: 16px;
		align-items: center;
	}
	.about-avatar {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--btb-teal);
		box-shadow: 0 0 0 6px rgba(43, 138, 120, 0.15);
		flex-shrink: 0;
		transition: box-shadow 0.4s ease, transform 0.4s ease;
	}
	.about-avatar:hover {
		box-shadow: 0 0 0 8px rgba(43, 138, 120, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
		transform: scale(1.03);
	}
	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.about-sketch-note {
		font-family: var(--ff-sketch);
		font-size: 1rem;
		color: var(--btb-teal);
		font-weight: 500;
	}
	/* ═══════ ABOUT VIDEO ═══════ */
	.about-video {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.about-video-label {
		font-family: var(--ff-sketch);
		font-size: 1.1rem;
		color: var(--btb-teal);
		font-weight: 500;
	}
	.about-video-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%; /* 16:9 */
		border-radius: var(--radius-card-lg);
		overflow: hidden;
		border: 2px solid var(--border-dark);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}
	.about-video-wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	.about-roles {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
	}
	.role-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
		background: var(--bg-surface-dark);
		border: 1px solid var(--border-dark);
		border-radius: var(--radius-md);
		transition: border-color var(--t-normal), background var(--t-normal);
	}
	.role-card:hover {
		border-color: rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.06);
	}
	.role-tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		padding: 4px 12px;
		background: var(--btb-steel);
		color: #fff;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		border-radius: var(--radius-pill);
		white-space: nowrap;
	}
	.role-tag-teal {
		background: var(--btb-teal);
	}
	.role-name {
		font-size: 0.88rem;
		color: var(--text-primary-dark);
		font-weight: 500;
	}

	/* ═══════ INNOVATION / WALK THE TALK ═══════ */
	.inno-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-bottom: 24px;
	}
	.inno-card {
		background: var(--navy);
		color: #fff;
		border-radius: var(--radius-card-lg);
		padding: 32px 28px;
		position: relative;
		overflow: hidden;
		transition: transform var(--t-normal), box-shadow var(--t-normal);
	}
	.inno-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}
	.inno-card-accent {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--btb-teal);
	}
	.inno-card:nth-child(2) .inno-card-accent {
		background: var(--btb-steel);
	}
	.inno-card:nth-child(3) .inno-card-accent {
		background: var(--btb-teal);
	}
	.inno-card-name {
		font-size: 1.15rem;
		font-weight: 600;
		margin-bottom: 4px;
	}
	.inno-card-sketch {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1rem;
		color: var(--btb-teal-light);
		margin-bottom: 14px;
		font-weight: 500;
	}
	.inno-card-image {
		width: 100%;
		height: 160px;
		object-fit: cover;
		border-radius: var(--radius-card-sm, 8px);
		margin-bottom: 16px;
	}
	.inno-card-desc {
		font-size: 0.85rem;
		line-height: 1.65;
		opacity: 0.55;
		margin-bottom: 20px;
		font-weight: 300;
	}
	.inno-card-link {
		display: inline-block;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--btb-teal-light);
		text-decoration: none;
		transition: color var(--t-normal);
	}
	.inno-card-link:hover {
		color: #fff;
	}
	.inno-proof {
		background: var(--bg-surface);
		border-radius: var(--radius-card-lg);
		padding: 32px 36px;
		border: 1.5px dashed var(--btb-teal);
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.inno-proof h4 {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-heading);
		margin-bottom: 4px;
	}
	.inno-proof-sketch {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1rem;
		color: var(--btb-teal);
		margin-bottom: 8px;
		font-weight: 500;
	}
	.inno-proof p {
		font-size: 0.9rem;
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.65;
	}
	.inno-proof-link {
		display: inline-block;
		margin-top: 10px;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--btb-teal);
		text-decoration: none;
		transition: color var(--t-normal);
	}
	.inno-proof-link:hover {
		color: var(--btb-teal-light);
	}
	.inno-proof-image {
		width: 100%;
		max-width: 320px;
		border-radius: var(--radius-card-sm, 8px);
		object-fit: cover;
		flex-shrink: 0;
	}

	/* ═══════ REFERENCES (Marquee) ═══════ */
	.marquee-wrapper {
		overflow: hidden;
		width: 100%;
		padding: 1rem 0;
		mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
		-webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
	}
	.marquee-track {
		display: flex;
		width: max-content;
		margin-bottom: 1.5rem;
	}
	.marquee-track:last-child {
		margin-bottom: 0;
	}
	.marquee-left {
		animation: scroll-left 40s linear infinite;
	}
	.marquee-right {
		animation: scroll-right 40s linear infinite;
	}
	.marquee-wrapper:hover .marquee-track {
		animation-play-state: paused;
	}
	.marquee-content {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 3rem;
		padding: 0 1.5rem;
	}
	@keyframes scroll-left {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}
	@keyframes scroll-right {
		from { transform: translateX(-50%); }
		to { transform: translateX(0); }
	}
	.logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary-dark);
		opacity: 0.3;
		transition: opacity var(--t-fast);
		text-decoration: none;
		flex-shrink: 0;
	}
	.logo-item:hover {
		opacity: 0.7;
	}
	.logo-item-link {
		cursor: pointer;
	}
	.logo-item-img {
		height: 56px;
		width: auto;
		max-width: 140px;
		object-fit: contain;
		filter: brightness(0) invert(1);
	}
	.logo-item-text {
		white-space: nowrap;
		font-size: 0.85rem;
		letter-spacing: 0.02em;
	}

	/* ═══════ BLOG ═══════ */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 22px;
	}
	.blog-card {
		background: var(--bg-surface);
		border-radius: var(--radius-card-lg);
		overflow: hidden;
		border: 1.5px solid var(--border);
		transition: transform var(--t-normal), box-shadow var(--t-normal);
		cursor: pointer;
		text-decoration: none;
		display: block;
	}
	.blog-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-card-hover);
	}
	.blog-card-img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		display: block;
	}
	.blog-card-img-1 {
		background: linear-gradient(135deg, rgba(43, 138, 120, 0.1), var(--bg-surface));
	}
	.blog-card-img-2 {
		background: linear-gradient(135deg, rgba(82, 122, 152, 0.1), var(--bg-surface));
	}
	.blog-card-img-3 {
		background: linear-gradient(135deg, var(--bg-surface), rgba(43, 138, 120, 0.08));
	}
	.blog-card-body {
		padding: 24px;
	}
	.blog-card-tag {
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1rem;
		color: var(--btb-teal);
		margin-bottom: 6px;
		font-weight: 500;
	}
	.blog-card-title {
		font-size: 1.05rem;
		line-height: 1.3;
		margin-bottom: 8px;
		font-weight: 600;
		color: var(--text-heading);
	}
	.blog-card-excerpt {
		font-size: 0.85rem;
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.6;
	}
	.blog-all-link {
		text-align: center;
		margin-top: var(--space-xl);
	}
	.blog-all-link a {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--btb-steel);
		text-decoration: none;
		transition: color var(--t-fast);
	}
	.blog-all-link a:hover {
		color: var(--btb-steel-hover);
	}

	/* ═══════ CTA / CONTACT ═══════ */
	.cta-content {
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}
	.cta-title {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
		color: #fff;
		margin-bottom: 16px;
	}
	.cta-text {
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 16px;
		line-height: 1.6;
	}
	.contact-sketch-note {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-family: var(--ff-sketch);
		font-size: 1.2rem;
		color: var(--btb-teal-light);
		margin-bottom: 32px;
	}
	.contact-sketch-note :global(.contact-coffee-icon) {
		display: inline-block;
		vertical-align: middle;
		opacity: 0.85;
	}
	.contact-methods {
		display: flex;
		justify-content: center;
		gap: 48px;
		flex-wrap: wrap;
		margin-bottom: 8px;
	}
	.contact-method {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.contact-method-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.25);
	}
	.contact-method a {
		color: #fff;
		text-decoration: none;
		font-size: 1rem;
		font-weight: 400;
		transition: color var(--t-fast);
	}
	.contact-method a:hover {
		color: var(--btb-teal-light);
	}

	/* ═══════ FOOTER ═══════ */
	.footer {
		background: var(--bg-page-dark);
		padding: 48px 32px 0;
		border-top: 1px solid var(--border-dark);
	}
	.footer-inner {
		max-width: 1160px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr;
		gap: 48px;
		padding-bottom: 40px;
	}
	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.footer-col-title {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-muted-dark);
		margin-bottom: 4px;
	}
	.footer-brand {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.footer-cube {
		filter: invert(1) brightness(0.85);
	}
	.footer-name {
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--text-primary-dark);
		letter-spacing: -0.01em;
	}
	.footer-tagline {
		font-family: var(--ff-sketch);
		font-size: 0.95rem;
		color: var(--btb-teal);
		margin-top: 2px;
	}
	.footer-social {
		display: flex;
		gap: 14px;
		align-items: center;
		margin-top: 8px;
	}
	.footer-social-link {
		color: var(--text-muted-dark);
		transition: color var(--t-fast), transform var(--t-fast);
		display: flex;
		align-items: center;
	}
	.footer-social-link:hover {
		color: var(--btb-teal-light);
		transform: translateY(-2px);
	}
	.footer-address {
		font-style: normal;
		font-size: 0.85rem;
		line-height: 1.7;
		color: var(--text-secondary-dark);
	}
	.footer-contact-link {
		font-size: 0.85rem;
		color: var(--text-secondary-dark);
		text-decoration: none;
		transition: color var(--t-fast);
	}
	.footer-contact-link:hover {
		color: var(--btb-teal-light);
	}
	.footer-legal-nav {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.footer-legal-nav a {
		font-size: 0.85rem;
		color: var(--text-secondary-dark);
		text-decoration: none;
		transition: color var(--t-fast);
	}
	.footer-legal-nav a:hover {
		color: var(--text-primary-dark);
	}
	.footer-bottom {
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		border-top: 1px solid var(--border-dark);
		font-size: 0.75rem;
		color: var(--text-muted-dark);
	}
	.footer-admin-link {
		color: var(--text-muted-dark);
		text-decoration: none;
		opacity: 0.4;
		transition: opacity 0.2s;
	}
	.footer-admin-link:hover {
		opacity: 0.8;
	}

	/* ═══════ RESPONSIVE ═══════ */
	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}
		.hero {
			padding: 90px 20px 120px;
		}
		.hero-box {
			width: 100px;
		}
		.hero-title {
			font-size: 2rem;
		}
		.hero-clouds {
			height: 80px;
		}
		.hero-clouds-img {
			height: 80px;
		}
		.pillars-grid {
			grid-template-columns: 1fr;
		}
		.pillar-card-image {
			height: 200px;
		}
		.pillar-flip {
			min-height: 480px;
		}
		.about-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}
		.about-avatar {
			width: 160px;
			height: 160px;
		}
		.inno-grid {
			grid-template-columns: 1fr;
		}
		.inno-proof {
			flex-direction: column;
			text-align: center;
		}
		.blog-grid {
			grid-template-columns: 1fr;
		}
		.marquee-content {
			gap: 2rem;
		}
		.logo-item-img {
			height: 40px;
			max-width: 100px;
		}
		.contact-methods {
			flex-direction: column;
			align-items: center;
			gap: 24px;
		}
		.metrics-inner {
			flex-direction: column;
			align-items: center;
		}
		.footer-inner {
			grid-template-columns: 1fr;
			gap: 32px;
			text-align: center;
		}
		.footer-brand {
			justify-content: center;
		}
		.footer-social {
			justify-content: center;
		}
		.footer-legal-nav {
			flex-direction: row;
			justify-content: center;
			gap: 16px;
		}
		.footer-bottom {
			justify-content: center;
			gap: 16px;
		}
	}
	@media (max-width: 1024px) and (min-width: 769px) {
		.inno-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* ═══════ SECTION AVATARS (decorative) ═══════ */
	.section-avatar {
		position: absolute;
		pointer-events: none;
		opacity: 0.18;
		z-index: 0;
	}
	.section-avatar img {
		height: 220px;
		width: auto;
	}
	.section-avatar-right {
		right: -20px;
		top: 60px;
	}
	.section-avatar-left {
		left: -20px;
		top: 50%;
		transform: translateY(-50%);
	}
	/* Sections need relative positioning for avatar placement */
	#walkthetalk .container,
	.cta-content {
		position: relative;
	}
	@media (max-width: 768px) {
		.section-avatar {
			display: none;
		}
	}
</style>
