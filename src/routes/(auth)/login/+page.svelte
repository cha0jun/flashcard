<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: authError } = await data.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			error = authError.message;
			loading = false;
			return;
		}

		goto('/');
	}
</script>

<form onsubmit={handleLogin} class="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
	<h2 class="text-lg font-semibold text-gray-900">Sign in</h2>

	{#if error}
		<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
	{/if}

	<div>
		<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
		<input
			id="email"
			type="email"
			bind:value={email}
			required
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
		/>
	</div>

	<div>
		<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
		<input
			id="password"
			type="password"
			bind:value={password}
			required
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
		/>
	</div>

	<button
		type="submit"
		disabled={loading}
		class="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
	>
		{loading ? 'Signing in...' : 'Sign in'}
	</button>

	<p class="text-center text-sm text-gray-500">
		Don't have an account?
		<a href="/signup" class="font-medium text-brand-600 hover:text-brand-700">Sign up</a>
	</p>
</form>
