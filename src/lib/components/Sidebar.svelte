<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { LayoutDashboard, Layers, Plus, Sparkles, Settings, LogOut } from 'lucide-svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	let { supabase }: { supabase: SupabaseClient } = $props();

	const links = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/decks', label: 'Decks', icon: Layers },
		{ href: '/create', label: 'New Deck', icon: Plus },
		{ href: '/generate', label: 'AI Generate', icon: Sparkles },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];

	async function signOut() {
		await supabase.auth.signOut();
		goto('/login');
	}
</script>

<aside class="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
	<div class="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
		<span class="text-xl font-bold text-brand-600">Axonote</span>
	</div>

	<nav class="flex flex-1 flex-col gap-1 p-3">
		{#each links as link}
			<a
				href={link.href}
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
					{page.url.pathname === link.href
					? 'bg-brand-50 text-brand-700'
					: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
			>
				<link.icon size={18} />
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="border-t border-gray-200 p-3">
		<button
			onclick={signOut}
			class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
		>
			<LogOut size={18} />
			Sign out
		</button>
	</div>
</aside>
