import { GEMINI_API_KEY } from '$env/static/private';
import { createGeminiProvider } from './gemini';
import type { AIProvider } from './provider';

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
	if (!provider) {
		provider = createGeminiProvider(GEMINI_API_KEY);
	}
	return provider;
}

export type { GeneratedCard, GenerationResult, GenerationInput } from './provider';
