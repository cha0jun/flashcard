import { getDashboardStats } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	const stats = await getDashboardStats(locals.supabase, user!.id);
	return { stats };
};
