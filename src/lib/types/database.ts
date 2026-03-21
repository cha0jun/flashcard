export type Deck = {
	id: string;
	user_id: string;
	title: string;
	description: string | null;
	created_at: string;
};

export type Card = {
	id: string;
	deck_id: string;
	user_id: string;
	front: string;
	back: string;
	created_at: string;
};

export type CardSrsMetadata = {
	card_id: string;
	ease_factor: number;
	interval_days: number;
	repetitions: number;
	next_review_at: string;
};

export type ReviewLog = {
	id: string;
	card_id: string;
	user_id: string;
	rating: number;
	response_time_ms: number;
	reviewed_at: string;
};

export type CardWithSrs = Card & {
	srs: CardSrsMetadata;
};
