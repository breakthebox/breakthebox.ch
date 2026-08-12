import type { RequestHandler } from './$types';
import { buildLlmsFullTxt } from '$lib/server/llms';
import { SITE_URL } from '$lib/config/site';

export const GET: RequestHandler = async () => {
	return new Response(await buildLlmsFullTxt(SITE_URL), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
