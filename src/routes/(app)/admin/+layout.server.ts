import { requireRole } from '$lib/server/auth/guards';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { user } = requireRole(event, ['admin']);

	return {
		user: {
			name: user.name,
			email: user.email,
			avatarUrl: user.avatarUrl,
			role: user.role
		}
	};
};
