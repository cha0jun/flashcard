<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-brand-600">Axonote</h1>
			<p class="mt-1 text-sm text-gray-500">AI-powered flashcards</p>
		</div>
		{@render children()}
	</div>
</div>
