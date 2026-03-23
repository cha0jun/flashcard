import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDeck, createCard } from '$lib/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) throw error(401, 'Not authenticated');

	const body = await request.json();
	const { mode, deckId, title, description, cards } = body as {
		mode: 'new' | 'existing';
		deckId?: string;
		title?: string;
		description?: string;
		cards: { front: string; back: string }[];
	};

	if (!cards?.length) throw error(400, 'No cards to save');

	let targetDeckId: string;

	if (mode === 'new') {
		if (!title) throw error(400, 'Title required for new deck');
		const deck = await createDeck(locals.supabase, user.id, title, description);
		targetDeckId = deck.id;
	} else {
		if (!deckId) throw error(400, 'Deck ID required');
		targetDeckId = deckId;
	}

	for (const card of cards) {
		await createCard(locals.supabase, user.id, targetDeckId, card.front, card.back);
	}

	return json({ deckId: targetDeckId, cardCount: cards.length });
};
