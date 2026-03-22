<script lang="ts">
	import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let editingCardId = $state<string | null>(null);
	let editFront = $state('');
	let editBack = $state('');

	function startEdit(card: { id: string; front: string; back: string }) {
		editingCardId = card.id;
		editFront = card.front;
		editBack = card.back;
	}

	function cancelEdit() {
		editingCardId = null;
		editFront = '';
		editBack = '';
	}
</script>

<div class="mx-auto max-w-3xl">
	<!-- Header -->
	<div class="mb-6">
		<a
			href="/decks"
			class="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
		>
			<ArrowLeft size={14} />
			Back to decks
		</a>
		<h1 class="text-2xl font-bold text-gray-900">{data.deck.title}</h1>
		<p class="text-sm text-gray-500">{data.cards.length} card{data.cards.length !== 1 ? 's' : ''}</p>
	</div>

	<!-- Add Card Form -->
	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
		class="mb-8 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
	>
		<h2 class="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
			<Plus size={16} />
			Add new card
		</h2>

		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<label for="front" class="mb-1 block text-sm font-medium text-gray-600">Front</label>
				<textarea
					id="front"
					name="front"
					rows="3"
					required
					placeholder="Question or prompt..."
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
				></textarea>
			</div>
			<div>
				<label for="back" class="mb-1 block text-sm font-medium text-gray-600">Back</label>
				<textarea
					id="back"
					name="back"
					rows="3"
					required
					placeholder="Answer..."
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
				></textarea>
			</div>
		</div>

		{#if form?.message}
			<p class="mt-2 text-sm text-red-500">{form.message}</p>
		{/if}

		<button
			type="submit"
			class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
		>
			Add card
		</button>
	</form>

	<!-- Card List -->
	{#if data.cards.length === 0}
		<div class="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
			<p class="text-gray-500">No cards yet. Add your first card above.</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each data.cards as card (card.id)}
				{#if editingCardId === card.id}
					<!-- Editing Mode -->
					<form
						method="POST"
						action="?/update"
						use:enhance={() => {
							return async ({ update }) => {
								cancelEdit();
								await update();
							};
						}}
						class="rounded-xl bg-white p-4 shadow-sm ring-2 ring-brand-300"
					>
						<input type="hidden" name="cardId" value={card.id} />
						<div class="grid gap-3 sm:grid-cols-2">
							<div>
								<label for="edit-front-{card.id}" class="mb-1 block text-xs font-medium text-gray-500">Front</label>
								<textarea
									id="edit-front-{card.id}"
									name="front"
									rows="2"
									required
									bind:value={editFront}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
								></textarea>
							</div>
							<div>
								<label for="edit-back-{card.id}" class="mb-1 block text-xs font-medium text-gray-500">Back</label>
								<textarea
									id="edit-back-{card.id}"
									name="back"
									rows="2"
									required
									bind:value={editBack}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
								></textarea>
							</div>
						</div>
						<div class="mt-3 flex gap-2">
							<button
								type="submit"
								class="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
							>
								<Check size={14} />
								Save
							</button>
							<button
								type="button"
								onclick={cancelEdit}
								class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
							>
								<X size={14} />
								Cancel
							</button>
						</div>
					</form>
				{:else}
					<!-- Display Mode -->
					<div class="group rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
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
						<div class="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
							<button
								onclick={() => startEdit(card)}
								class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
							>
								<Pencil size={12} />
								Edit
							</button>
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
									};
								}}
							>
								<input type="hidden" name="cardId" value={card.id} />
								<button
									type="submit"
									class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
								>
									<Trash2 size={12} />
									Delete
								</button>
							</form>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
