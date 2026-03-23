import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAIProvider } from '$lib/ai';
import type { GenerationInput } from '$lib/ai';
import { extractText } from '$lib/ai/extract-text';

export const config = { maxDuration: 60 };

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) throw error(401, 'Not authenticated');

	const formData = await request.formData();
	const prompt = formData.get('prompt')?.toString();
	const deckTitle = formData.get('deckTitle')?.toString();
	const cardCountStr = formData.get('cardCount')?.toString();
	const file = formData.get('file') as File | null;

	if (!prompt && (!file || file.size === 0)) {
		throw error(400, 'Prompt or document required');
	}

	const cardCount = cardCountStr ? parseInt(cardCountStr, 10) : 10;
	if (cardCount < 1 || cardCount > 15) {
		throw error(400, 'Card count must be between 1 and 15');
	}

	let documentText: string | undefined;
	if (file && file.size > 0) {
		documentText = await extractText(file);
	}

	const input: GenerationInput = {
		prompt: prompt || 'Generate flashcards from the uploaded document.',
		documentText,
		existingDeckTitle: deckTitle || undefined,
		cardCount
	};

	const provider = getAIProvider();
	const generator = provider.generateCards(input);

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			try {
				let result;
				while (true) {
					const next = await generator.next();
					if (next.done) {
						result = next.value;
						break;
					}
					controller.enqueue(
						encoder.encode(JSON.stringify({ type: 'card', data: next.value }) + '\n')
					);
				}
				if (result?.title) {
					controller.enqueue(
						encoder.encode(
							JSON.stringify({
								type: 'meta',
								data: { title: result.title, description: result.description }
							}) + '\n'
						)
					);
				}
				controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'));
			} catch (err) {
				controller.enqueue(
					encoder.encode(
						JSON.stringify({
							type: 'error',
							data: {
								message: err instanceof Error ? err.message : 'Generation failed'
							}
						}) + '\n'
					)
				);
			}
			controller.close();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'application/x-ndjson',
			'Cache-Control': 'no-cache'
		}
	});
};
