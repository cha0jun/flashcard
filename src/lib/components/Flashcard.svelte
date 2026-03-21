<script lang="ts">
	let { front, back, flipped, dragOffset = 0 }: {
		front: string;
		back: string;
		flipped: boolean;
		dragOffset?: number;
	} = $props();

	let rotation = $derived(flipped ? 180 : 0);
	let dragRotation = $derived(dragOffset * 0.1);
	let opacity = $derived(1 - Math.min(Math.abs(dragOffset) / 200, 0.5));
</script>

<div
	class="relative h-64 w-full cursor-pointer select-none sm:h-80"
	style="perspective: 1000px"
>
	<div
		class="absolute inset-0 transition-transform duration-500"
		style="
			transform-style: preserve-3d;
			transform: rotateY({rotation}deg) translateX({dragOffset}px) rotate({dragRotation}deg);
			opacity: {opacity};
		"
	>
		<!-- Front -->
		<div
			class="absolute inset-0 flex items-center justify-center rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200"
			style="backface-visibility: hidden"
		>
			<p class="text-center text-lg font-medium text-gray-900">{front}</p>
		</div>

		<!-- Back -->
		<div
			class="absolute inset-0 flex items-center justify-center rounded-2xl bg-brand-50 p-8 shadow-lg ring-1 ring-brand-200"
			style="backface-visibility: hidden; transform: rotateY(180deg)"
		>
			<p class="text-center text-lg text-gray-800">{back}</p>
		</div>
	</div>
</div>
