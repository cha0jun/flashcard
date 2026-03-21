import { getDeck, getDueCards } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const deck = await getDeck(locals.supabase, params.deckId);
	const cards = await getDueCards(locals.supabase, params.deckId);

	if (!cards.length) throw redirect(303, '/decks');

	return { deck, cards };
};
