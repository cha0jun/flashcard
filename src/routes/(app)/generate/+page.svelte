<script lang="ts">
	import { goto } from '$app/navigation';
	import { Sparkles, Trash2, Pencil, Check, X, Upload, Loader2 } from 'lucide-svelte';

	let { data } = $props();

	let mode = $state<'new' | 'existing'>('new');
	let prompt = $state('');
	let file = $state<File | null>(null);
	let cardCount = $state(20);
	let selectedDeckId = $state(data.decks[0]?.id ?? '');

	let generatedCards = $state<{ front: string; back: string }[]>([]);
	let generatedMeta = $state<{ title: string; description: string } | null>(null);
	let generating = $state(false);
	let saving = $state(false);
	let errorMsg = $state('');

	let editingIndex = $state<number | null>(null);
	let editFront = $state('');
	let editBack = $state('');

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		file = input.files?.[0] ?? null;
	}

	async function handleGenerate() {
		if (!prompt && !file) {
			errorMsg = 'Enter a topic or upload a document.';
			return;
		}

		generating = true;
		errorMsg = '';
		generatedCards = [];
		generatedMeta = null;

		const formData = new FormData();
		if (prompt) formData.append('prompt', prompt);
		formData.append('cardCount', String(cardCount));
		if (file) formData.append('file', file);
		if (mode === 'existing') {
			const deck = data.decks.find((d) => d.id === selectedDeckId);
			if (deck) formData.append('deckTitle', deck.title);
		}

		try {
			const res = await fetch('/api/generate', { method: 'POST', body: formData });
			if (!res.ok) {
				errorMsg = `Generation failed (${res.status})`;
				generating = false;
				return;
			}

			const reader = res.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop()!;

				for (const line of lines) {
					if (!line.trim()) continue;
					const msg = JSON.parse(line);

					if (msg.type === 'card') {
						generatedCards = [...generatedCards, msg.data];
					} else if (msg.type === 'meta') {
						generatedMeta = msg.data;
					} else if (msg.type === 'error') {
						errorMsg = msg.data.message;
					}
				}
			}
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Generation failed';
		}

		generating = false;
	}

	async function handleSave() {
		if (!generatedCards.length) return;

		saving = true;
		errorMsg = '';

		const body =
			mode === 'new'
				? {
						mode: 'new' as const,
						title: generatedMeta?.title || prompt.slice(0, 60),
						description: generatedMeta?.description,
						cards: generatedCards
					}
				: {
						mode: 'existing' as const,
						deckId: selectedDeckId,
						cards: generatedCards
					};

		try {
			const res = await fetch('/api/generate/save', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				errorMsg = `Save failed (${res.status})`;
				saving = false;
				return;
			}

			const result = await res.json();
			goto(`/decks/${result.deckId}/cards`);
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Save failed';
			saving = false;
		}
	}

	function removeCard(index: number) {
		generatedCards = generatedCards.filter((_, i) => i !== index);
	}

	function startEdit(index: number) {
		editingIndex = index;
		editFront = generatedCards[index].front;
		editBack = generatedCards[index].back;
	}

	function saveEdit() {
		if (editingIndex === null) return;
		generatedCards = generatedCards.map((c, i) =>
			i === editingIndex ? { front: editFront, back: editBack } : c
		);
		editingIndex = null;
	}

	function cancelEdit() {
		editingIndex = null;
	}
</script>

<div class="mx-auto max-w-3xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">AI Generate</h1>
		<p class="text-sm text-gray-500">Generate flashcards from a topic or document</p>
	</div>

	<!-- Generation Form -->
	<div class="mb-8 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
		<!-- Mode Toggle -->
		<div class="mb-4 flex gap-2">
			<button
				onclick={() => (mode = 'new')}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {mode === 'new'
					? 'bg-brand-600 text-white'
					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
			>
				New Deck
			</button>
			<button
				onclick={() => (mode = 'existing')}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {mode === 'existing'
					? 'bg-brand-600 text-white'
					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
			>
				Add to Existing
			</button>
		</div>

		<!-- Deck Selector (existing mode) -->
		{#if mode === 'existing'}
			<div class="mb-4">
				<label for="deck-select" class="mb-1 block text-sm font-medium text-gray-600"
					>Select deck</label
				>
				{#if data.decks.length === 0}
					<p class="text-sm text-gray-400">No decks yet. Switch to "New Deck" mode.</p>
				{:else}
					<select
						id="deck-select"
						bind:value={selectedDeckId}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
					>
						{#each data.decks as deck}
							<option value={deck.id}>{deck.title}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/if}

		<!-- Prompt -->
		<div class="mb-4">
			<label for="prompt" class="mb-1 block text-sm font-medium text-gray-600"
				>Topic or instructions</label
			>
			<textarea
				id="prompt"
				bind:value={prompt}
				rows="3"
				placeholder="e.g. Japanese JLPT N5 vocabulary, key concepts of photosynthesis..."
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
			></textarea>
		</div>

		<!-- File Upload -->
		<div class="mb-4">
			<label for="file-upload" class="mb-1 block text-sm font-medium text-gray-600"
				>Upload document (optional)</label
			>
			<div class="flex items-center gap-3">
				<label
					for="file-upload"
					class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
				>
					<Upload size={16} />
					{file ? file.name : 'Choose file'}
				</label>
				<input
					id="file-upload"
					type="file"
					accept=".pdf,.txt,.md"
					onchange={handleFileChange}
					class="hidden"
				/>
				{#if file}
					<button
						onclick={() => (file = null)}
						class="text-sm text-gray-400 hover:text-gray-600"
					>
						Remove
					</button>
				{/if}
			</div>
			<p class="mt-1 text-xs text-gray-400">PDF, TXT, or MD files</p>
		</div>

		<!-- Card Count -->
		<div class="mb-4">
			<label for="card-count" class="mb-1 block text-sm font-medium text-gray-600"
				>Number of cards: {cardCount}</label
			>
			<input
				id="card-count"
				type="range"
				bind:value={cardCount}
				min="5"
				max="50"
				step="5"
				class="w-full accent-brand-600"
			/>
			<div class="flex justify-between text-xs text-gray-400">
				<span>5</span>
				<span>50</span>
			</div>
		</div>

		{#if errorMsg}
			<p class="mb-4 text-sm text-red-500">{errorMsg}</p>
		{/if}

		<button
			onclick={handleGenerate}
			disabled={generating || (!prompt && !file)}
			class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
		>
			{#if generating}
				<Loader2 size={16} class="animate-spin" />
				Generating...
			{:else}
				<Sparkles size={16} />
				Generate Cards
			{/if}
		</button>
	</div>

	<!-- Generated Cards Preview -->
	{#if generatedCards.length > 0 || generating}
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900">
				Generated Cards ({generatedCards.length})
			</h2>
			{#if generatedCards.length > 0 && !generating}
				<button
					onclick={handleSave}
					disabled={saving}
					class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
				>
					{#if saving}
						<Loader2 size={16} class="animate-spin" />
						Saving...
					{:else}
						Save All
					{/if}
				</button>
			{/if}
		</div>

		<!-- Editable title/description for new deck -->
		{#if mode === 'new' && generatedMeta}
			<div class="mb-4 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-200">
				<div class="mb-2">
					<label for="gen-title" class="mb-1 block text-xs font-medium text-brand-600"
						>Deck Title</label
					>
					<input
						id="gen-title"
						type="text"
						bind:value={generatedMeta.title}
						class="w-full rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="gen-desc" class="mb-1 block text-xs font-medium text-brand-600"
						>Description</label
					>
					<input
						id="gen-desc"
						type="text"
						bind:value={generatedMeta.description}
						class="w-full rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
					/>
				</div>
			</div>
		{/if}

		<div class="space-y-3">
			{#each generatedCards as card, i (i)}
				{#if editingIndex === i}
					<div class="rounded-xl bg-white p-4 shadow-sm ring-2 ring-brand-300">
						<div class="grid gap-3 sm:grid-cols-2">
							<div>
								<label for="edit-front-{i}" class="mb-1 block text-xs font-medium text-gray-500"
									>Front</label
								>
								<textarea
									id="edit-front-{i}"
									rows="2"
									bind:value={editFront}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
								></textarea>
							</div>
							<div>
								<label for="edit-back-{i}" class="mb-1 block text-xs font-medium text-gray-500"
									>Back</label
								>
								<textarea
									id="edit-back-{i}"
									rows="2"
									bind:value={editBack}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
								></textarea>
							</div>
						</div>
						<div class="mt-3 flex gap-2">
							<button
								onclick={saveEdit}
								class="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
							>
								<Check size={14} />
								Save
							</button>
							<button
								onclick={cancelEdit}
								class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
							>
								<X size={14} />
								Cancel
							</button>
						</div>
					</div>
				{:else}
					<div class="group rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
						<div class="mb-1 text-xs text-gray-400">Card {i + 1}</div>
						<div class="grid gap-3 sm:grid-cols-2">
							<div>
								<span class="mb-1 block text-xs font-medium text-gray-400">Front</span>
								<p class="text-sm text-gray-800">{card.front}</p>
							</div>
							<div>
								<span class="mb-1 block text-xs font-medium text-gray-400">Back</span>
								<p class="text-sm text-gray-800">{card.back}</p>
							</div>
						</div>
						<div
							class="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<button
								onclick={() => startEdit(i)}
								class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
							>
								<Pencil size={12} />
								Edit
							</button>
							<button
								onclick={() => removeCard(i)}
								class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
							>
								<Trash2 size={12} />
								Remove
							</button>
						</div>
					</div>
				{/if}
			{/each}

			{#if generating}
				<div class="flex items-center justify-center gap-2 rounded-xl bg-gray-50 p-6 text-sm text-gray-400">
					<Loader2 size={16} class="animate-spin" />
					Generating cards...
				</div>
			{/if}
		</div>

		<!-- Bottom save button -->
		{#if generatedCards.length > 0 && !generating}
			<div class="mt-6 flex justify-end">
				<button
					onclick={handleSave}
					disabled={saving}
					class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
				>
					{#if saving}
						<Loader2 size={16} class="animate-spin" />
						Saving...
					{:else}
						Save {generatedCards.length} Cards
					{/if}
				</button>
			</div>
		{/if}
	{/if}
</div>
