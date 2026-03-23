import { getDecks } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	const decks = await getDecks(locals.supabase, user!.id);
	return { decks };
};
