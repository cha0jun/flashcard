import OpenAI from 'openai';
import type { AIProvider, GeneratedCard, GenerationInput, GenerationResult } from './provider';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import { extractCompleteCards, parseFullResult } from './parse';

export function createOpenAIProvider(apiKey: string): AIProvider {
	const client = new OpenAI({ apiKey });

	return {
		async *generateCards(
			input: GenerationInput
		): AsyncGenerator<GeneratedCard, GenerationResult> {
			const stream = await client.chat.completions.create({
				model: 'gpt-4o-mini',
				max_tokens: 8192,
				response_format: { type: 'json_object' },
				stream: true,
				messages: [
					{ role: 'system', content: buildSystemPrompt() },
					{ role: 'user', content: buildUserPrompt(input) }
				]
			});

			let buffer = '';
			const cards: GeneratedCard[] = [];
			let yieldedCount = 0;

			for await (const chunk of stream) {
				const delta = chunk.choices[0]?.delta?.content;
				if (delta) {
					buffer += delta;

					const newCards = extractCompleteCards(buffer, yieldedCount);
					for (const card of newCards) {
						cards.push(card);
						yieldedCount++;
						yield card;
					}
				}
			}

			const result = parseFullResult(buffer);
			return { ...result, cards };
		}
	};
}
