<script lang="ts">
	let progress = $state(0);

	$effect(() => {
		function onScroll() {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

<div class="scroll-prog" style="transform: scaleX({progress})" aria-hidden="true"></div>

<style>
	.scroll-prog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--btb-steel), var(--btb-steel-hover));
		transform-origin: left;
		transform: scaleX(0);
		z-index: var(--z-overlay);
		pointer-events: none;
	}
</style>
