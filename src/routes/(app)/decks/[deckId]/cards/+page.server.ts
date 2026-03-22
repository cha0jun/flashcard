import { getDeck, getCardsForDeck, createCard, updateCard, deleteCard } from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [deck, cards] = await Promise.all([
		getDeck(locals.supabase, params.deckId),
		getCardsForDeck(locals.supabase, params.deckId)
	]);

	return { deck, cards };
};

export const actions: Actions = {
	create: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Not authenticated' });

		const formData = await request.formData();
		const front = formData.get('front')?.toString().trim();
		const back = formData.get('back')?.toString().trim();

		if (!front || !back) {
			return fail(400, { message: 'Front and back are required' });
		}

		await createCard(locals.supabase, user.id, params.deckId, front, back);
		return { success: true };
	},

	update: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Not authenticated' });

		const formData = await request.formData();
		const cardId = formData.get('cardId')?.toString();
		const front = formData.get('front')?.toString().trim();
		const back = formData.get('back')?.toString().trim();

		if (!cardId || !front || !back) {
			return fail(400, { message: 'Card ID, front, and back are required' });
		}

		await updateCard(locals.supabase, cardId, front, back);
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Not authenticated' });

		const formData = await request.formData();
		const cardId = formData.get('cardId')?.toString();

		if (!cardId) return fail(400, { message: 'Card ID is required' });

		await deleteCard(locals.supabase, cardId);
		return { success: true };
	}
};
