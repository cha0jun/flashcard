import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, GeneratedCard, GenerationInput, GenerationResult } from './provider';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import { extractCompleteCards, parseFullResult } from './parse';

export function createGeminiProvider(apiKey: string): AIProvider {
	const genAI = new GoogleGenerativeAI(apiKey);

	return {
		async *generateCards(
			input: GenerationInput
		): AsyncGenerator<GeneratedCard, GenerationResult> {
			const model = genAI.getGenerativeModel({
				model: 'gemini-3-flash-preview',
				systemInstruction: buildSystemPrompt(),
				generationConfig: {
					responseMimeType: 'application/json',
					maxOutputTokens: 8192
				}
			});

			const result = await model.generateContentStream(buildUserPrompt(input));

			let buffer = '';
			const cards: GeneratedCard[] = [];
			let yieldedCount = 0;

			for await (const chunk of result.stream) {
				const text = chunk.text();
				if (text) {
					buffer += text;

					const newCards = extractCompleteCards(buffer, yieldedCount);
					for (const card of newCards) {
						cards.push(card);
						yieldedCount++;
						yield card;
					}
				}
			}

			const parsed = parseFullResult(buffer);
			return { ...parsed, cards };
		}
	};
}
