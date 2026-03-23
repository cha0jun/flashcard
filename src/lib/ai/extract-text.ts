const MAX_TEXT_LENGTH = 100_000;

export async function extractText(file: File): Promise<string> {
	const type = file.type;

	let text: string;

	if (type === 'text/plain' || type === 'text/markdown') {
		text = await file.text();
	} else if (type === 'application/pdf') {
		const { PDFParse } = await import('pdf-parse');
		const data = new Uint8Array(await file.arrayBuffer());
		const parser = new PDFParse({ data });
		const result = await parser.getText();
		text = result.text;
	} else {
		throw new Error(`Unsupported file type: ${type}. Upload a PDF or text file.`);
	}

	if (text.length > MAX_TEXT_LENGTH) {
		text = text.slice(0, MAX_TEXT_LENGTH);
	}

	return text;
}
