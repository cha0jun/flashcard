<script lang="ts">
	import { goto } from '$app/navigation';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { swipeable } from '$lib/actions/swipeable';
	import { computeNextReview } from '$lib/srs';
	import { reviewCard } from '$lib/db';
	import type { CardWithSrs } from '$lib/types/database';

	let { data } = $props();

	// Intentionally capture initial data — queue is a local mutable copy
	let queue: CardWithSrs[] = $state([...data.cards]); // eslint-disable-line
	let currentIndex = $state(0);
	let flipped = $state(false);
	let dragOffset = $state(0);
	let cardStartTime = $state(Date.now());

	let currentCard = $derived(queue[currentIndex]);
	let progress = $derived(currentIndex / queue.length);

	const ratingLabels = [
		{ value: 2, label: 'Hard', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
		{ value: 3, label: 'Good', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
		{ value: 4, label: 'Easy', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' }
	];

	function handleFlip() {
		if (!flipped) flipped = true;
	}

	async function handleRate(rating: number) {
		if (!currentCard || !data.user) return;

		const responseTime = Date.now() - cardStartTime;
		const nextSrs = computeNextReview(currentCard.srs, rating);

		// Fire review in background
		reviewCard(data.supabase, data.user.id, currentCard.id, rating, responseTime, nextSrs);

		advance();
	}

	function advance() {
		if (currentIndex + 1 >= queue.length) {
			goto('/decks');
			return;
		}
		currentIndex++;
		flipped = false;
		dragOffset = 0;
		cardStartTime = Date.now();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === ' ') {
			e.preventDefault();
			handleFlip();
		} else if (flipped && e.key >= '2' && e.key <= '4') {
			handleRate(parseInt(e.key));
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="mx-auto max-w-lg">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<a href="/decks" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back</a>
		<h1 class="text-lg font-semibold text-gray-900">{data.deck.title}</h1>
		<span class="text-sm text-gray-500">{currentIndex + 1}/{queue.length}</span>
	</div>

	<!-- Practice mode banner -->
	{#if data.mode === 'practice'}
		<div class="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-center text-sm text-amber-700">
			No cards due — practicing all cards
		</div>
	{/if}

	<!-- Progress bar -->
	<div class="mb-6 h-1.5 overflow-hidden rounded-full bg-gray-200">
		<div
			class="h-full rounded-full bg-brand-500 transition-all duration-300"
			style="width: {progress * 100}%"
		></div>
	</div>

	<!-- Card -->
	{#if currentCard}
		<div
			use:swipeable={{
				onSwipe: (dir) => handleRate(dir === 'right' ? 4 : 2),
				onDrag: (offset) => (dragOffset = offset),
				onRelease: () => (dragOffset = 0),
				onTap: () => handleFlip()
			}}
		>
			<Flashcard
				front={currentCard.front}
				back={currentCard.back}
				{flipped}
				{dragOffset}
			/>
		</div>

		<!-- Swipe hints -->
		<div class="mt-3 flex justify-between text-xs text-gray-400">
			<span>&larr; Hard</span>
			<span>Tap to flip</span>
			<span>Easy &rarr;</span>
		</div>

		<!-- Rating buttons (shown after flip) -->
		{#if flipped}
			<div class="mt-6 grid grid-cols-3 gap-2">
				{#each ratingLabels as r}
					<button
						onclick={() => handleRate(r.value)}
						class="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {r.color}"
					>
						{r.label}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Keyboard hint -->
		<p class="mt-4 text-center text-xs text-gray-400">
			Space to flip &middot; 2-4 to rate
		</p>
	{/if}
</div>
