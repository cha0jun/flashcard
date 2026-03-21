<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();

	async function handleSignOut() {
		await data.supabase.auth.signOut();
		goto('/login');
	}
</script>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

	<div class="space-y-4">
		<div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
			<h2 class="mb-1 font-semibold text-gray-900">Account</h2>
			<p class="text-sm text-gray-500">{data.user?.email}</p>
		</div>

		<button
			onclick={handleSignOut}
			class="w-full rounded-xl bg-white p-4 text-left text-sm font-medium text-red-600 shadow-sm ring-1 ring-gray-200 hover:bg-red-50"
		>
			Sign out
		</button>
	</div>
</div>
