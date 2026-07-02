<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';

	let { subtitle }: { subtitle: string } = $props();
</script>

<a href={localizeHref('/')} class="sp-brand">
	<img src="/box.svg" alt="" class="sp-cube" width="30" height="30" />
	<span class="sp-txt">
		<span class="sp-m">Brigitte Hulliger</span>
		<span class="sp-c">{subtitle}</span>
	</span>
</a>

<style>
	.sp-brand {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 11px;
		text-decoration: none;
	}
	.sp-cube {
		width: 30px;
		height: auto;
		flex-shrink: 0;
	}
	.sp-txt {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
	}
	.sp-m {
		font-family: var(--ff-serif);
		font-weight: 700;
		font-size: 1.2rem;
		letter-spacing: -0.01em;
		color: var(--text-heading);
	}
	.sp-c {
		font-family: var(--ff-ui);
		font-weight: 600;
		font-size: 0.62rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--btb-steel);
		margin-top: 3px;
	}
</style>
