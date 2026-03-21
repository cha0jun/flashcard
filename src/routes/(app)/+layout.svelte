<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { data, children } = $props();

	let sidebarOpen = $state(false);
</script>

<div class="flex h-screen bg-gray-50">
	<!-- Desktop sidebar -->
	<div class="hidden md:block">
		<Sidebar supabase={data.supabase} />
	</div>

	<!-- Mobile header -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<header class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
			<button
				onclick={() => (sidebarOpen = !sidebarOpen)}
				aria-label="Toggle menu"
				class="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<span class="text-lg font-bold text-brand-600">Axonote</span>
			<div class="w-8"></div>
		</header>

		<!-- Mobile sidebar overlay -->
		{#if sidebarOpen}
			<div class="fixed inset-0 z-40 md:hidden">
				<button aria-label="Close menu" class="absolute inset-0 bg-black/30" onclick={() => (sidebarOpen = false)}></button>
				<div class="relative z-50 h-full w-60">
					<Sidebar supabase={data.supabase} />
				</div>
			</div>
		{/if}

		<main class="flex-1 overflow-y-auto p-4 md:p-8">
			{@render children()}
		</main>
	</div>
</div>
