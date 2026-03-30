<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let flipped = $state([false, false, false, false]);

	function toggleFlip(index: number) {
		flipped[index] = !flipped[index];
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleFlip(index);
		}
	}
</script>

<svelte:head>
	<title>{m.app_name()} — {m.hero_name()}</title>
	<meta name="description" content={m.hero_subline()} />
</svelte:head>

<!-- ═══════ NAVIGATION ═══════ -->
<nav class="nav">
	<div class="nav-inner">
		<a href="/" class="nav-logo">
			<img src="/box.svg" alt="" class="nav-logo-icon" width="32" height="32" />
			<span class="nav-logo-text">Break the Box</span>
		</a>
		<div class="nav-links">
			<a href="#pillars">{m.nav_services()}</a>
			<a href="#about">{m.nav_about()}</a>
			<a href="#walkthetalk">{m.nav_walkthetalk()}</a>
			<a href="#references">{m.nav_references()}</a>
			<a href="#contact">{m.nav_contact()}</a>
		</div>
	</div>
</nav>

<!-- ═══════ HERO ═══════ -->
<section class="hero">
	<div class="hero-inner">
		<span class="hero-badge">{m.hero_badge()}</span>
		<img src="/box.webp" alt="Break the Box" class="hero-box" />
		<h1 class="hero-title">
			{@html m.hero_name().split('.').filter(Boolean).map((word, i) => {
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
	<div class="metrics-inner">
		<div class="metric">
			<span class="metric-number">10</span>
			<span class="metric-label">{m.metrics_years()}</span>
		</div>
		<div class="metric">
			<span class="metric-number">50+</span>
			<span class="metric-label">{m.metrics_clients()}</span>
		</div>
		<div class="metric">
			<span class="metric-number">3</span>
			<span class="metric-label">{m.metrics_vr()}</span>
		</div>
		<div class="metric">
			<span class="metric-number">2</span>
			<span class="metric-label">{m.metrics_universities()}</span>
		</div>
		<div class="metric">
			<span class="metric-number">80+</span>
			<span class="metric-label">{m.metrics_projects()}</span>
		</div>
	</div>
</section>

<!-- ═══════ FOUR PILLARS ═══════ -->
<section id="pillars" class="section-light">
	<div class="container">
		<span class="sketch-label">{m.section_pillars_label()}</span>
		<h2 class="section-title">
			{@html m.section_pillars_title().replace(
				/Perspektiven|Perspectives|perspectives/,
				'<em class="keyword-underline" style="text-decoration-color: var(--btb-teal)">$&</em>'
			)}
		</h2>
		<p class="section-subtitle">{m.section_pillars_subtitle()}</p>
		<div class="pillars-grid">
			<!-- Pillar 1: Strategy -->
			<div
				class="pillar-flip"
				class:is-flipped={flipped[0]}
				onclick={() => toggleFlip(0)}
				onkeydown={(e) => handleKeydown(e, 0)}
				role="button"
				tabindex="0"
				aria-label="{m.pillar_strategy_title()} — {m.pillar_flip_hint()}"
			>
				<div class="pillar-flip-inner">
					<div class="pillar-front">
						<div class="pillar-icon">
							<svg width="28" height="28" fill="none" stroke="var(--btb-steel)" stroke-width="1.8" stroke-linecap="round">
								<path d="M14 4L14 24M4 14L24 14"/>
								<path d="M8 8L20 20M20 8L8 20" opacity="0.3"/>
								<circle cx="14" cy="14" r="3" fill="var(--btb-teal)" opacity="0.6" stroke="none"/>
							</svg>
						</div>
						<div class="pillar-number">
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
								<ellipse cx="24" cy="24" rx="22" ry="21.5" stroke="#A8C0D0" stroke-width="1.5" stroke-dasharray="4,3" transform="rotate(-3 24 24)"/>
							</svg>
							<span>1</span>
						</div>
						<h3>{m.pillar_strategy_title()}</h3>
						<span class="pillar-note">{m.pillar_strategy_note()}</span>
						<p>{m.pillar_strategy_desc()}</p>
						<div class="pillar-tags">
							<span class="pillar-tag">{m.pillar_strategy_tag1()}</span>
							<span class="pillar-tag">{m.pillar_strategy_tag2()}</span>
							<span class="pillar-tag">{m.pillar_strategy_tag3()}</span>
							<span class="pillar-tag">{m.pillar_strategy_tag4()}</span>
							<span class="pillar-tag">{m.pillar_strategy_tag5()}</span>
							<span class="pillar-tag">{m.pillar_strategy_tag6()}</span>
						</div>
						<span class="pillar-flip-hint">{m.pillar_flip_hint()} &rarr;</span>
					</div>
					<div class="pillar-back">
						<span class="pillar-back-label">{m.pillar_examples_label()}</span>
						<div class="pillar-examples">
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_strategy_ex1_label()}</span>
								<span class="pillar-example-desc">{m.pillar_strategy_ex1_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_strategy_ex2_label()}</span>
								<span class="pillar-example-desc">{m.pillar_strategy_ex2_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_strategy_ex3_label()}</span>
								<span class="pillar-example-desc">{m.pillar_strategy_ex3_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_strategy_ex4_label()}</span>
								<span class="pillar-example-desc">{m.pillar_strategy_ex4_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_strategy_ex5_label()}</span>
								<span class="pillar-example-desc">{m.pillar_strategy_ex5_desc()}</span>
							</div>
						</div>
						<span class="pillar-flip-back">&larr; {m.pillar_flip_back()}</span>
					</div>
				</div>
			</div>

			<!-- Pillar 2: Governance -->
			<div
				class="pillar-flip"
				class:is-flipped={flipped[1]}
				onclick={() => toggleFlip(1)}
				onkeydown={(e) => handleKeydown(e, 1)}
				role="button"
				tabindex="0"
				aria-label="{m.pillar_governance_title()} — {m.pillar_flip_hint()}"
			>
				<div class="pillar-flip-inner">
					<div class="pillar-front">
						<div class="pillar-icon">
							<svg width="28" height="28" fill="none" stroke="var(--btb-steel)" stroke-width="1.8" stroke-linecap="round">
								<path d="M14 4L4 12L14 10L24 12Z"/>
								<path d="M6 14L6 22L22 22L22 14"/>
								<circle cx="14" cy="18" r="2.5" fill="var(--btb-teal)" opacity="0.6" stroke="none"/>
							</svg>
						</div>
						<div class="pillar-number">
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
								<ellipse cx="24" cy="24" rx="22" ry="21.5" stroke="#A8C0D0" stroke-width="1.5" stroke-dasharray="4,3" transform="rotate(2 24 24)"/>
							</svg>
							<span>2</span>
						</div>
						<h3>{m.pillar_governance_title()}</h3>
						<span class="pillar-note">{m.pillar_governance_note()}</span>
						<p>{m.pillar_governance_desc()}</p>
						<div class="pillar-tags">
							<span class="pillar-tag">{m.pillar_governance_tag1()}</span>
							<span class="pillar-tag">{m.pillar_governance_tag2()}</span>
							<span class="pillar-tag">{m.pillar_governance_tag3()}</span>
							<span class="pillar-tag">{m.pillar_governance_tag4()}</span>
						</div>
						<span class="pillar-flip-hint">{m.pillar_flip_hint()} &rarr;</span>
					</div>
					<div class="pillar-back">
						<span class="pillar-back-label">{m.pillar_examples_label()}</span>
						<div class="pillar-examples">
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_governance_ex1_label()}</span>
								<span class="pillar-example-desc">{m.pillar_governance_ex1_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_governance_ex2_label()}</span>
								<span class="pillar-example-desc">{m.pillar_governance_ex2_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_governance_ex3_label()}</span>
								<span class="pillar-example-desc">{m.pillar_governance_ex3_desc()}</span>
							</div>
						</div>
						<span class="pillar-flip-back">&larr; {m.pillar_flip_back()}</span>
					</div>
				</div>
			</div>

			<!-- Pillar 3: Teaching -->
			<div
				class="pillar-flip"
				class:is-flipped={flipped[2]}
				onclick={() => toggleFlip(2)}
				onkeydown={(e) => handleKeydown(e, 2)}
				role="button"
				tabindex="0"
				aria-label="{m.pillar_teaching_title()} — {m.pillar_flip_hint()}"
			>
				<div class="pillar-flip-inner">
					<div class="pillar-front">
						<div class="pillar-icon">
							<svg width="28" height="28" fill="none" stroke="var(--btb-steel)" stroke-width="1.8" stroke-linecap="round">
								<rect x="6" y="10" width="16" height="12" rx="2"/>
								<path d="M6 14L22 14"/>
								<circle cx="20" cy="6" r="3" fill="var(--btb-teal)" opacity="0.6" stroke="none"/>
								<path d="M20 9L20 14" stroke-dasharray="2,2"/>
							</svg>
						</div>
						<div class="pillar-number">
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
								<ellipse cx="24" cy="24" rx="22" ry="21.5" stroke="#A8C0D0" stroke-width="1.5" stroke-dasharray="4,3" transform="rotate(-2 24 24)"/>
							</svg>
							<span>3</span>
						</div>
						<h3>{m.pillar_teaching_title()}</h3>
						<span class="pillar-note">{m.pillar_teaching_note()}</span>
						<p>{m.pillar_teaching_desc()}</p>
						<div class="pillar-tags">
							<span class="pillar-tag">{m.pillar_teaching_tag1()}</span>
							<span class="pillar-tag">{m.pillar_teaching_tag2()}</span>
							<span class="pillar-tag">{m.pillar_teaching_tag3()}</span>
							<span class="pillar-tag">{m.pillar_teaching_tag4()}</span>
							<span class="pillar-tag">{m.pillar_teaching_tag5()}</span>
						</div>
						<span class="pillar-flip-hint">{m.pillar_flip_hint()} &rarr;</span>
					</div>
					<div class="pillar-back">
						<span class="pillar-back-label">{m.pillar_examples_label()}</span>
						<div class="pillar-examples">
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_teaching_ex1_label()}</span>
								<span class="pillar-example-desc">{m.pillar_teaching_ex1_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_teaching_ex2_label()}</span>
								<span class="pillar-example-desc">{m.pillar_teaching_ex2_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_teaching_ex3_label()}</span>
								<span class="pillar-example-desc">{m.pillar_teaching_ex3_desc()}</span>
							</div>
						</div>
						<span class="pillar-flip-back">&larr; {m.pillar_flip_back()}</span>
					</div>
				</div>
			</div>

			<!-- Pillar 4: Walk the Talk -->
			<div
				class="pillar-flip"
				class:is-flipped={flipped[3]}
				onclick={() => toggleFlip(3)}
				onkeydown={(e) => handleKeydown(e, 3)}
				role="button"
				tabindex="0"
				aria-label="{m.pillar_innovation_title()} — {m.pillar_flip_hint()}"
			>
				<div class="pillar-flip-inner">
					<div class="pillar-front">
						<div class="pillar-icon">
							<svg width="28" height="28" fill="none" stroke="var(--btb-steel)" stroke-width="1.8" stroke-linecap="round">
								<circle cx="14" cy="14" r="8"/>
								<path d="M14 6L14 9M14 19L14 22M6 14L9 14M19 14L22 14" opacity="0.4"/>
								<circle cx="14" cy="14" r="2.5" fill="var(--btb-teal)" opacity="0.8" stroke="none"/>
							</svg>
						</div>
						<div class="pillar-number">
							<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
								<ellipse cx="24" cy="24" rx="22" ry="21.5" stroke="#A8C0D0" stroke-width="1.5" stroke-dasharray="4,3" transform="rotate(1.5 24 24)"/>
							</svg>
							<span>4</span>
						</div>
						<h3>{m.pillar_innovation_title()}</h3>
						<span class="pillar-note">{m.pillar_innovation_note()}</span>
						<p>{m.pillar_innovation_desc()}</p>
						<div class="pillar-tags">
							<span class="pillar-tag">{m.pillar_innovation_tag1()}</span>
							<span class="pillar-tag">{m.pillar_innovation_tag2()}</span>
							<span class="pillar-tag">{m.pillar_innovation_tag3()}</span>
							<span class="pillar-tag">{m.pillar_innovation_tag4()}</span>
						</div>
						<span class="pillar-flip-hint">{m.pillar_flip_hint()} &rarr;</span>
					</div>
					<div class="pillar-back">
						<span class="pillar-back-label">{m.pillar_examples_label()}</span>
						<div class="pillar-examples">
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_innovation_ex1_label()}</span>
								<span class="pillar-example-desc">{m.pillar_innovation_ex1_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_innovation_ex2_label()}</span>
								<span class="pillar-example-desc">{m.pillar_innovation_ex2_desc()}</span>
							</div>
							<div class="pillar-example">
								<span class="pillar-example-label">{m.pillar_innovation_ex3_label()}</span>
								<span class="pillar-example-desc">{m.pillar_innovation_ex3_desc()}</span>
							</div>
						</div>
						<span class="pillar-flip-back">&larr; {m.pillar_flip_back()}</span>
					</div>
				</div>
			</div>
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
		<div class="about-content">
			<span class="sketch-label sketch-label-dark">{m.section_about_label()}</span>
			<h2 class="section-title section-title-dark">
				{@html m.section_about_title().replace(
					m.section_about_highlight(),
					`<em class="keyword-underline" style="text-decoration-color: var(--btb-teal)">${m.section_about_highlight()}</em>`
				)}
			</h2>
			<p class="about-text">{m.section_about_text()}</p>
			<p class="about-text">{m.section_about_text2()}</p>
			<p class="about-text">{m.section_about_text3()}</p>
			<div class="about-quals">
				<span class="about-qual">{m.about_qual1()}</span>
				<span class="about-qual">{m.about_qual2()}</span>
				<span class="about-qual">{m.about_qual3()}</span>
			</div>
		</div>
		<div class="about-sidebar">
			<div class="about-avatar">
				<img src="/avatar_bhu.svg" alt="Brigitte Hulliger" class="avatar-img" />
			</div>
			<span class="about-sketch-note">{m.about_sketch_note()}</span>
			<!-- CV Video -->
			<div class="about-video">
				<span class="about-video-label">{m.about_video_label()}</span>
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
				<div class="role-card">
					<span class="role-tag role-tag-teal">{m.about_role1_title()}</span>
					<span class="role-name">{m.about_role1_org()}</span>
				</div>
				<div class="role-card">
					<span class="role-tag">{m.about_role2_title()}</span>
					<span class="role-name">{m.about_role2_org()}</span>
				</div>
				<div class="role-card">
					<span class="role-tag role-tag-teal">{m.about_role3_title()}</span>
					<span class="role-name">{m.about_role3_org()}</span>
				</div>
				<div class="role-card">
					<span class="role-tag">{m.about_role4_title()}</span>
					<span class="role-name">{m.about_role4_org()}</span>
				</div>
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
		<span class="sketch-label">{m.section_walkthetalk_label()}</span>
		<h2 class="section-title">{m.section_walkthetalk_title()}</h2>
		<p class="section-subtitle">{m.section_walkthetalk_subtitle()}</p>
		<div class="inno-grid">
			<div class="inno-card">
				<div class="inno-card-accent"></div>
				<h3 class="inno-card-name">{m.inno_ductivo_name()}</h3>
				<span class="inno-card-sketch">{m.inno_ductivo_sketch()}</span>
				<p class="inno-card-desc">{m.inno_ductivo_desc()}</p>
				<div class="inno-card-tech">
					<span>SvelteKit</span>
					<span>Claude API</span>
					<span>HERMES One</span>
				</div>
			</div>
			<div class="inno-card">
				<div class="inno-card-accent"></div>
				<h3 class="inno-card-name">{m.inno_entorakel_name()}</h3>
				<span class="inno-card-sketch">{m.inno_entorakel_sketch()}</span>
				<p class="inno-card-desc">{m.inno_entorakel_desc()}</p>
				<div class="inno-card-tech">
					<span>SvelteKit</span>
					<span>Sonnet + Haiku</span>
					<span>Brave Search</span>
				</div>
			</div>
			<div class="inno-card">
				<div class="inno-card-accent"></div>
				<h3 class="inno-card-name">{m.inno_marketing_name()}</h3>
				<span class="inno-card-sketch">{m.inno_marketing_sketch()}</span>
				<p class="inno-card-desc">{m.inno_marketing_desc()}</p>
				<div class="inno-card-tech">
					<span>SvelteKit</span>
					<span>Claude API</span>
					<span>Auth0</span>
				</div>
			</div>
		</div>
		<!-- Miss Bizzy proof card -->
		<div class="inno-proof">
			<svg class="inno-proof-icon" viewBox="0 0 64 64" fill="none">
				<circle cx="32" cy="32" r="24" stroke="var(--btb-teal)" stroke-width="1.5" stroke-dasharray="4,3" fill="none"/>
				<circle cx="32" cy="20" r="5" fill="var(--btb-teal)" opacity=".7"/>
				<circle cx="20" cy="38" r="4" fill="var(--btb-steel)" opacity=".6"/>
				<circle cx="44" cy="38" r="4" fill="var(--btb-steel)" opacity=".6"/>
				<path d="M32 25L22 34" stroke="var(--border)" stroke-width="1" stroke-linecap="round"/>
				<path d="M32 25L42 34" stroke="var(--border)" stroke-width="1" stroke-linecap="round"/>
				<path d="M24 38L40 38" stroke="var(--border)" stroke-width="1" stroke-linecap="round" stroke-dasharray="2,2"/>
			</svg>
			<div>
				<h4>{m.inno_missbizzy_title()}</h4>
				<span class="inno-proof-sketch">{m.inno_missbizzy_sketch()}</span>
				<p>{m.inno_missbizzy_desc()}</p>
			</div>
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
		<span class="sketch-label sketch-label-dark">{m.section_references_label()}</span>
		<h2 class="section-title section-title-dark">{m.section_references_title()}</h2>
		<div class="logos-grid">
			<span class="logo-item">GVB</span>
			<span class="logo-item">Nexplore</span>
			<span class="logo-item">PostFinance</span>
			<span class="logo-item">BLS</span>
			<span class="logo-item">EWB</span>
			<span class="logo-item">BFH</span>
			<span class="logo-item">BEKB</span>
			<span class="logo-item">Kanton Bern</span>
			<span class="logo-item">SGAIM</span>
			<span class="logo-item">Meier Tobler</span>
			<span class="logo-item">Bracher & Partner</span>
			<span class="logo-item">Michel Gruppe</span>
			<span class="logo-item">ORTHO TEAM</span>
			<span class="logo-item">BAFU</span>
			<span class="logo-item">Identitas</span>
			<span class="logo-item">Kellerhals Carrard</span>
			<span class="logo-item">GASCHE</span>
			<span class="logo-item">Milchgold Käse</span>
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
		<span class="sketch-label">{m.section_blog_label()}</span>
		<h2 class="section-title">{m.section_blog_title()}</h2>
		<div class="blog-grid">
			<div class="blog-card">
				<div class="blog-card-img blog-card-img-1"></div>
				<div class="blog-card-body">
					<span class="blog-card-tag">{m.blog1_tag()}</span>
					<h3 class="blog-card-title">{m.blog1_title()}</h3>
					<p class="blog-card-excerpt">{m.blog1_excerpt()}</p>
				</div>
			</div>
			<div class="blog-card">
				<div class="blog-card-img blog-card-img-2"></div>
				<div class="blog-card-body">
					<span class="blog-card-tag">{m.blog2_tag()}</span>
					<h3 class="blog-card-title">{m.blog2_title()}</h3>
					<p class="blog-card-excerpt">{m.blog2_excerpt()}</p>
				</div>
			</div>
			<div class="blog-card">
				<div class="blog-card-img blog-card-img-3"></div>
				<div class="blog-card-body">
					<span class="blog-card-tag">{m.blog3_tag()}</span>
					<h3 class="blog-card-title">{m.blog3_title()}</h3>
					<p class="blog-card-excerpt">{m.blog3_excerpt()}</p>
				</div>
			</div>
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
		<span class="sketch-label sketch-label-dark">{m.section_contact_label()}</span>
		<h2 class="cta-title">{m.section_cta_title()}</h2>
		<p class="cta-text">{m.section_cta_text()}</p>
		<span class="contact-sketch-note">{m.contact_sketch()} ☕</span>
		<div class="contact-methods">
			<div class="contact-method">
				<span class="contact-method-label">{m.contact_email_label()}</span>
				<a href="mailto:info@breakthebox.ch">info@breakthebox.ch</a>
			</div>
			<div class="contact-method">
				<span class="contact-method-label">{m.contact_phone_label()}</span>
				<a href="tel:+41763092088">+41 76 309 20 88</a>
			</div>
			<div class="contact-method">
				<span class="contact-method-label">{m.contact_linkedin_label()}</span>
				<a href="https://www.linkedin.com/in/bhulliger/" target="_blank">linkedin.com/in/bhulliger</a>
			</div>
		</div>
		<a href="mailto:info@breakthebox.ch" class="btn-cta">{m.cta_contact()} &rarr;</a>
	</div>
</section>

<!-- ═══════ FOOTER ═══════ -->
<footer class="footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<img src="/logo.svg" alt="Break the Box GmbH" class="footer-logo-img" />
			<span class="footer-tagline">{m.footer_tagline()}</span>
		</div>
		<div class="footer-links">
			<a href="#">{m.footer_impressum()}</a>
			<a href="#">{m.footer_datenschutz()}</a>
			<a href="#">{m.footer_agb()}</a>
		</div>
		<div class="footer-copy">
			&copy; {new Date().getFullYear()} {m.footer_copyright()}
		</div>
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
		border-bottom: 1px solid var(--border);
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
		transition: background var(--t-fast);
		cursor: pointer;
	}
	.btn-primary:hover {
		background: var(--btb-steel-hover);
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
		transition: border-color var(--t-fast);
		cursor: pointer;
	}
	.btn-secondary:hover {
		border-color: var(--btb-steel);
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
		transition: background var(--t-fast);
		cursor: pointer;
		margin-top: 32px;
	}
	.btn-cta:hover {
		background: var(--btb-teal-dark);
	}

	/* ═══════ METRICS BAR ═══════ */
	.metrics {
		background: var(--navy);
		padding: 40px 32px;
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
	}
	.pillar-front {
		z-index: 2;
	}
	.pillar-back {
		transform: rotateY(180deg);
		z-index: 1;
		justify-content: center;
	}
	.pillar-icon {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--bg-elevated);
		border: 2px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
	}
	.pillar-number {
		position: relative;
		width: 48px;
		height: 48px;
		margin-bottom: 16px;
	}
	.pillar-number svg {
		position: absolute;
		top: 0;
		left: 0;
	}
	.pillar-number span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--btb-steel);
		color: #fff;
		font-size: 0.88rem;
		font-weight: 700;
		display: flex;
		align-items: center;
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
		transition: transform var(--t-normal);
	}
	.inno-card:hover {
		transform: translateY(-3px);
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
	.inno-card-desc {
		font-size: 0.85rem;
		line-height: 1.65;
		opacity: 0.55;
		margin-bottom: 20px;
		font-weight: 300;
	}
	.inno-card-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.inno-card-tech span {
		font-size: 0.68rem;
		padding: 3px 8px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 500;
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
	.inno-proof-icon {
		width: 64px;
		height: 64px;
		flex-shrink: 0;
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

	/* ═══════ REFERENCES ═══════ */
	.logos-grid {
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 28px 44px;
	}
	.logo-item {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary-dark);
		opacity: 0.25;
		transition: opacity var(--t-fast);
	}
	.logo-item:hover {
		opacity: 0.6;
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
	}
	.blog-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-card-hover);
	}
	.blog-card-img {
		width: 100%;
		aspect-ratio: 16 / 9;
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
		display: block;
		font-family: var(--ff-sketch);
		font-size: 1.2rem;
		color: var(--btb-teal-light);
		margin-bottom: 32px;
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
		padding: 40px 32px;
		border-top: 1px solid var(--border-dark);
	}
	.footer-inner {
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.footer-logo-img {
		height: 36px;
		width: auto;
		filter: invert(1) brightness(0.85);
	}
	.footer-tagline {
		font-family: var(--ff-sketch);
		font-size: 1rem;
		color: var(--btb-teal);
	}
	.footer-links {
		display: flex;
		gap: 20px;
	}
	.footer-links a {
		font-size: 0.78rem;
		color: var(--text-muted-dark);
		text-decoration: none;
		transition: color var(--t-fast);
	}
	.footer-links a:hover {
		color: var(--text-secondary-dark);
	}
	.footer-copy {
		font-size: 0.78rem;
		color: var(--text-muted-dark);
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
			flex-direction: column;
			gap: 16px;
			text-align: center;
		}
	}
	@media (max-width: 1024px) and (min-width: 769px) {
		.inno-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
