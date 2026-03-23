import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, GeneratedCard, GenerationInput, GenerationResult } from './provider';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import { extractCompleteCards, parseFullResult } from './parse';

export function createAnthropicProvider(apiKey: string): AIProvider {
	const client = new Anthropic({ apiKey });

	return {
		async *generateCards(
			input: GenerationInput
		): AsyncGenerator<GeneratedCard, GenerationResult> {
			const stream = client.messages.stream({
				model: 'claude-sonnet-4-20250514',
				max_tokens: 8192,
				system: buildSystemPrompt(),
				messages: [{ role: 'user', content: buildUserPrompt(input) }]
			});

			let buffer = '';
			const cards: GeneratedCard[] = [];
			let yieldedCount = 0;

			for await (const event of stream) {
				if (
					event.type === 'content_block_delta' &&
					event.delta.type === 'text_delta'
				) {
					buffer += event.delta.text;

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
