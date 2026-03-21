<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { createDeck } from '$lib/db';

	let { data } = $props();

	let title = $state('');
	let description = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleCreate(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const user = data.user;
			if (!user) return;

			await createDeck(data.supabase, user.id, title, description || undefined);
			await invalidateAll();
			goto('/decks');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create deck';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Create deck</h1>

	<form onsubmit={handleCreate} class="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
		{#if error}
			<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
		{/if}

		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				required
				placeholder="e.g. Spanish Vocabulary"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
				Description <span class="text-gray-400">(optional)</span>
			</label>
			<textarea
				id="description"
				bind:value={description}
				rows="3"
				placeholder="What is this deck about?"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
			></textarea>
		</div>

		<div class="flex gap-3">
			<a
				href="/decks"
				class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Cancel
			</a>
			<button
				type="submit"
				disabled={loading}
				class="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
			>
				{loading ? 'Creating...' : 'Create deck'}
			</button>
		</div>
	</form>
</div>
