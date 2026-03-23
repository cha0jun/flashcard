import type { GeneratedCard, GenerationResult } from './provider';

const CARD_REGEX =
	/\{\s*"front"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"back"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;

export function extractCompleteCards(buffer: string, alreadyYielded: number): GeneratedCard[] {
	const matches = [...buffer.matchAll(CARD_REGEX)];
	const newCards: GeneratedCard[] = [];

	for (let i = alreadyYielded; i < matches.length; i++) {
		const match = matches[i];
		newCards.push({
			front: unescapeJson(match[1]),
			back: unescapeJson(match[2])
		});
	}

	return newCards;
}

export function parseFullResult(buffer: string): GenerationResult {
	try {
		const parsed = JSON.parse(buffer);
		return {
			title: parsed.title,
			description: parsed.description,
			cards: parsed.cards ?? []
		};
	} catch {
		const cards = [...buffer.matchAll(CARD_REGEX)].map((m) => ({
			front: unescapeJson(m[1]),
			back: unescapeJson(m[2])
		}));

		const titleMatch = buffer.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
		const descMatch = buffer.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/);

		return {
			title: titleMatch ? unescapeJson(titleMatch[1]) : undefined,
			description: descMatch ? unescapeJson(descMatch[1]) : undefined,
			cards
		};
	}
}

function unescapeJson(s: string): string {
	return s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}
