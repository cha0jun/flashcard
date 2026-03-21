<script lang="ts">
	import { Layers, BookOpen, Trash2 } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { deleteDeck } from '$lib/db';

	let { data } = $props();

	async function handleDelete(deckId: string) {
		await deleteDeck(data.supabase, deckId);
		invalidateAll();
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Decks</h1>
		<a
			href="/create"
			class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
		>
			New deck
		</a>
	</div>

	{#if data.decks.length === 0}
		<div class="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
			<Layers size={40} class="mx-auto mb-3 text-gray-300" />
			<p class="text-gray-500">No decks yet. Create one to get started.</p>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.decks as deck}
				<div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
					<div class="mb-3 flex items-start justify-between">
						<div>
							<h3 class="font-semibold text-gray-900">{deck.title}</h3>
							{#if deck.description}
								<p class="mt-0.5 text-sm text-gray-500">{deck.description}</p>
							{/if}
						</div>
						<button
							onclick={() => handleDelete(deck.id)}
							class="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
						>
							<Trash2 size={16} />
						</button>
					</div>

					<div class="mb-4 flex gap-4 text-sm text-gray-500">
						<span>{deck.cardCount} cards</span>
						<span>{deck.dueCount} due</span>
					</div>

					{#if deck.dueCount > 0}
						<a
							href="/decks/{deck.id}/study"
							class="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
						>
							<BookOpen size={16} />
							Study ({deck.dueCount})
						</a>
					{:else}
						<div class="rounded-lg bg-gray-50 px-4 py-2 text-center text-sm text-gray-400">
							No cards due
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
