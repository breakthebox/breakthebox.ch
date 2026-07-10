// Alte Blog-Route: dauerhaft auf /impulse umgeleitet (SEO-Redirect).
import { redirect } from '@sveltejs/kit';

export const load = () => {
	throw redirect(301, '/impulse');
};
