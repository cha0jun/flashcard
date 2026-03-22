import { getDeck, getDueCards, getAllCardsWithSrs } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const deck = await getDeck(locals.supabase, params.deckId);
	const dueCards = await getDueCards(locals.supabase, params.deckId);

	if (dueCards.length) {
		return { deck, cards: dueCards, mode: 'due' as const };
	}

	const allCards = await getAllCardsWithSrs(locals.supabase, params.deckId);

	if (!allCards.length) throw redirect(303, '/decks');

	return { deck, cards: allCards, mode: 'practice' as const };
};
