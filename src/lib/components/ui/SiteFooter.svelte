<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	const year = new Date().getFullYear();
</script>

<footer class="sitefooter">
	<div class="sf-in">
		<div class="sf-brand">Brigitte Hulliger <span class="sf-sep">/</span> Break the Box</div>
		<div class="sf-legal">
			<a href={localizeHref('/impressum')}>{m.footer_impressum()}</a>
			<a href={localizeHref('/datenschutz')}>{m.footer_datenschutz()}</a>
			<a href={localizeHref('/agb')}>{m.footer_agb()}</a>
			<a href="/auth/login" class="sf-admin">Admin</a>
		</div>
		<div>© {year} {m.footer_copyright()}</div>
	</div>
</footer>

<style>
	.sitefooter {
		padding: 26px 0;
		background: var(--bg-page);
	}
	.sf-in {
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 34px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		font-size: 12px;
		color: var(--text-secondary);
	}
	.sf-brand {
		font-family: var(--ff-serif);
		font-weight: 600;
		color: var(--text-heading);
	}
	.sf-sep {
		color: var(--btb-steel);
	}
	.sf-legal {
		display: flex;
		gap: 22px;
	}
	.sf-legal a {
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.15s;
	}
	.sf-legal a:hover {
		color: var(--btb-steel);
	}
	.sf-admin {
		opacity: 0.5;
	}
	@media (max-width: 560px) {
		.sf-in {
			padding: 0 18px;
		}
	}
</style>
