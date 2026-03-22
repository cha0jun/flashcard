import type { SupabaseClient } from '@supabase/supabase-js';
import type { Card, CardSrsMetadata, CardWithSrs, Deck } from '$lib/types/database';

type Client = SupabaseClient;

export async function getDecks(supabase: Client, userId: string): Promise<Deck[]> {
	const { data, error } = await supabase
		.from('decks')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data as Deck[];
}

export async function getDeck(supabase: Client, deckId: string): Promise<Deck> {
	const { data, error } = await supabase.from('decks').select('*').eq('id', deckId).single();
	if (error) throw error;
	return data as Deck;
}

export async function createDeck(
	supabase: Client,
	userId: string,
	title: string,
	description?: string
): Promise<Deck> {
	const { data, error } = await supabase
		.from('decks')
		.insert({ user_id: userId, title, description: description ?? null })
		.select()
		.single();
	if (error) throw error;
	return data as Deck;
}

export async function deleteDeck(supabase: Client, deckId: string): Promise<void> {
	const { error } = await supabase.from('decks').delete().eq('id', deckId);
	if (error) throw error;
}

export async function getDueCards(supabase: Client, deckId: string): Promise<CardWithSrs[]> {
	const now = new Date().toISOString();
	const { data: cards, error: cardsError } = await supabase
		.from('cards')
		.select('*')
		.eq('deck_id', deckId);
	if (cardsError) throw cardsError;

	const typedCards = cards as Card[];
	if (!typedCards.length) return [];

	const cardIds = typedCards.map((c) => c.id);
	const { data: srsData, error: srsError } = await supabase
		.from('card_srs_metadata')
		.select('*')
		.in('card_id', cardIds)
		.lte('next_review_at', now);
	if (srsError) throw srsError;

	const typedSrs = srsData as CardSrsMetadata[];
	const srsMap = new Map(typedSrs.map((s) => [s.card_id, s]));

	return typedCards
		.filter((c) => srsMap.has(c.id))
		.map((c) => ({ ...c, srs: srsMap.get(c.id)! }));
}

export async function getAllCardsWithSrs(supabase: Client, deckId: string): Promise<CardWithSrs[]> {
	const { data: cards, error: cardsError } = await supabase
		.from('cards')
		.select('*')
		.eq('deck_id', deckId);
	if (cardsError) throw cardsError;

	const typedCards = cards as Card[];
	if (!typedCards.length) return [];

	const cardIds = typedCards.map((c) => c.id);
	const { data: srsData, error: srsError } = await supabase
		.from('card_srs_metadata')
		.select('*')
		.in('card_id', cardIds);
	if (srsError) throw srsError;

	const typedSrs = srsData as CardSrsMetadata[];
	const srsMap = new Map(typedSrs.map((s) => [s.card_id, s]));

	return typedCards
		.filter((c) => srsMap.has(c.id))
		.map((c) => ({ ...c, srs: srsMap.get(c.id)! }));
}

export async function getCardCount(supabase: Client, deckId: string): Promise<number> {
	const { count, error } = await supabase
		.from('cards')
		.select('*', { count: 'exact', head: true })
		.eq('deck_id', deckId);
	if (error) throw error;
	return count ?? 0;
}

export async function getDueCount(supabase: Client, deckId: string): Promise<number> {
	const now = new Date().toISOString();
	const { data: cards, error: cardsError } = await supabase
		.from('cards')
		.select('id')
		.eq('deck_id', deckId);
	if (cardsError) throw cardsError;

	const typedCards = cards as { id: string }[];
	if (!typedCards.length) return 0;

	const { count, error } = await supabase
		.from('card_srs_metadata')
		.select('*', { count: 'exact', head: true })
		.in(
			'card_id',
			typedCards.map((c) => c.id)
		)
		.lte('next_review_at', now);
	if (error) throw error;
	return count ?? 0;
}

export async function reviewCard(
	supabase: Client,
	userId: string,
	cardId: string,
	rating: number,
	responseTimeMs: number,
	nextSrs: {
		ease_factor: number;
		interval_days: number;
		repetitions: number;
		next_review_at: string;
	}
): Promise<void> {
	const { error: logError } = await supabase.from('review_logs').insert({
		card_id: cardId,
		user_id: userId,
		rating,
		response_time_ms: responseTimeMs
	});
	if (logError) throw logError;

	const { error: srsError } = await supabase
		.from('card_srs_metadata')
		.upsert({ card_id: cardId, ...nextSrs });
	if (srsError) throw srsError;
}

export async function getCardsForDeck(supabase: Client, deckId: string): Promise<Card[]> {
	const { data, error } = await supabase
		.from('cards')
		.select('*')
		.eq('deck_id', deckId)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data as Card[];
}

export async function createCard(
	supabase: Client,
	userId: string,
	deckId: string,
	front: string,
	back: string
): Promise<Card> {
	const { data, error } = await supabase
		.from('cards')
		.insert({ user_id: userId, deck_id: deckId, front, back })
		.select()
		.single();
	if (error) throw error;

	const card = data as Card;

	const { error: srsError } = await supabase.from('card_srs_metadata').insert({
		card_id: card.id,
		ease_factor: 2.5,
		interval_days: 0,
		repetitions: 0,
		next_review_at: new Date().toISOString()
	});
	if (srsError) throw srsError;

	return card;
}

export async function updateCard(
	supabase: Client,
	cardId: string,
	front: string,
	back: string
): Promise<void> {
	const { error } = await supabase.from('cards').update({ front, back }).eq('id', cardId);
	if (error) throw error;
}

export async function deleteCard(supabase: Client, cardId: string): Promise<void> {
	const { error } = await supabase.from('cards').delete().eq('id', cardId);
	if (error) throw error;
}

export async function getDashboardStats(supabase: Client, userId: string) {
	const { count: deckCount, error: deckErr } = await supabase
		.from('decks')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', userId);
	if (deckErr) throw deckErr;

	const { count: cardCount, error: cardErr } = await supabase
		.from('cards')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', userId);
	if (cardErr) throw cardErr;

	const { data: reviews, error: reviewErr } = await supabase
		.from('review_logs')
		.select('reviewed_at')
		.eq('user_id', userId)
		.order('reviewed_at', { ascending: false })
		.limit(100);
	if (reviewErr) throw reviewErr;

	const typedReviews = reviews as { reviewed_at: string }[];
	const streak = computeStreak(typedReviews.map((r) => r.reviewed_at));

	return {
		deckCount: deckCount ?? 0,
		cardCount: cardCount ?? 0,
		streak,
		reviewsToday: typedReviews.filter((r) => isToday(r.reviewed_at)).length
	};
}

function isToday(dateStr: string): boolean {
	const d = new Date(dateStr);
	const now = new Date();
	return (
		d.getFullYear() === now.getFullYear() &&
		d.getMonth() === now.getMonth() &&
		d.getDate() === now.getDate()
	);
}

function computeStreak(dates: string[]): number {
	if (!dates.length) return 0;

	const uniqueDays = new Set(
		dates.map((d) => {
			const date = new Date(d);
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		})
	);

	let streak = 0;
	const now = new Date();
	const check = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	while (uniqueDays.has(`${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`)) {
		streak++;
		check.setDate(check.getDate() - 1);
	}

	return streak;
}
