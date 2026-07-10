// Alte Blogpost-Route: dauerhaft auf /impulse/[slug] umgeleitet (SEO-Redirect).
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	throw redirect(301, `/impulse/${params.slug}`);
};
