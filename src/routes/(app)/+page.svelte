<script lang="ts">
	import { Flame, Layers, CreditCard, BookOpen } from 'lucide-svelte';

	let { data } = $props();

	let stats = $derived([
		{ label: 'Decks', value: data.stats.deckCount, icon: Layers, color: 'text-blue-600 bg-blue-50' },
		{ label: 'Cards', value: data.stats.cardCount, icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
		{ label: 'Streak', value: `${data.stats.streak}d`, icon: Flame, color: 'text-orange-600 bg-orange-50' },
		{ label: 'Today', value: data.stats.reviewsToday, icon: BookOpen, color: 'text-purple-600 bg-purple-50' }
	]);
</script>

<div class="mx-auto max-w-4xl">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each stats as stat}
			<div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
				<div class="mb-2 flex items-center gap-2">
					<div class="rounded-lg p-1.5 {stat.color}">
						<stat.icon size={16} />
					</div>
					<span class="text-sm text-gray-500">{stat.label}</span>
				</div>
				<p class="text-2xl font-bold text-gray-900">{stat.value}</p>
			</div>
		{/each}
	</div>

	{#if data.stats.deckCount === 0}
		<div class="mt-8 rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
			<Layers size={40} class="mx-auto mb-3 text-gray-300" />
			<h2 class="text-lg font-semibold text-gray-900">No decks yet</h2>
			<p class="mt-1 text-sm text-gray-500">Create your first deck to start studying.</p>
			<a
				href="/create"
				class="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
			>
				Create deck
			</a>
		</div>
	{/if}
</div>
