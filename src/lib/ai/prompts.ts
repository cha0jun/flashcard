import type { GenerationInput } from './provider';

export function buildSystemPrompt(): string {
	return `You are a flashcard generation expert. Generate high-quality flashcards for studying.

Rules:
- One concept per card — no overloading
- Front: clear "Why/How/When" question or prompt (avoid yes/no)
- Back: concise answer using bullet points, not paragraphs; add mnemonics or context where helpful
- Write in plain, direct language
- Cover material comprehensively without redundancy

Respond with ONLY valid JSON in this exact format:
{
  "title": "Deck Title",
  "description": "Brief deck description",
  "cards": [
    {"front": "Question text", "back": "Answer text"}
  ]
}

When adding cards to an existing deck, omit "title" and "description" — only return the "cards" array.`;
}



export function buildUserPrompt(input: GenerationInput): string {
	const parts: string[] = [];

	if (input.existingDeckTitle) {
		parts.push(
			`Add cards to an existing deck titled "${input.existingDeckTitle}". Omit title and description from output.`
		);
	} else {
		parts.push('Generate a new deck with title, description, and cards.');
	}

	parts.push(`Topic/instructions: ${input.prompt}`);
	parts.push(`Generate approximately ${input.cardCount ?? 20} cards.`);

	if (input.documentText) {
		parts.push(`\nSource document:\n---\n${input.documentText}\n---`);
	}

	return parts.join('\n\n');
}
