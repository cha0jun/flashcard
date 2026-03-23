export type GeneratedCard = { front: string; back: string };

export type GenerationResult = {
	title?: string;
	description?: string;
	cards: GeneratedCard[];
};

export type GenerationInput = {
	prompt: string;
	documentText?: string;
	existingDeckTitle?: string;
	cardCount?: number;
};

export interface AIProvider {
	generateCards(input: GenerationInput): AsyncGenerator<GeneratedCard, GenerationResult>;
}
