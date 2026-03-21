import { getDecks, getCardCount, getDueCount } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	const decks = await getDecks(locals.supabase, user!.id);

	const decksWithCounts = await Promise.all(
		decks.map(async (deck) => {
			const [cardCount, dueCount] = await Promise.all([
				getCardCount(locals.supabase, deck.id),
				getDueCount(locals.supabase, deck.id)
			]);
			return { ...deck, cardCount, dueCount };
		})
	);

	return { decks: decksWithCounts };
};
